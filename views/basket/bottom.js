import { baskets } from './index.js';

const basket = [
  {
    name: '상품명1',
    price: 20000,
    count: 2,
    deliveryPrice: 0,
    totalCount: 40000,
    option: [
      {
        color: 'red',
        size: 'S',
      },
    ],
  },
];

localStorage.setItem('basket', JSON.stringify(basket));

export const drawTotalPrice = () => {
  const totalWrapperElement = document.querySelector('.total-wrapper');
  let totalPrice = 0;
  baskets.forEach((product) => {
    totalPrice += product.price * product.count;
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
