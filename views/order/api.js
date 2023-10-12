const orderListElement = document.getElementById('order-wrapper');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setGuestOrderList(date, _id, orderItems, totalPrice, status) {
  // const itemText = orderItems.length <= 1 ? `${orderItems[0]}` : `${orderItems[0]} 외 ${orderItems.length - 1}개`;

  const element = `<tr id="order-${orderId}">
              <td id="order-date-id">${date}</br>[${_id}]</td>
              <td id="order-img">img</td>
              <td id="order-product">${orderItems}</td>
              <td id="order-quatity">1</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-status">${status}</td>
            </tr>`;

  console.log(orderListElement);

  orderListElement.insertAdjacentHTML('beforeend', element);
  orderId += 1;
}

async function guestApi() {
  const guestApiUrl = 'http://localhost:5001/api/v1/orders/get/guest';
  // const guestApiUrl = './order.json';
  try {
    const res = await fetch(guestApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: sessionStorage.getItem('loginId') }),
    });
    // const res = await fetch(guestApiUrl);

    const data = await res.json(); //받아올 데이터

    const { order: orders } = data;
    console.log(orders);

    orders.forEach((order) => {
      const { _id, createdAt, orderItems, totalPrice, status } = order;
      const date = formatDate(createdAt);
      setGuestOrderList(date, _id, orderItems, totalPrice, status);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line no-alert
    alert('주문 조회 중 오류 발생 : ', err);

    // 주문 일자 바꿔주는 함수
  }
}

guestApi();
