// import { eventListener } from "./display.js";
import { drawBasket, baskets } from './index.js';
import { products } from './products.js';

// 장바구니 상품 추가 함수에 click이벤트를 달아주는 함수
// const addBasketButton = document.querySelector('#addProduct');
// addBasketButton.addEventListener('click', () => {
//   addBasket('상품명2', 1, {
//     color: 'red',
//     size: 'S',
//   });
// });

// 로컬 스토리지에 있는 basket 장바구니를 리턴 해주는 함수
export const getBasket = () => {
  const localStorageBasket = localStorage.getItem('basket');
  const parseBasket = JSON.parse(localStorageBasket);

  isEmptyBasket(parseBasket);

  return parseBasket;
};

// 장바구니에 선택 한 상품을 추가 하는 함수
export const addBasket = (name, quantity, option) => {
  const selectedProduct = products.find((product) => product.name === name);

  const parseProduct = {
    ...selectedProduct,
    quantity,
    option,
    checked: false,
  };

  baskets.push(parseProduct);
  const basket = getBasket();
  basket.push(parseProduct);

  localStorage.setItem('basket', JSON.stringify(basket));

  drawBasket();
  // eventListener();
};

// 만약 장바구니가 비어있으면 장바구니가 비어있는 화면을, 아니라면 채워져있는 화면을 보여준다.
export const isEmptyBasket = (parseBasket) => {
  const hasElement = document.querySelector('.has');
  const emptyElement = document.querySelector('.empty');

  if (parseBasket.length === 0) {
    hasElement.style.display = 'none';
    emptyElement.style.display = 'block';
  } else {
    hasElement.style.display = 'block';
    emptyElement.style.display = 'none';
  }
};

// 체크 한 함수 넣어주는 함수

// checkElements.forEach((checkedElement, index) => {
//   const baskets = getBasket();

//   checkedElement.addEventListener('click', clickCheck);

//   // const checekdBaskets = baskets.map((product) => {});
// });
