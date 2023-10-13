//회원

const userOrderListElement = document.getElementById('order-wrapper');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setOrderList(date, id, orderItems, status, totalPrice) {
    let totalQuantity = 0;
    const productList = orderItems.map(({ option, quantity, item }) => {
        const productName = `${item.name} [${option.color} / ${option.size}]`;
        totalQuantity += quantity;
        return [productName, quantity, item.image.url];
    });
    const itemText =
        productList.length <= 1 ? `${productList[0][0]}` : `${productList[0][0]} 외 ${productList.length - 1}개`;


  const element = `<tr id="order-${orderId}">
              <td id="order-date-id">${date}</br>[${id}]</td>
              <td id="order-img"><img src=${productList[0][2]}/></td>
              <td id="order-product">${itemText}</td>
              <td id="order-quantity">${totalQuantity}</td>
              <td id="order-price">${Number(totalPrice).toLocaleString()}원</td>
              <td id="order-status">${status}</td>
            </tr>`;

  userOrderListElement.insertAdjacentHTML('beforeend', element);
  orderId += 1;
}

async function getListData(isLogin) {
  const guestApiUrl = isLogin ? '/api/v1/orders/page/1/20' : '/api/v1/orders/get/guest';
  // const guestApiUrl = './order.json';
  try {
    const response = await fetch(guestApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: sessionStorage.getItem('loginId') }),
      // body: JSON.stringify({ orderId: '65298d406e68f86b33c7fc47' }),
    });

    const data = await response.json(); //받아올 데이터

      const { orders } = data;

      orders.forEach((orderItem) => {
      const { createdAt, _id: id, orderItems, status, totalPrice } = orderItem;
        const date = formatDate(createdAt);

          setOrderList(date, id, orderItems, status, totalPrice);
    });
  } catch (err) {
    console.error(err);
    alert('주문 조회 중 오류 발생 : ', err);
  }
}

async function checkLogin() {
  try {
    const res = await fetch(`/api/v1/users/check-login`, {
      credentials: 'include',
    });
    const data = await res.json();
    const { isLoggedIn } = data;
    return isLoggedIn;
  } catch (error) {
    alert('데이터를 가져오는 중 에러 발생:', error);
  }
}

const getData = async () => {
  const response = await checkLogin();

  getListData(response);
};

getData();
