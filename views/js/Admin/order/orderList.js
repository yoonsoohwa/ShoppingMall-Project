const orderListEl = document.getElementById('order-list');
const checkAll = document.getElementById('check-all');
const totalEl = document.getElementById('total');

function formatDate(createdAt) {
    const orderDate = createdAt.split('.')[0];
    const date = orderDate.split('T')[0];
    const time = orderDate.split('T')[1];

    return `${date} ${time}`;
}

function selectAllCheckboxes() {
    const checkBoxElList = Array.from(document.querySelectorAll('#check-item'));

    if (checkAll.checked) {
        checkBoxElList.forEach(el => {
            const element = el;
            element.checked = true;
        });
    } else {
        checkBoxElList.forEach(el => {
            const element = el;
            element.checked = false;
        });
    }
}

function setOrderList(date, id, addressee, orderItems, totalPrice, payMethod, status) {
    const itemText = orderItems.length <= 1 ? `${orderItems[0]}` : `${orderItems[0]} 외 ${orderItems.length - 1}개`;

    const element = `<tr>
              <td><input class="form-check-input" type="checkbox" id="check-item"></td>
              <td id="order-date">${date.replace(' ', '<br>')}</td>
              <td id="order-id">${id}</td>
              <td id="order-username">${addressee}</td>
              <td id="order-product">${itemText}</td>
              <td id="order-price">${totalPrice.toLocaleString()}</td>
              <td id="order-payment">${payMethod}</td>
              <td id="order-payment-status">입금완료</td>
              <td id="order-status">${status}</td>
              <td id="order-cancel"><button type="button" class="pro-modify btn btn-secondary btn-sm">취소</button></td>
            </tr>`
    
    orderListEl.insertAdjacentHTML('beforeend', element);
}

async function insertOrderList() {
    const url = '../../../js/Admin/order/orderlistdata.json';    // 임시 데이터
    // const url = 'http://localhost:5001/api/v1/orders/1/20';

    try {
        const res = await fetch(url);
        const data = await res.json();

        const {orders} = data;
        orders.forEach(order => {
            const { createdAt, address, orderItems, totalPrice, payMethod, status, _id: id } = order;
            const { addressee } = address;
            const date = formatDate(createdAt);

            setOrderList(date, id, addressee, orderItems, totalPrice, payMethod, status);
            totalEl.innerText = `[총 ${orders.length}개]`;
        });

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-alert
        alert('주문 조회 중 오류 발생 : ', err);
    }
}

insertOrderList();
checkAll.addEventListener('click', selectAllCheckboxes);