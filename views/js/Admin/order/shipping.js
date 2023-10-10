const shipptingListEl = document.getElementById('shipping-list');

function formatDate(createdAt) {
    const orderDate = createdAt.split('.')[0];
    const date = orderDate.split('T')[0];
    const time = orderDate.split('T')[1];

    return `${date} ${time}`;
}

function setOrderList(date, id, addressee, orderItems, totalPrice, payMethod) {
    const element = `<tr>
    <td><input class="form-check-input" type="checkbox" id="check-item"></td>
              <td id="shipping-date">${date.replace(' ', '<br>')}</td>
              <td id="shipping-id">${id}</td>
              <td id="shipping-username">${addressee}</td>
              <td id="shipping-product">${orderItems}</td>
              <td id="shipping-vertify">5</td>
              <td id="shipping-price">${totalPrice}</td>
              <td id="shipping-payment-type">${payMethod}</td>
            </tr>`

    shipptingListEl.insertAdjacentHTML('beforeend', element);
}

async function insertOrderList() {
    const url = '../../../js/Admin/order/orderlistdata.json';    // 임시 데이터
    // const url = '';

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "배송 준비 중"
            })
        });
        const data = await res.json();

        const { orders } = data;
        orders.forEach(order => {
            const { createdAt, address, orderItems, totalPrice, payMethod, _id: id } = order;
            const { addressee } = address;
            const date = formatDate(createdAt);

            setOrderList(date, id, addressee, orderItems, totalPrice, payMethod);
        });

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // eslint-disable-next-line no-alert
        alert('주문 조회 중 오류 발생 : ', err);
    }
}

insertOrderList();