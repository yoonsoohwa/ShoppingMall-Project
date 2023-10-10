const orderListEl = document.getElementById('order-list');

function formatDate(createdAt) {
    const orderDate = createdAt.split('.')[0];
    const date = orderDate.split('T')[0];
    const time = orderDate.split('T')[1];

    return `${date} ${time}`;
}

function setOrderList(date, id, addressee, orderItems, totalPrice, payMethod, status) {
    const element = `<tr>
              <td><input class="form-check-input" type="checkbox" id="check-item"></td>
              <td id="order-date">${date.replace(' ', '<br>')}</td>
              <td id="order-id">${id}</td>
              <td id="order-username">${addressee}</td>
              <td id="order-product">Cross Tote Bag</td>
              <td id="order-price">${totalPrice}</td>
              <td id="order-payment">${payMethod}</td>
              <td id="order-payment-status">입금완료</td>
              <td id="order-status">${status}</td>
              <td id="order-cancel"><button type="button" class="pro-modify btn btn-secondary btn-sm">취소</button></td>
            </tr>`
    
    orderListEl.insertAdjacentHTML('beforeend', element);
}

async function insertOrderList() {
    const url = '../../../js/Admin/order/orderlistdata.json';    // 임시 데이터
    // const url = '';

    try {
        const res = await fetch(url);
        const data = await res.json();

        const {orders} = data;
        orders.forEach(order => {
            console.log(order);
            const { createdAt, address, orderItems, totalPrice, payMethod, status, _id: id } = order;
            const { addressee } = address;
            const date = formatDate(createdAt);

            setOrderList(date, id, addressee, orderItems, totalPrice, payMethod, status);
        });

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-alert
        alert('주문 조회 중 오류 발생 : ', err);
    }
}

insertOrderList();