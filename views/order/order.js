/* db에서 전체 목록 불러오기(get) */
async function orderProductData() {
  try {
    const res = await fetch(``);
    const data = await res.json();

    data.forEach((product) => {
      const orderDate = document.querySelector('#order-date');
      const orderId = document.querySelector('#order-id');
      const orderImg = document.querySelector('#order-img');
      const orderPname = document.querySelector('#order-pname');
      const orderQuantity = document.querySelector('#order-num');
      const orderPrice = document.querySelector('#order-price');
      const orderStatus = document.querySelector('#order-status');

      orderDate.insertAdjacentHTML();
      orderId.insertAdjacentHTML(product.order._id);
      orderImg.insertAdjacentHTML();
      orderPname.insertAdjacentHTML();
      orderQuantity.insertAdjacentHTML(product.order.orderItems.quantity);
      orderPrice.insertAdjacentHTML(product.order.totalPrice);
      orderStatus.insertAdjacentHTML(product.order.status);
    });
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
}
orderProductData();
