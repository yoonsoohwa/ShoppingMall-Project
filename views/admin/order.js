const orderListEl = document.getElementById('order-list');
const checkAll = document.getElementById('check-all');
const totalEl = document.getElementById('total');
const cancelBtn = document.getElementById('order-cancel');

let orderId;

function formatDate(createdAt) {
  const orderDate = createdAt.split('.')[0];
  const date = orderDate.split('T')[0];
  const time = orderDate.split('T')[1];

  return `${date} ${time}`;
}

function selectAllCheckboxes() {
  const checkBoxElList = Array.from(document.querySelectorAll('#check-item'));

  if (checkAll.checked) {
    checkBoxElList.forEach((el) => {
      const element = el;
      element.checked = true;
    });
  } else {
    checkBoxElList.forEach((el) => {
      const element = el;
      element.checked = false;
    });
  }
}

async function deleteOrder(idList) {
  const url = `/api/v1/orders`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderIds: idList,
      }),
    });

    if (res.status === 200) {
      // eslint-disable-next-line no-alert
      alert('선택하신 주문이 취소되었습니다');
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(`주문을 취소할 수 없습니다.`);
  }
}

function setOrderList(date, id, addressee, orderItems, totalPrice, status) {
  let totalQuantity = 0;
  const productList = orderItems.map(({ option, quantity, item }) => {
    const productName = `${item.name} [${option.color} / ${option.size}]`;
    totalQuantity += quantity;
    return [productName, quantity];
  });
  const itemText =
    productList.length <= 1 ? `${productList[0][0]}` : `${productList[0][0]} 외 ${productList.length - 1}개`;

  const element = `<tr id="order-${orderId}">
              <td><input class="form-check-input" type="checkbox" id="check-item"></td>
              <td id="order-date">${date.replace(' ', '<br>')}</td>
              <td id="order-id">${id}</td>
              <td id="order-username">${addressee}</td>
              <td id="order-product">${itemText}</td>
              <td id="order-product">${totalQuantity}</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-status">${status}</td>
            </tr>`;

  orderListEl.insertAdjacentHTML('beforeend', element);
  orderId += 1;
}

async function insertOrderList() {
  // const url = './order/orderlistdata.json';    // 임시 데이터
  const url = '/api/v1/orders/1/20';

  try {
    const res = await fetch(url);
    const data = await res.json();

    orderId = 0;
    const { orders } = data;
    orders.forEach((order) => {
      const { createdAt, address, orderItems, totalPrice, status, _id: id } = order;

      const { addressee } = address;
      const date = formatDate(createdAt);
      setOrderList(date, id, addressee, orderItems, totalPrice, status);
    });

    totalEl.innerText = `[총 ${orders.length}개]`;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line no-alert
    alert('주문 조회 중 오류 발생 : ', err);
  }
}

function orderCancel() {
  const checkList = document.querySelectorAll('#check-item');

  const checkedOrders = [...checkList]
    .map((order, idx) => {
      if (order.checked === true) {
        return document.querySelector(`#order-${idx} #order-id`).textContent;
      }
      return null;
    })
    .filter((order) => order);

  if (checkedOrders.length === 0) {
    // eslint-disable-next-line no-alert
    alert('취소할 주문을 선택해 주세요.');
    return;
  }

  if (window.confirm('선택한 주문을 취소하시겠습니까?')) {
    deleteOrder(checkedOrders);
    while (orderListEl.firstChild) {
      orderListEl.removeChild(orderListEl.firstChild);
    }
    checkAll.checked = false;
    insertOrderList();
  }
}

insertOrderList();
checkAll.addEventListener('click', selectAllCheckboxes);
cancelBtn.addEventListener('click', orderCancel);
