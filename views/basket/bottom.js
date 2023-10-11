import { baskets } from './index.js';

export const drawTotalPrice = () => {
  const totalWrapperElement = document.querySelector('.total-wrapper');
  let totalPrice = 0;
  baskets.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });

  const html = `
    <div class="total-row">
      <div class="goods-price col-3" id="total-goods-price">${totalPrice.toLocaleString('en')}원</div>
      <div class="plus col-1">+</div>
      <div class="delivery-price col-2" id="total-delivery-price">무료</div>
      <div class="equal col-1">=</div>
      <div class="total-price col-3" id="total-add-price">${totalPrice.toLocaleString('en')}원</div>
    </div>
    `;
  totalWrapperElement.innerHTML = html;
};
// drawBasket();
