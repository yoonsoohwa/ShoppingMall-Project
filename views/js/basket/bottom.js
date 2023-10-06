import { getBasket } from "./addBasket.js";

const basket = [
  {
    name: "상품명1",
    price: 20000,
    count: 2,
    deliveryPrice: 0,
    totalCount: 40000,
    option: [
      {
        color: "red",
        size: "S",
      },
    ],
  },
];

localStorage.setItem("basket", JSON.stringify(basket));

export const drawBasket = () => {
  const totalWrapperElement = document.querySelector(".total-wrapper");

  const products = getBasket();

  const html = products.map((product) => {
    const deliveryPrice =
      product.deliveryPrice === 0 ? "무료" : product.deliveryPrice;
    let totalPrice = product.price * product.count;

    if (deliveryPrice !== "무료") {
      totalPrice = totalPrice + deliveryPrice + "원";
    }

    return `
    <div class="total-row">
      <div class="goods-price col-3" id="total-goods-price">${product.price.toLocaleString(
        "en"
      )}원</div>
      <div class="plus col-1">+</div>
      <div class="delivery-price col-2" id="total-delivery-price">${deliveryPrice.toLocaleString(
        "en"
      )}</div>
      <div class="equal col-1">=</div>
      <div class="total-price col-3" id="total-add-price">${totalPrice.toLocaleString(
        "en"
      )}원</div>
    </div>
    `;
  });
  totalWrapperElement.innerHTML = html;
};
drawBasket();
