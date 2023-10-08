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
  const basketWrapperElement = document.querySelector(".basket-wrapper");

  const products = getBasket();

  const html = products.map((product) => {
    const deliveryPrice =
      product.deliveryPrice === 0 ? "무료" : product.deliveryPrice;
    let totalPrice = product.price * product.count;

    if (deliveryPrice !== "무료") {
      totalPrice = `${totalPrice + deliveryPrice  }원`;
    }

    return `<div class="row data">
      <!-- 첫번째 블록 -->
      <div class="subdiv">
        <div class="check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" name="select-all">
        </div>
        <div class="img"><img src="c094c965cc52b72a17a30e4ff99c4f89.jpg" width="100%" alt="상품 이미지"></div>
        <div class="pname">
          <span>${product.name}</span></br>
          <span>${product.option}</span></br>
          <button type="button" class="btn btn-light opt-btn" id="modal-open-button">옵션 변경</button>
        </div>
        <!-- 수량 -->
        <div class="num">
          <div class="updown">
            <input type="text" name="p_num1" id="p_num1" size="2" maxlength="1" class="p_num" value=${
              product.count
            }>
            <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
              <button type="button" class="btn btn-light" id="count-up"><i class="bi bi-chevron-up"></i></button>
              <button type="button" class="btn btn-light" id="count-down"><i class="bi bi-chevron-down"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 두번째 블록 -->
      <div class="subdiv">
        <div class="price">${product.price.toLocaleString("en")}원</div>
        <div class="delivery">${deliveryPrice.toLocaleString("en")}</div>
        <div class="sum">${totalPrice.toLocaleString("en")}원</div>
      </div>

      <!-- 세번째 블록 -->
      <div class="subdiv">
        <div class="basketcmd">
          <button type="button" class="btn btn-dark">주문하기</button>
          <button type="button" class="btn btn-light" id="one-delete">삭제</button>
        </div>
      </div>
      </div>`;
  });
  basketWrapperElement.innerHTML = html;
};
drawBasket();
