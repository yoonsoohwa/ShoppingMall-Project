import { getBasket, isEmptyBasket } from './addBasket.js';
import { drawTotalPrice } from './bottom.js';
import { products } from './products.js';

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

// 선택 상품 주문 //

// 선택한 상품을 저장하는 배열
const orderChecked = [];

const checkboxClick = (event) => {
  const productName = event.target.dataset.productName;

  if (!orderChecked.includes(productName)) {
    orderChecked.push(productName);
  } else {
    orderChecked = orderChecked.filter((name) => name !== productName);
  }
};

// 장바구니에 선택 주문한 상품을 삭제하고 주문 하는 함수
const orderSelectedBasket = () => {
  const basket = getBasket();

  orderChecked.forEach((name) => {
    const withoutSelectedProduct = basket.filter((product) => product.name !== name);
    baskets = withoutSelectedProduct;

    localStorage.setItem('basket', JSON.stringify(withoutSelectedProduct));
  });

  // orderChecked 배열을 sessionStorage에 추가합니다.
  const sessionBasket = JSON.parse(sessionStorage.getItem('basket')) || [];
  orderChecked.forEach((name) => {
    sessionBasket.push(name);
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

const orderProduct = (event) => {
  const basket = getBasket();
  const productName = event.target.dataset.productName;
  const updatedBasket = basket.filter((product) => product.name !== productName);
  const updateSesstion = basket.filter((product) => product.name === productName);

  // localStorage에서 해당 상품을 가져오고 sessionStorage에 추가합니다.
  baskets = updatedBasket;
  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  // sessionStorage에 새로운 주문 목록을 저장합니다.
  sessionStorage.setItem('order', JSON.stringify(updateSesstion));

  // 장바구니를 다시 그립니다
  drawBasket();
};

//////////////////////////////////////////////////////////////////

////////////삭제 파트/////////////

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
  localStorage.removeItem('basket');
  drawBasket();
};

clearCart.addEventListener('click', clearBasket);

/////////////////////

// 개별 삭제 //

const deleteProduct = (event) => {
  const basket = getBasket();
  const productName = event.target.dataset.productName;
  const updatedBasket = basket.filter((product) => product.name !== productName);

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

  baskets.map((product, productIndex) => {
    if (index === productIndex) product.quantity = currentValue;
  });

  drawBasket();
};

//////////////////////////////////////////////////
/////모달//////

// 모달창 옵션
let selectedProduct = {};

const handleClickModal = (event) => {
  const productName = event.target.dataset.productName;
  selectedProduct = products.find((product) => product.name === productName);

  // 프로덕트 이름 변경
  const modalElement = document.querySelector('.goods-name');
  modalElement.innerHTML = productName;

  // 셀렉트 박스 옵션 추가
  const colorSelectBoxElement = document.querySelector('#color-select');
  const sizeSelectBoxElement = document.querySelector('#size-select');

  while (colorSelectBoxElement.firstChild) {
    colorSelectBoxElement.removeChild(colorSelectBoxElement.firstChild);
  }

  while (sizeSelectBoxElement.firstChild) {
    sizeSelectBoxElement.removeChild(sizeSelectBoxElement.firstChild);
  }

  // 색상 옵션과 사이즈 옵션이 정의되어 있는지 확인 후 추가
  if (selectedProduct && selectedProduct.option && selectedProduct.option.color) {
    const initialOption = document.createElement('option');
    initialOption.setAttribute('value', '');
    initialOption.setAttribute('disabled', true);
    initialOption.setAttribute('selected', true);
    initialOption.text = '-[필수] 옵션을 선택해주세요-';
    colorSelectBoxElement.add(initialOption);

    selectedProduct.option.color.forEach((_option) => {
      const option = document.createElement('option');
      option.text = _option;
      option.value = _option;
      colorSelectBoxElement.add(option);
    });
  }

  if (selectedProduct && selectedProduct.option && selectedProduct.option.size) {
    const _initialOption = document.createElement('option');
    _initialOption.setAttribute('value', '');
    _initialOption.setAttribute('disabled', true);
    _initialOption.setAttribute('selected', true);
    _initialOption.text = '-[필수] 옵션을 선택해주세요-';
    sizeSelectBoxElement.add(_initialOption);

    selectedProduct.option.size.forEach((_option) => {
      const option = document.createElement('option');
      option.text = _option;
      option.value = _option;
      sizeSelectBoxElement.add(option);
    });
  }

  // 모달 열기
  const modalContainer = document.getElementById('modal-container');
  modalContainer.classList.remove('hidden');
};

///
const modal = document.querySelector('#modal-container');
document.getElementById('modal-change-button').addEventListener('click', () => {
  const colorSelectBoxElement = document.querySelector('#color-select');
  const sizeSelectBoxElement = document.querySelector('#size-select');

  const selectedColor = colorSelectBoxElement.value;
  const selectedSize = sizeSelectBoxElement.value;

  // 'selectedProduct'가 정의되어 있고 'option' 속성이 존재하는지 확인
  if (selectedProduct && selectedProduct.option) {
    // 선택한 제품의 이름
    const productName = selectedProduct.name;

    // 새로운 장바구니 배열 생성
    const updatedBasket = baskets.map((product) => {
      if (product.name === productName) {
        return {
          ...product,
          option: {
            color: selectedColor,
            size: selectedSize,
          },
        };
      }
      return product;
    });

    // baskets를 업데이트하고 로컬 스토리지에도 저장
    baskets = updatedBasket;
    localStorage.setItem('basket', JSON.stringify(updatedBasket));

    // 모달 닫기
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');

    // 장바구니 다시 그리기
    drawBasket();
  } else {
    // 'selectedProduct'가 없거나 'option' 속성이 없는 경우 에러 메시지 표시
    console.error('상품 정보 또는 옵션 정보를 찾을 수 없습니다.');
  }
});

///////

/////////////

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
      <input class="form-check-input checked-select select-single" type="checkbox" id="flexCheckDefault" data-product-name="${
        product.name
      }">
        </div>
        <div class="img" id="mainImg"><img src="${product.mainImage}" width="100%" alt="상품 이미지"></div>
        <div class="pname">
          <span>${product.name}</span></br>
          <span>[ ${color} ${color ? '/' : ''} ${size}]</span></br>
          <button type="button" class="btn btn-light opt-btn" id="modal-open-button" data-product-name="${
            product.name
          }">옵션 변경</button>
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
          <a href="/views/payment/payment.html" class="btn btn-dark one-order" data-product-name="${
            product.name
          }">주문하기</a>
          <button type="button" class="btn btn-light one-delete" data-product-name="${product.name}">삭제</button>
        </div>
      </div>
      </div>`;
  });
  basketWrapperElement.innerHTML = html;

  const checkboxes = basketWrapperElement.querySelectorAll('.form-check-input');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', handleCheckboxClick);
    checkbox.addEventListener('click', checkboxClick);
  });

  const deletes = basketWrapperElement.querySelectorAll('.one-delete');
  deletes.forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteProduct);
  });

  const orders = basketWrapperElement.querySelectorAll('.one-order');
  orders.forEach((orderButton) => {
    orderButton.addEventListener('click', orderProduct);
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
  const modalOpenButtons = basketWrapperElement.querySelectorAll('#modal-open-button');

  const modalCloseButtons = basketWrapperElement.querySelectorAll('#modal-close-button');

  modalOpenButtons.forEach((modalOpen) => {
    modalOpen.addEventListener('click', (e) => {
      handleClickModal(e);
      modal.classList.remove('hidden');
    });
  });

  modalCloseButtons.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });

  ////옵션 추가
  document.addEventListener('DOMContentLoaded', function () {
    // 모달 열기 버튼 클릭 이벤트 핸들러
    document.getElementById('modal-open-button').addEventListener('click', function () {
      // 모달 열 때 선택된 상품 정보를 가져와서 모달 내용 업데이트
      const selectedProductName = this.getAttribute('data-product-name');
      const selectedProduct = products.find((product) => product.name === selectedProductName);

      // 모달 내용 업데이트
      const modalProductName = document.querySelector('.goods-name');
      modalProductName.innerText = selectedProductName;

      const colorSelect = document.querySelector('#color-select');
      const sizeSelect = document.querySelector('#size-select');

      // 옵션 선택 상자 초기화
      colorSelect.innerHTML = '<option value="" disabled selected>-[필수] 옵션을 선택해주세요-</option>';
      sizeSelect.innerHTML = '<option value="" disabled selected>-[필수] 옵션을 선택해주세요-</option>';

      // 옵션 정보가 있으면 각 옵션을 옵션 선택 상자에 추가
      if (selectedProduct.option && selectedProduct.option.color) {
        selectedProduct.option.color.forEach((color) => {
          const option = document.createElement('option');
          option.value = color;
          option.innerText = color;
          colorSelect.appendChild(option);
        });
      }

      if (selectedProduct.option && selectedProduct.option.size) {
        selectedProduct.option.size.forEach((size) => {
          const option = document.createElement('option');
          option.value = size;
          option.innerText = size;
          sizeSelect.appendChild(option);
        });
      }

      // 모달 열기
      const modalContainer = document.getElementById('modal-container');
      modalContainer.classList.remove('hidden');
    });

    // 모달 닫기 버튼 클릭 이벤트 핸들러
    document.getElementById('modal-close-button').addEventListener('click', function () {
      // 모달 초기화
      const modalContainer = document.getElementById('modal-container');
      modalContainer.classList.add('hidden');
    });

    // 모달에서 '옵션 추가' 버튼 클릭 이벤트 핸들러
    document.getElementById('modal-add-button').addEventListener('click', function () {
      const selectedProductName = document.querySelector('.goods-name').innerText;
      const selectedColor = document.getElementById('color-select').value;
      const selectedSize = document.getElementById('size-select').value;

      // 선택한 옵션으로 새 상품 생성
      const newProduct = {
        ...selectedProduct,
        name: selectedProductName,
        option: {
          color: selectedColor,
          size: selectedSize,
        },
        // 다른 상품 정보 추가
      };

      // 장바구니에 새 상품 추가
      baskets.push(newProduct);
      localStorage.setItem('basket', JSON.stringify(baskets));

      // 모달 닫기
      const modalContainer = document.getElementById('modal-container');
      modalContainer.classList.add('hidden');

      // 장바구니 다시 그리기
      drawBasket();
    });
  });
};

drawBasket();
