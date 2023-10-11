const productImageEl = document.getElementById('product-image');
const colorSelectorEl = document.getElementById('color-selector');
const sizeSelectorEl = document.getElementById('size-selector');
const colorOptionEl = document.getElementById('color-option');
const sizeOptionEl = document.getElementById('size-option');
const selectedListEl = document.getElementById('selected-list');
const optionSelectionEl = document.getElementById('option-selections');
const productNameEl = document.getElementById('product-name');
const productPriceEl = document.getElementById('product-price');
const productDescriptionEl = document.getElementById('product-description');
const buyNowBtn = document.getElementById('buy-now-button');
const addToCartBtn = document.getElementById('add-to-cart-button');
const totalEl = document.querySelector('#total-details > span');

let optionNum = 0;
let productPrice;
let mainImage;
let productName;

// 총 가격 및 수량 설정
function setTotal() {
  const quantityList = [...document.querySelectorAll('.quantity')];

  const [totalPrice, totalQuantity] = quantityList.reduce(
    ([accPrice, accQuantity], quantityEl) => {
      const quantity = Number(quantityEl.innerText);
      return [accPrice + productPrice * quantity, accQuantity + quantity];
    },
    [0, 0],
  );

  totalEl.innerHTML = `<span> <strong class="total-price">${totalPrice.toLocaleString()}원</strong>(${totalQuantity}개) </span>`;
}

// 수량 증가 및 감소하는 함수
function upDownQuantity(e, type, quantityEl, priceEl) {
  if (e) {
    e.preventDefault();
  }
  // console.log(option.textContent);

  const quantityElement = quantityEl;
  const priceElement = priceEl;
  let quantity = Number(quantityEl.innerText);

  if (type === 'UP') {
    quantity += 1;
  }

  if (type === 'DOWN') {
    if (quantity <= 1) {
      return;
    }
    quantity -= 1;
  }

  quantityElement.innerText = quantity;
  priceElement.textContent = `${Number(productPrice * quantity).toLocaleString()}원`;
  setTotal();
}

// 선택한 옵션의 삭제 버튼을 클릭했을 때 발생하는 함수
function deleteSelectedOption(e) {
  e.preventDefault();
  const greatGrandParent = e.currentTarget.parentNode.parentNode.parentNode;
  greatGrandParent.remove();
  setTotal();
}

// 선택한 옵션의 정보를 생성하여 화면에 보여줌
function addSelectedOption() {
  optionNum += 1;
  const element = `<tr>
    <td id="product-${optionNum}"class="product">
        <p>${productNameEl.innerText}</p>
    </td>
    <td class="text-center">
        <a href="#" id="decrease-quantity-${optionNum}"><i class="bi bi-dash-square"></i></a>
        <span id="quantity-${optionNum}" class="quantity">1</span>
        <a href="#" id="increase-quantity-${optionNum}"><i class="bi bi-plus-square"></i></a>
    </td>
    <td id="price-${optionNum}" class="text-end">${productPrice.toLocaleString()}원
    </td>
    <td class="text-end">
        <a href="#"
          ><i id="product-delete-${optionNum}" class="bi bi-x-square-fill"></i></a>
    </td>
  </tr>`;

  selectedListEl.insertAdjacentHTML('beforeend', element);
  setTotal();

  const quantityEl = document.getElementById(`quantity-${optionNum}`);
  const priceEl = document.getElementById(`price-${optionNum}`);

  document
    .getElementById(`increase-quantity-${optionNum}`)
    .addEventListener('click', (e) => upDownQuantity(e, 'UP', quantityEl, priceEl));
  document
    .getElementById(`decrease-quantity-${optionNum}`)
    .addEventListener('click', (e) => upDownQuantity(e, 'DOWN', quantityEl, priceEl));
  document.getElementById(`product-delete-${optionNum}`).addEventListener('click', deleteSelectedOption);
}

// 옵션을 선택했을 때 실행
function selectOption(optionSelectionState) {
  const color = colorSelectorEl.options[colorSelectorEl.selectedIndex].value;
  const size = sizeSelectorEl.options[sizeSelectorEl.selectedIndex].value;

  const selectedOptions = document.querySelectorAll('td.product > span');
  let option = ' - One Color / One Size';

  if (optionSelectionState === 'both') {
    // 선택해야 하는 옵션이 color와 size인 경우
    if (size === 'none') {
      return;
    }
    option = ` - ${color} / ${size}`;
  } else if (optionSelectionState === 'colorOnly') {
    // 선택해야 하는 옵션이 color만 있는 경우
    if (color === 'none') {
      return;
    }
    option = ` - ${color}`;
  } else if (optionSelectionState === 'sizeOnly') {
    // 선택해야 하는 옵션이 size만 있는 경우
    if (size === 'none') {
      return;
    }
    option = ` - ${size}`;
  }

  // 선택한 옵션이 이미 리스트에 있는 경우
  for (let i = 0; i < selectedOptions.length; i += 1) {
    if (selectedOptions[i].textContent === option) {
      const id = selectedOptions[i].parentNode.getAttribute('id').replace('product-', '');
      const quantityEl = document.getElementById(`quantity-${id}`);
      const priceEl = document.getElementById(`price-${id}`);
      upDownQuantity(null, 'UP', quantityEl, priceEl);
      // eslint-disable-next-line no-alert
      alert('선택된 옵션의 수량이 증가되었습니다.');
      return;
    }
  }

  addSelectedOption();

  document.getElementById(`product-${optionNum}`).insertAdjacentHTML('beforeend', `<span>${option}</span>`);
}

// color와 size를 모두 선택해야 될 때 size를 먼저 선택한 경우
function isColorSelected() {
  const color = colorSelectorEl.options[colorSelectorEl.selectedIndex].value;
  const options = Array.from(document.querySelectorAll('#size-selector > option'));

  options.forEach((op, i) => {
    const option = op;
    if (i >= 2) {
      option.style.display = color === 'none' ? 'none' : 'block';
    }
  });
}

// 상품 이미지 설정
function setImage(image, detailImage) {
  mainImage = image;
  detailImage.unshift(image);

  detailImage.forEach((img) => {
    const imageEl = document.createElement('img');
    imageEl.setAttribute('src', img);
    productImageEl.appendChild(imageEl);
  });
}

// 상품 정보 설정
function setInfo(name, price, content) {
  productPrice = price;
  productName = name;
  productNameEl.innerText = productName;
  productPriceEl.innerText = `${productPrice.toLocaleString()}원`;
  productDescriptionEl.innerText = content;
}

// 옵션(color, size)을 선택했을 때 발생하는 이벤트 설정
function handleOptionSelectChange() {
  const colorOptionDisplay = getComputedStyle(colorOptionEl).display;
  const sizeOptionDisplay = getComputedStyle(sizeOptionEl).display;

  if (colorOptionDisplay !== 'none' && sizeOptionDisplay !== 'none') {
    sizeSelectorEl.addEventListener('focus', isColorSelected);
    sizeSelectorEl.addEventListener('change', () => selectOption('both'));
    colorSelectorEl.addEventListener('change', () => {
      sizeSelectorEl.options[0].selected = true;
    });
  } else if (sizeOptionDisplay === 'none') {
    colorSelectorEl.addEventListener('change', () => selectOption('colorOnly'));
  } else if (colorOptionDisplay === 'none') {
    sizeSelectorEl.addEventListener('change', () => selectOption('sizeOnly'));
  }
}

// 옵션 설정창 설정
function setOption(option) {
  const { color, size } = option;

  // color와 size가 없을 경우
  if (color === null && size === null) {
    optionSelectionEl.style.display = 'none';
    addSelectedOption();
    document.getElementById(`product-delete-${optionNum}`).remove();
    document.getElementById('selected-option').style.borderTop = '1px solid #c0c0c0';
  }

  // color 옵션만 선택하는 경우
  if (color !== null) {
    for (let i = 0; i < color.length; i += 1) {
      const colorEl = `<option value="${color[i]}">${color[i]}</option>`;
      colorSelectorEl.insertAdjacentHTML('beforeend', colorEl);
    }
  } else {
    colorOptionEl.style.display = 'none';
  }

  // size 옵션만 선택하는 경우
  if (size !== null) {
    for (let i = 0; i < size.length; i += 1) {
      const sizeEl = `<option value="${size[i]}">${size[i]}</option>`;
      sizeSelectorEl.insertAdjacentHTML('beforeend', sizeEl);
    }
  } else {
    sizeOptionEl.style.display = 'none';
  }

  handleOptionSelectChange();
}

// storage에 저장할 데이터 생성
function convertItemsToProductList(items) {
  return items.reduce((list, item) => {
    const name = item.children[0].children[0].textContent.trim();
    const options = item.children[0].children[1] ? item.children[0].children[1].textContent.replace('-', '') : null;
    const quantity = Number(item.children[1].textContent.trim());

    let color = null;
    let size = null;

    const colorDisplay = getComputedStyle(colorOptionEl).display;
    const sizeDisplay = getComputedStyle(sizeOptionEl).display;

    if (colorDisplay !== 'none' && sizeDisplay !== 'none') {
      color = options.split('/')[0].trim();
      size = options.split('/')[1].trim();
    } else if (colorDisplay !== 'none') {
      color = options.replace('-').trim();
    } else if (sizeDisplay !== 'none') {
      size = options.replace('-').trim();
    }

    const data = {
      name,
      mainImage,
      option: {
        color,
        size,
      },
      quantity,
      price: productPrice,
    };

    list.push(data);
    return list;
  }, []);
}

// 장바구니 버튼 클릭시 실행
function addToCart() {
  const items = Array.from(document.querySelectorAll('#selected-list > tr'));

  if (items.length === 0) {
    // eslint-disable-next-line no-alert
    alert('필수 옵션을 선택해주세요.');
    return;
  }
  const itemList = convertItemsToProductList(items);
  const basket = JSON.parse(localStorage.getItem('basket'));

  if (basket === null) {
    localStorage.setItem('basket', JSON.stringify(itemList));
  } else {
    const newBasket = basket.concat(itemList);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  }

  // eslint-disable-next-line no-alert
  if (!window.confirm('쇼핑을 계속하시겠습니까?')) {
    window.location.href = '../Basketpage/basket.html';
  }
}

function redirectToOrderPage() {
  const items = Array.from(document.querySelectorAll('#selected-list > tr'));

  if (items.length === 0) {
    // eslint-disable-next-line no-alert
    alert('필수 옵션을 선택해주세요.');
    return;
  }
  const itemList = convertItemsToProductList(items);

  // eslint-disable-next-line no-alert
  if (window.confirm('선택한 상품을 구매하시겠습니까?')) {
    sessionStorage.setItem('order', JSON.stringify(itemList));
    // eslint-disable-next-line no-alert
    window.location.href = '../Orderpage/payment.html';
  }
}

// 특정 상품의 정보데이터 받아오기
async function insertProductElement() {
  const url = '../../js/product/data.json'; // 임시 데이터
  // const url = '';

  try {
    const res = await fetch(url);
    const data = await res.json();

    const { name, option, image, detail_image: detailImage, content, price } = data;

    setInfo(name, price, content);
    setImage(image, detailImage);
    setOption(option);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // eslint-disable-next-line no-alert
    alert('상품 정보 요청 중 오류 발생 : ', err);
  }
}

insertProductElement();

buyNowBtn.addEventListener('click', redirectToOrderPage);
addToCartBtn.addEventListener('click', addToCart);
