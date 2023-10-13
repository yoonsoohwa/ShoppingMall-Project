const goBackBtn = document.querySelector('.bi-arrow-left');

const nameInput = document.querySelector('#inputName');
const emailInput = document.querySelector('#inputEmail');
const passwordInput = document.querySelector('#inputPassword');
const passwordConfirmInput = document.querySelector('#inputConfirmPassword');

const flexRadioDefault1 = document.querySelector('#flexRadioDefault1');
const flexRadioDefault2 = document.querySelector('#flexRadioDefault2');

const receiverNameInput = document.querySelector('#inputRName');
const postalCodeInput = document.querySelector('#postalCode');
const searchAddressButton = document.querySelector('#search-address-btn');
const address1Input = document.querySelector('#inputAdress1');
const address2Input = document.querySelector('#inputAdress2');
const requestSelectBox = document.querySelector('#request-select-box');
const requestTextArea = document.querySelector('#request-textarea');

const products = document.querySelector('.products');
const sumInput = document.querySelector('#total-sum');
const totalInput = document.querySelector('#total-pay');
const submitBtn = document.querySelector('#submit-btn');
const unuser = document.querySelector('#unuser-password');

/* 뒤로가기 */
goBackBtn.addEventListener('click', () => {
  window.history.go(-1);
});

/* user인지 확인 */
let isuser;
async function checkLogin() {
  try {
    const res = await fetch(`/api/v1/users/check-login`, {
      credentials: 'include',
    });
    const data = await res.json();
    const { isLoggedIn } = data;

    if (isLoggedIn) {
      isuser = true;
    } else {
      isuser = false;
      // confirm창 확인 -> 그대로 주문/ 취소 -> login 페이지로 이동
      confirm('비회원으로 주문하시겠습니까?') ? (unuser.style.display = 'block') : (window.location.href = '/login');
    }
  } catch (error) {
    alert('데이터를 가져오는 중 에러 발생:', error);
  }
}
checkLogin();

/* user icon click */
const userBtn = document.querySelector('.bi-person');
userBtn.addEventListener('click', () => {
  isuser ? (window.location.href = '/mypage') : (window.location.href = '/login');
});

/* radio btn value값 채워지기 */
flexRadioDefault1.addEventListener('change', (e) => {
  e.preventDefault();
  if (flexRadioDefault1.checked) {
    receiverNameInput.value = nameInput.value;
  }
});
flexRadioDefault2.addEventListener('change', (e) => {
  e.preventDefault();
  if (flexRadioDefault2.checked) {
    receiverNameInput.value = '';
  }
});

/* 주소찾기 */
searchAddressButton.addEventListener('click', searchAddress);

function searchAddress() {
  new daum.Postcode({
    oncomplete(data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ` (${extraAddr})`;
        }
      }

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.placeholder = '상세 주소를 입력해 주세요.';
      address2Input.focus();
    },
  }).open();
}

/* 직접입력 => textarea 보이게 */
requestSelectBox.addEventListener('change', () => {
  if (requestSelectBox.value === '직접입력') {
    requestTextArea.style.display = 'block';
  } else {
    requestTextArea.style.display = 'none';
  }
});

/* 주문상품에 해당 상품 추가 */
function getOrderItems() {
  // sessionStorage 에서 주문상품 가져오기
  const datas = JSON.parse(sessionStorage.getItem('order'));
  datas.forEach((data) => {
    const { productId, mainImage, name, option, quantity, price } = data;
    const { color, size } = option;
    const total = price * quantity;
    let optionText = '';

    // color와 size 값이 있을 때만 표시
    if (color && size) {
      optionText = `${color}/${size}`;
    } else if (color) {
      optionText = `color: ${color}`;
    } else if (size) {
      optionText = `size: ${size}`;
    } else {
      optionText = '';
    }

    const itemHtml = `
      <div class="product mt-1 d-flex align-items-center" style="border: 1px solid #c0c0c0">
        <div class="pro-id" style="display: none;">${productId}</div>
        <div class="pro-img">
          <img src="${mainImage}" width="100px" height="100px">
        </div>
        <div class="description">
          <strong class="pro-name">${name}</strong>
          <li title="옵션">
            <p class="pro-option m-0">${optionText}</p>
          </li>
          <li>
            <p class="pro-count m-0">${quantity}개</p>
          </li>
          <div class="pro-price mt-2">${total.toLocaleString('ko-KR')}</div>
        </div>
        <button type="button" class="btn-close" aria-label="Close" data-product-id="${productId}"></button>
      </div>
    `;
    products.insertAdjacentHTML('beforeend', itemHtml);
  });
}

/* 주문상품 목록삭제, 가격 업데이트 */

async function afterGetItems() {
  await getOrderItems();

  // 목록 삭제
  const closeBtns = document.querySelectorAll('.btn-close');
  let pricesArray = [];

  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const confirmed = confirm('선택한 상품을 삭제하시겠습니까?');
      if (confirmed) {
        const parentDiv = closeBtn.parentNode;
        const priceEle = parentDiv.querySelector('.pro-price'); // 제외할 가격
        pricesArray = removePriceFromArray(pricesArray, priceEle);

        parentDiv.remove();
        updatePayment(pricesArray); // update
      }
    });
  });

  // 결제 금액
  const priceEle = document.querySelectorAll('.pro-price');
  priceEle.forEach((price) => pricesArray.push(parseInt(price.textContent.replace(',', ''))));
  updatePayment(pricesArray);
}

afterGetItems();

// 결제 금액 sum, update
function updatePayment(pricesArray) {
  const sum = pricesArray.reduce((acc, cur) => acc + cur, 0);
  sumInput.textContent = sum.toLocaleString('ko-KR');
  totalInput.textContent = sum.toLocaleString('ko-KR');
}

// 삭제된 요소의 가격을 배열에서 제거
function removePriceFromArray(pricesArray, priceEle) {
  const deletedPrice = parseInt(priceEle.textContent.replace(',', ''));
  return pricesArray.filter((price) => price !== deletedPrice);
}

// ----------------------------------------------------

/* db에 데이터 전달 (post) */

submitBtn.addEventListener('click', (e) => {
  if (isuser) {
    userHandleSubmit(e);
  } else {
    unuserHandleSubmit(e);
  }
});

/* 회원일때, */
async function userHandleSubmit(e) {
  e.preventDefault();

  // 유효성 검사 실행
  if (!userValidation()) {
    // 유효성 검사 실패
    return;
  }

  const email = emailInput.value;
  const receiverName = receiverNameInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const request = requestSelectBox.value;

  const items = document.querySelectorAll('.product');
  const orderItems = [];
  items.forEach((item) => {
    const proId = item.querySelector('.pro-id').textContent;
    const proOptions = item.querySelector('.pro-option').textContent;
    const proCount = item.querySelector('.pro-count').textContent.split('개')[0];

    let color;
    let size;
    if (proOptions.includes('/')) {
      color = proOptions.split('/')[0];
      size = proOptions.split('/')[1];
    } else if (proOptions.includes('color')) {
      color = proOptions.split(': ')[1];
    } else if (proOptions.includes('size')) {
      size = proOptions.split(': ')[1];
    }

    // 주문 항목을 객체로 생성하고 배열에 추가
    const orderItem = {
      quantity: proCount,
      option: {
        size,
        color,
      },
      item: proId,
    };
    orderItems.push(orderItem);
  });

  const totalPrice = parseInt(totalInput.textContent.replace(',', ''));

  const data = {
    orderItems,
    email,
    totalPrice,
    status: '배송준비중',
    message: request,
    address: {
      postnumber: postalCode,
      addressee: receiverName,
      addressExceptDetail: address1,
      detail: address2,
    },
  };

  if (request === '직접입력') {
    data.message = requestTextArea.value;
  }

  const dataJson = JSON.stringify(data);
  const apiUrl = `/api/v1/orders`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    if (res.status === 201) {
      const result = await res.json();
      alert(result.message);
      window.location.href = '/order'; // 주문조회 페이지로 이동
    } else {
      alert('주문에 실패하였습니다.');
    }
  } catch (error) {
    alert(`${error} 주문 중 오류가 발생하였습니다.`);
  }
}

/* 비회원일때, */
async function unuserHandleSubmit(e) {
  e.preventDefault();

  // 유효성 검사 실행
  if (!unuserValidation()) {
    // 유효성 검사 실패
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;
  const receiverName = receiverNameInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const request = requestSelectBox.value;

  const items = document.querySelectorAll('.product');
  const orderItems = [];
  items.forEach((item) => {
    const proId = item.querySelector('.pro-id').textContent;
    const proOptions = item.querySelector('.pro-option').textContent;
    const proCount = item.querySelector('.pro-count').textContent.split('개')[0];

    let color;
    let size;
    if (proOptions.includes('/')) {
      color = proOptions.split('/')[0];
      size = proOptions.split('/')[1];
    } else if (proOptions.includes('color')) {
      color = proOptions.split(': ')[1];
    } else if (proOptions.includes('size')) {
      size = proOptions.split(': ')[1];
    }

    // 주문 항목을 객체로 생성하고 배열에 추가
    const orderItem = {
      quantity: proCount,
      option: {
        size,
        color,
      },
      item: proId,
    };
    orderItems.push(orderItem);
  });

  const totalPrice = parseInt(totalInput.textContent.replace(',', ''));

  const data = {
    orderItems,
    email,
    totalPrice,
    status: '배송준비중',
    message: request,
    orderPassword: password,
    address: {
      postnumber: postalCode,
      addressee: receiverName,
      addressExceptDetail: address1,
      detail: address2,
    },
  };

  if (request === '직접입력') {
    data.message = requestTextArea.value;
  }

  const dataJson = JSON.stringify(data);
  const apiUrl = `/api/v1/orders/guest`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    if (res.status === 201) {
      const result = await res.json();
      alert(result.message);
      window.location.href = '/login/unuser'; // 비회원 주문조회 페이지로 이동
    } else {
      alert('주문에 실패하였습니다.');
    }
  } catch (error) {
    alert(`${error} 주문 중 오류가 발생하였습니다.`);
  }
}

// ----------------------------------------------------
/* 유효성 검사 */

// 회원
function userValidation() {
  // sign in 제대로 써져있는지 확인
  if (!nameInput.value || !emailInput.value) {
    alert('주문 정보를 모두 입력해 주세요.');
    return false;
  }
  if (!receiverNameInput.value || !postalCodeInput.value || !address1Input.value || !address2Input.value) {
    alert('배송지 정보를 모두 입력해 주세요.');
    return false;
  }

  /* 정규식 */
  // 이메일 (영어 대소문자, 숫자, _, .-을 포함 / 최상위 도메인: 최소 2자 이상의 알파벳 대소문자)
  const regMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 정규식 확인
  if (!regMail.test(emailInput.value)) {
    emailInput.focus();
    alert('잘못된 이메일 형식입니다.');
    return false;
  }

  // 모든 유효성 검사 통과
  return true;
}

// 비회원
function unuserValidation() {
  // sign in 제대로 써져있는지 확인
  if (!nameInput.value || !emailInput.value || !passwordInput.value || !passwordConfirmInput.value) {
    alert('주문 정보를 모두 입력해 주세요.');
    return false;
  }
  if (!receiverNameInput.value || !postalCodeInput.value || !address1Input.value || !address2Input.value) {
    alert('배송지 정보를 모두 입력해 주세요.');
    return false;
  }

  // 비밀번호 비교
  if (passwordInput.value !== passwordConfirmInput.value) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  /* 정규식 */
  // 이메일 (영어 대소문자, 숫자, _, .-을 포함 / 최상위 도메인: 최소 2자 이상의 알파벳 대소문자)
  const regMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 비밀번호 (영어 대소문자, 숫자, 특수문자 포함, 8자 이상)
  const regPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

  // sign in 정규식 확인
  if (!regMail.test(emailInput.value)) {
    emailInput.focus();
    alert('잘못된 이메일 형식입니다.');
    return false;
  }

  if (!regPw.test(passwordInput.value)) {
    passwordInput.focus();
    alert('8자 이상의 영문 대소문자, 숫자만 입력하세요.');
    return false;
  }

  // 모든 유효성 검사 통과
  return true;
}
