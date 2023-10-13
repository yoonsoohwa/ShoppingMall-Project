//회원

const userOrderListElement = document.getElementById('order-wrapper');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setUserOrderList(date, status, orderItems, totalPrice, id) {
  orderItems.forEach(({ option, quantity, item }) => {
    //이미지 경로 수정되면 image 추가
    const productName = `${item.name} [${option.color} / ${option.size}]`;
    // const img = image.url ? image.url : '';
    const element = `<tr id="order-${orderId}">
              <td id="order-date-id">${date}</br>[${id}]</td>
              <td id="order-img">img</td>
              <td id="order-product">${productName}</td>
              <td id="order-quantity">${quantity}</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-status">${status}</td>
            </tr>`;

    userOrderListElement.insertAdjacentHTML('beforeend', element);
    orderId += 1;
  });
}

async function userApi() {
  const userApiUrl = '/api/v1/orders/page/1/20';
  // const userApiUrl = './order.json';
  try {
    const res = await fetch(userApiUrl);

    const userData = await res.json(); //받아올 데이터

    const { orders } = userData;

    orders.forEach((order) => {
      const { createdAt, status, orderItems, totalPrice, _id: id } = order;
      const date = formatDate(createdAt);

      setUserOrderList(date, status, orderItems, totalPrice, id);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line no-alert
    alert('주문 조회 중 오류 발생 유저 : ', err);
  }
}

async function guestApi() {
  const guestApiUrl = '/api/v1/orders/get/guest';
  // const guestApiUrl = './order.json';
  try {
    const response = await fetch(guestApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ GuestOrderId: sessionStorage.getItem('loginId') }),
    });

    const data = await response.json(); //받아올 데이터

    const { orders } = data;

    orders.forEach((order) => {
      const { createdAt, status, orderItems, totalPrice, _id: id } = order;
      const date = formatDate(createdAt);

      setGuestOrderList(date, status, orderItems, totalPrice, id);
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

checkLogin() ? userApi() : guestApi();
