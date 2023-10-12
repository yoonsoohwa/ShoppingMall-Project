//회원

const userOrderListElement = document.getElementById('order-wrapper');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setUserOrderList(date, _id, orderItems, totalPrice, status) {
  orderItems.forEach(({ option, quantity }) => {
    const productName = `[${option.color} / ${option.size}]`;
    const element = `<tr id="order-${orderId}">
              <td id="order-date-id">${date}</br>[${_id}]</td>
              <td id="order-img">img</td>
              <td id="order-product">${productName}</td>
              <td id="order-quatity">${quantity}</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-status">${status}</td>
            </tr>`;

    userOrderListElement.insertAdjacentHTML('beforeend', element);
    orderId += 1;
  });
  // const itemText = orderItems.length <= 1 ? `${orderItems[0]}` : `${orderItems[0]} 외 ${orderItems.length - 1}개`;
}

async function userApi() {
  const userApiUrl = '/api/v1/orders/page/1/20';
  // const guestApiUrl = './order.json';
  try {
    const res = await fetch(guestApiUrl);

    const userData = await res.json(); //받아올 데이터

    const { orders } = userData;
    console.log(orders);

    orders.forEach((order) => {
      const { _id, createdAt, orderItems, totalPrice, status } = order;

      const date = formatDate(createdAt);
      setUserOrderList(date, _id, orderItems, totalPrice, status);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line no-alert
    alert('주문 조회 중 오류 발생 : ', err);

    // 주문 일자 바꿔주는 함수
  }
}

userApi();
