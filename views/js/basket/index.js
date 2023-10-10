import { getBasket, isEmptyBasket } from './addBasket.js';
import { drawTotalPrice } from './bottom.js';

const basket = [
  {
    name: '상품명1',
    price: 20000,
    count: 2,
    deliveryPrice: 0,
    checked: false,
    option: [
      {
        color: 'red',
        size: 'S',
      },
    ],
  },
];

localStorage.setItem('basket', JSON.stringify(basket));

export let baskets = getBasket();

///////////////////////

// 선택 상품 주문 //

// 선택한 상품을 저장하는 배열
let orderChecked = [];

const CheckboxClick = (event) => {
  const productName = event.target.dataset.productName;

  if (!orderChecked.includes(productName)) {
    orderChecked.push(productName);
  } else {
    orderChecked = orderChecked.filter((name) => name !== productName);
  }
};

// 장바구니에 선택 한 상품을 삭제 하는 함수
const orderSelectedBasket = () => {
  checked.forEach((name) => {
    // 업데이트된 장바구니를 sesstionStorage에 저장
    sessionStorage.setItem('order', JSON.stringify(basket));
  });

  // 장바구니를 다시 그리기
  drawBasket();
};

// 주문 버튼 클릭 이벤트 핸들러 등록
document.getElementById('select-order').addEventListener('click', orderSelectedBasket);

////////////////////////

// 전체 삭제

const clearCart = document.getElementById('clear-cart');

const clearBasket = () => {
  localStorage.setItem('basket', '[]');
  baskets = [];
  drawBasket();
};

clearCart.addEventListener('click', clearBasket);

////////////////////////

// 전체 상품 구매 //

const allOrder = () => {
  sessionStorage.setItem('order', JSON.stringify(basket));
  drawBasket();
};

document.getElementById('all-order').addEventListener('click', allOrder);

/////////////////

// 선택 상품 삭제 //

// 선택한 상품을 저장하는 배열
let checked = [];

const handleCheckboxClick = (event) => {
  const productName = event.target.dataset.productName;

  if (!checked.includes(productName)) {
    checked.push(productName);
  } else {
    checked = checked.filter((name) => name !== productName);
  }
};

// 장바구니에 선택 한 상품을 삭제 하는 함수
const removeSelectedBasket = () => {
  const basket = getBasket();

  checked.forEach((name) => {
    const withoutSelectedProduct = basket.filter((product) => product.name !== name);
    baskets = withoutSelectedProduct;
    // 업데이트된 장바구니를 localStorage에 저장
    localStorage.setItem('basket', JSON.stringify(withoutSelectedProduct));
  });

  // 장바구니를 다시 그리기
  drawBasket();

  // // 선택한 상품을 삭제한 후, 선택 배열을 초기화
  // checked.length = 0;
};

// 삭제 버튼 클릭 이벤트 핸들러 등록
const selectClearCartBtn = document.getElementById('select-delete');
selectClearCartBtn.addEventListener('click', removeSelectedBasket);

// 개별 삭제 //

const deleteProduct = (event) => {
  const basket = getBasket();
  const productName = event.target.dataset.productName;
  const updatedBasket = basket.filter((product) => product.name !== productName);

  baskets = updatedBasket;
  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  drawBasket();
};

// 수량 늘리고 줄이는 코드

const upDown = (type, inputElement, index) => {
  let currentValue = parseInt(inputElement[index].value);

  if (type === 'UP') {
    currentValue++;
  }
  if (currentValue === 1) return;
  if (type === 'DOWN') {
    currentValue--;
  }
  inputElement.value = currentValue;

  baskets.map((product, productIndex) => {
    if (index === productIndex) product.count = currentValue;
  });

  drawBasket();
};

//////////////

const basketCountElement = document.querySelector('.basket-count');

export const drawBasket = () => {
  const basketWrapperElement = document.querySelector('.basket-wrapper');

  basketCountElement.innerText = `상품(${baskets.length})`;
  isEmptyBasket(baskets);
  drawTotalPrice();
  const html = baskets.map((product) => {
    const deliveryPrice = product.deliveryPrice === 0 ? '무료' : product.deliveryPrice;
    let totalPrice = product.price * product.count;

    if (deliveryPrice !== '무료') {
      totalPrice = `${totalPrice + deliveryPrice}원`;
    }
    return `<div class="row data" id="row-data">
      <!-- 첫번째 블록 -->
      <div class="subdiv">
      <div class="check">
      <input class="form-check-input checked-select" type="checkbox" id="flexCheckDefault" name="select-all" data-product-name="${
        product.name
      }">
        </div>
        <div class="img"><img src="#" width="100%" alt="상품 이미지"></div>
        <div class="pname">
          <span>${product.name}</span></br>
          <span>[color: ${product.option[0].color}/size: ${product.option[0].size}]</span></br>
          <button type="button" class="btn btn-light opt-btn" id="modal-open-button">옵션 변경</button>
        </div>
        <!-- 수량 -->
        <div class="num">
          <div class="updown">
            <input type="text" name="p_num1" id="p_num1" size="2" maxlength="1" class="p_num" value=${product.count}>
            <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
              <button type="button" class="btn btn-light" id="count-up"><i class="bi bi-chevron-up"></i></button>
              <button type="button" class="btn btn-light" id="count-down"><i class="bi bi-chevron-down"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 두번째 블록 -->
      <div class="subdiv">
        <div class="price">${product.price.toLocaleString('en')}원</div>
        <div class="delivery">${deliveryPrice.toLocaleString('en')}</div>
        <div class="sum">${totalPrice.toLocaleString('en')}원</div>
        
      </div>

      <!-- 세번째 블록 -->
      <div class="subdiv">
        <div class="basketcmd">
          <button type="button" class="btn btn-dark">주문하기</button>
          <button type="button" class="btn btn-light one-delete" data-product-name="${product.name}">삭제</button>
        </div>
      </div>
      </div>`;
  });
  basketWrapperElement.innerHTML = html;

  const checkboxes = basketWrapperElement.querySelectorAll('.form-check-input');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', handleCheckboxClick);
    checkbox.addEventListener('click', CheckboxClick);
  });

  const deletes = basketWrapperElement.querySelectorAll('.one-delete');
  deletes.forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteProduct);
  });

  const inputElements = document.querySelectorAll('#p_num1');

  const countUp = basketWrapperElement.querySelectorAll('#count-up');

  countUp.forEach((countUpButton, index) => {
    countUpButton.addEventListener('click', () => upDown('UP', inputElements, index));
  });

  const countDown = basketWrapperElement.querySelectorAll('#count-down');
  countDown.forEach((countDownButton, index) => {
    countDownButton.addEventListener('click', () => upDown('DOWN', inputElements, index));
  });

  // 모달
  const modalOpenButtons = document.querySelectorAll('#modal-open-button');
  const modalCloseButtons = document.querySelectorAll('#modal-close-button');

  const modal = document.querySelector('#modal-container');

  modalOpenButtons.forEach((modalOpen) => {
    modalOpen.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  });

  modalCloseButtons.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
};

drawBasket();
