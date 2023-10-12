const shipptingListEl = document.getElementById('shipping-list');
const checkAll = document.getElementById('check-all');
const totalEl = document.getElementById('total');
const changeStatusBtn = document.getElementById('change-status');

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

async function changeOrderStatus(id) {
    const url = `/api/v1/orders/${id}/delete`;

    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                
            }),
        });
    } catch (err) {
        // eslint-disable-next-line no-alert
        alert(`주문번호 : ${id}의 주문을 취소할 수 없습니다.`);
    }

}

function changeOrder() {

}

function setOrderList(date, id, addressee, orderItems, totalPrice) {
    const element = `<tr id="order-${orderId}">
    <td><input class="form-check-input" type="checkbox" id="check-item"></td>
              <td id="pre-shipping-date">${date.replace(' ', '<br>')}</td>
              <td id="pre-shipping-id">${id}</td>
              <td id="pre-shipping-username">${addressee}</td>
              <td id="pre-shipping-product">${orderItems}</td>
              <td id="pre-shipping-vertify">${orderItems.length}</td>
              <td id="pre-shipping-price">${totalPrice}</td>
            </tr>`

    shipptingListEl.insertAdjacentHTML('beforeend', element);
    orderId += 1;
}

async function insertOrderList() {
    // const url = './orderlistdata.json';    // 임시 데이터
    const url = '/api/v1/orders/get/shipping';

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "배송준비중"
            })
        });
        // const res = await fetch(url);

        const data = await res.json();

        orderId = 0;
        const { orders } = data;
        orders.forEach(order => {
            const { createdAt, address, orderItems, totalPrice, _id: id } = order;
            const { addressee } = address;
            const date = formatDate(createdAt);

            setOrderList(date, id, addressee, orderItems, totalPrice);
        });

        totalEl.innerText = `[총 ${orders.length}개]`;

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-alert
        alert('주문 조회 중 오류 발생 : ', err);
    }
}

insertOrderList();
changeStatusBtn.addEventListener('click', changeOrder);
checkAll.addEventListener('click', selectAllCheckboxes);