const guestOrderListElement = document.getElementById('order-wrapper');

let guestOrderId = 0;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function setGuestOrderList(date, status, orderItems, totalPrice, id) {
  orderItems.forEach(({ option, quantity, item }) => {
    // 이미지 경로 수정되면 image 추가
    const productName = `${item.name} [${option.color} / ${option.size}]`;
    // const img = image.url ? image.url : '';
    const element = `<tr id="order-${guestOrderId}">
              <td id="order-date-id">${date}</br>[${id}]</td>
              <td id="order-img">img</td>
              <td id="order-product">${productName}</td>
              <td id="order-quantity">${quantity}</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-status">${status}</td>
            </tr>`;

    guestOrderListElement.insertAdjacentHTML('beforeend', element);
    guestOrderId += 1;
  });
}

async function guestApi() {
  const guestApiUrl = '/api/v1/orders/get/guest';
  // const guestApiUrl = './order.json';
  try {
    const response = await fetch(guestApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ GuestOrderId: sessionStorage.getItem('loginId') }),
    });

    const data = await response.json(); //받아올 데이터

    const { orders } = data;
    console.log(orders);

    orders.forEach((order) => {
      const { createdAt, status, orderItems, totalPrice, _id: id } = order;
      const date = formatDate(createdAt);

      setGuestOrderList(date, status, orderItems, totalPrice, id);
    });
  } catch (err) {
    console.error(err);
    alert('주문 조회 중 오류 발생 : ', err);

    // 주문 일자 바꿔주는 함수
  }
}

guestApi();
