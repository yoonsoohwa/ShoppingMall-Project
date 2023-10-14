const deliveredListEl = document.getElementById('delivered-list');
const totalEl = document.getElementById('total');

// 날짜 시간 설정
function formatDate(createdAt) {
    const orderDate = createdAt.split('.')[0];
    const date = orderDate.split('T')[0];
    const time = orderDate.split('T')[1];

    return `${date} ${time}`;
}

// 배송현황별 주문 목록 생성
function setOrderList(orderTime, deliveredTime, id, addressee, orderItems, totalPrice) {
    let totalQuantity = 0 ;
    const productList = orderItems.map(({ option, quantity, item }) => {
        const productName = `${item.name} [${option.color} / ${option.size}]`;
        totalQuantity += quantity;
        return [productName, quantity];
    });
    const itemText = productList.length <= 1 ? `${productList[0][0]}` : `${productList[0][0]} 외 ${productList.length - 1}개`;


    const element = `<tr>
                <td id="delivered-order-time">${orderTime}</td>
                <td id="delivered-delivered-time">${deliveredTime}</td>
                <td id="delivered-id">${id}</td>
                <td id="delivered-username">${addressee}</td>
                <td id="delivered-product">${itemText}</td>
                <td id="delivered-vertify">${totalQuantity}</td>
                <td id="delivered-price">${totalPrice.toLocaleString()}</td>
              </tr>`

    deliveredListEl.insertAdjacentHTML('beforeend', element);
}

// 배송완료된 주문 요청
async function insertOrderList() {
    // const url = './orderlistdata.json';    // 임시 데이터
    const url = '/api/v1/orders/shipping/1/20';

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "배송완료"
            })
        });
        // const res = await fetch(url);
        const data = await res.json();

        const { orders } = data;
        orders.forEach(order => {
            const { createdAt, updatedAt, address, orderItems, totalPrice, _id: id } = order;
            const { addressee } = address;
            const orderTime = formatDate(createdAt);
            const deliveredTime = formatDate(updatedAt);

            setOrderList(orderTime, deliveredTime, id, addressee, orderItems, totalPrice);
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