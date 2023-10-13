import { getBasket, isEmptyBasket } from './addBasket.js';
import { drawTotalPrice } from './bottom.js';

export let baskets = getBasket();

///////////////////////////////////////////

// 전체 선택 체크박스로 삭제, 구매 구현

let allChecked = [];

const checkAll = document.querySelector('.select-all');

checkAll.addEventListener('click', function () {
  const isChecked = checkAll.checked;

  if (isChecked) {
    const checkboxes = document.querySelectorAll('.select-single');
    for (const checkbox of checkboxes) {
      checkbox.checked = true;
    }
  } else {
    const checkboxes = document.querySelectorAll('.select-single');
    for (const checkbox of checkboxes) {
      checkbox.checked = false;
    }
  }
});

const checkboxes = document.querySelectorAll('.select-single');
for (const checkbox of checkboxes) {
  checkbox.addEventListener('click', function () {
    const totalCnt = checkboxes.length;
    const checkedCnt = document.querySelectorAll('.select-single:checked').length;

    if (totalCnt === checkedCnt) {
      checkAll.checked = true;
    } else {
      checkAll.checked = false;
    }
  });
}

// 전체 선택 체크박스를 클릭할 때의 이벤트 핸들러
checkAll.addEventListener('click', function () {
  const isChecked = checkAll.checked;
  const checkboxes = document.querySelectorAll('.select-single');

  for (const checkbox of checkboxes) {
    checkbox.checked = isChecked;
    const productName = checkbox.dataset.productName;

    // isChecked가 true이면 상품을 allChecked 배열에 추가, false이면 삭제
    if (isChecked && !allChecked.includes(productName)) {
      allChecked.push(productName);
    } else if (!isChecked) {
      allChecked = allChecked.filter((name) => name !== productName);
    }
  }
});

// 선택 상품 삭제 버튼 클릭 이벤트 핸들러
document.getElementById('select-delete').addEventListener('click', () => {
  const basket = getBasket();

  // allChecked 배열에 있는 상품을 장바구니에서 제거
  allChecked.forEach((name) => {
    const withoutSelectedProduct = basket.filter((product) => product.name !== name);
    baskets = withoutSelectedProduct;
    localStorage.setItem('basket', JSON.stringify(withoutSelectedProduct));
  });

  // 선택 상품 삭제 후 allChecked 배열 비우기
  allChecked = [];

  // 장바구니 다시 그리기
  drawBasket();
});

////////////////////////////////////////////////////////////////////

///////////// 주문 파트///////////////////

// 선택한 상품을 저장하는 배열
let orderChecked = [];

const checkboxClick = (event) => {
  const basketId = event.target.dataset.basketId;

  if (orderChecked.includes(basketId)) {
    orderChecked = orderChecked.filter((checkedId) => checkedId !== basketId);
  } else {
    orderChecked.push(basketId);
  }
};

// 선택 상품 주문 //

// 장바구니에 선택 주문한 상품을 삭제하고 주문 하는 함수
const orderSelectedBasket = () => {
  let withoutSelectedProduct;
  orderChecked.forEach((checkedId) => {
    const result = baskets.filter((basketItem) => basketItem.basketId !== Number(checkedId));
    withoutSelectedProduct = result;
  });
  localStorage.setItem('basket', JSON.stringify(withoutSelectedProduct));

  // orderChecked 배열을 sessionStorage에 추가합니다.

  const sessionBasket = [];

  orderChecked.forEach((checkedId) => {
    baskets.forEach((basketItem) => {
      if (basketItem.basketId === Number(checkedId)) {
        sessionBasket.push(basketItem);
      }
    });
  });

  sessionStorage.setItem('order', JSON.stringify(sessionBasket));

  // 장바구니를 다시 그리기
  drawBasket();
};

// // 주문 버튼 클릭 이벤트 핸들러 등록
document.getElementById('select-order').addEventListener('click', orderSelectedBasket);

////////////////////////

// 전체 상품 구매 //

const allOrder = () => {
  const basket = getBasket(); // 장바구니 정보를 가져옵니다.

  // 전체 상품을 sessionStorage에 추가합니다.
  sessionStorage.setItem('order', JSON.stringify(basket));

  // localStorage에서 전체 장바구니를 삭제합니다.
  localStorage.setItem('basket', '[]');
  baskets = [];

  // 장바구니를 다시 그리기
  drawBasket();
};

document.getElementById('all-order').addEventListener('click', allOrder);

// 개별 주문 //

const orderProduct = (event, count) => {
  const basket = getBasket();
  const basketId = event.target.dataset.basketId;

  const updatedBasket = basket.filter((product) => Number(product.basketId) !== Number(basketId));
  const updateSesstion = basket.filter((product) => Number(product.basketId) === Number(basketId));

  // localStorage에서 해당 상품을 가져오고 sessionStorage에 추가합니다.

  baskets = updatedBasket;

  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  // sessionStorage에 새로운 주문 목록을 저장합니다.
  sessionStorage.setItem(
    'order',
    JSON.stringify([
      {
        ...updateSesstion[0],
        quantity: count,
      },
    ]),
  );

  // 장바구니를 다시 그립니다
  drawBasket();
};

//////////////////////////////////////////////////////////////////

////////////삭제 파트/////////////

// 장바구니에 선택 한 상품을 삭제 하는 함수
const removeSelectedBasket = () => {
  const basket = getBasket();

  orderChecked.forEach((name) => {
    const withoutSelectedProduct = basket.filter((product) => product.name !== name);
    baskets = withoutSelectedProduct;
    // 업데이트된 장바구니를 localStorage에 저장
    localStorage.setItem('basket', JSON.stringify(withoutSelectedProduct));
  });

  // 장바구니를 다시 그리기
  drawBasket();
};

// 삭제 버튼 클릭 이벤트 핸들러 등록
const selectClearCartBtn = document.getElementById('select-delete');
selectClearCartBtn.addEventListener('click', removeSelectedBasket);

/////////////////////

// 전체 삭제

const clearCart = document.getElementById('clear-cart');

const clearBasket = () => {
  localStorage.setItem('basket', '[]');
  baskets = [];
  drawBasket();
};

clearCart.addEventListener('click', clearBasket);

/////////////////////

// 개별 삭제 //

const deleteProduct = (event) => {
  const basket = getBasket();
  const basketId = event.target.dataset.basketId;

  const updatedBasket = basket.filter((product) => product.basketId !== Number(basketId));

  baskets = updatedBasket;
  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  drawBasket();
};

///////////////////////////////////////////////////
///////////상품 부가 기능////////////////

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

  baskets[index].quantity = currentValue;

  drawBasket();
};

//////////////////////////////////////////////////

export const drawBasket = () => {
  const basketWrapperElement = document.querySelector('.basket-wrapper');

  const basketCountElement = document.querySelector('.basket-count');

  basketCountElement.innerText = `상품(${baskets.length})`;
  isEmptyBasket(baskets);
  drawTotalPrice();
  const html = baskets.map((product) => {
    let totalPrice = Number(product.price) * Number(product.quantity);
    const color = product.option?.color ? `COLOR : ${product.option.color} ` : '';
    const size = product.option?.size ? `SIZE : ${product.option.size} ` : '';

    return `<div class="row data" id="row-data">
      <!-- 첫번째 블록 -->
      <div class="subdiv">
      <div class="check">
      <input class="form-check-input checked-select select-single" type="checkbox" id="flexCheckDefault" data-basket-id="${
        product.basketId
      }">
        </div>
        <div class="img" id="mainImg"><img src="${product.mainImage}" width="100%" alt="상품 이미지"></div>
        <div class="pname">
          <span>${product.name}</span></br>
          <span>[ ${color} ${color ? '/' : ''} ${size}]</span></br>
        </div>
        <!-- 수량 -->
        <div class="num">
          <div class="updown">
            <input type="text" name="p_num1" id="p_num1" size="2" maxlength="1" class="p_num" value=${product.quantity}>
            <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
              <button type="button" class="btn btn-light" id="count-up"><i class="bi bi-chevron-up"></i></button>
              <button type="button" class="btn btn-light" id="count-down"><i class="bi bi-chevron-down"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 두번째 블록 -->
      <div class="subdiv">
        <div class="price" id="product-price">${Number(product.price).toLocaleString('en')}원</div>
        <div class="delivery" id="delivery=price">무료</div>
        <div class="sum" id="total-price">${totalPrice.toLocaleString('en')}원</div>
        
      </div>

      <!-- 세번째 블록 -->
      <div class="subdiv">
        <div class="basketcmd">
          <a href="/views/payment/payment.html" class="btn btn-dark one-order" data-basket-id="${
            product.basketId
          }">주문하기</a>
          <button type="button" class="btn btn-light one-delete" data-basket-id="${product.basketId}">삭제</button>
        </div>
      </div>
      </div>`;
  });
  basketWrapperElement.innerHTML = html;

  const checkboxes = basketWrapperElement.querySelectorAll('.form-check-input');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', checkboxClick);
  });

  const deletes = basketWrapperElement.querySelectorAll('.one-delete');
  deletes.forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteProduct);
  });

  const orders = basketWrapperElement.querySelectorAll('.one-order');
  orders.forEach((orderButton, index) => {
    orderButton.addEventListener('click', (event) => orderProduct(event, inputElements[index].value));
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
};

drawBasket();
