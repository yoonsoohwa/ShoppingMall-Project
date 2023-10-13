//회원

const userOrderListElement = document.getElementById('order-wrapper');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setOrderList(date, status, orderItem, totalPrice, id) {
  const { option, quantity, item } = orderItem;

  const color = option?.color ? `${option.color} ` : '';
  const size = option?.size ? `${option.size} ` : '';
  const optionString = option === '' ? '' : `[${color} / ${size}]`;
  const productName = `${item.name} ${optionString}`;

  const img = item.image.url ? item.image.url : '';
  const element = `<tr id="order-${orderId}">
              <td id="order-date-id">${date}</br>[${id}]</td>
              <td id="order-img"><img src={${img}}/></td>
              <td id="order-product">${productName}</td>
              <td id="order-quantity">${quantity}</td>
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

    const { order } = data;

    order.orderItems.forEach((orderItem) => {
      const { createdAt, _id: id } = orderItem;
      const date = formatDate(createdAt);

      setOrderList(date, order.status, orderItem, order.totalPrice, id);
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
