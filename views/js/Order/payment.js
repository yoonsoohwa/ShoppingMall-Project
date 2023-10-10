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

/* 뒤로가기 */
goBackBtn.addEventListener('click', () => {
  history.go(-1);
});

// 추후에 로그인 상태 확인 코드 추가 => isRegistered
// 주문하기를 눌러서 결제창으로 이동했을 때, 로그인창으로 이동 or 비회원으로 주문하기
const isRegistered = false; // 수정

const unuser = document.querySelector('#unuser-password');
if (!isRegistered) {
  unuser.style.display = 'block';
} else {
  unuser.style.display = 'none';
}

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
      } else {
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
  // sessionStorage 이용
  const datas = JSON.parse(sessionStorage.getItem('order'));
  datas.forEach((data) => {
    const { id, mainImage, name, option, quantity, price } = data;
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
        <button type="button" class="btn-close" aria-label="Close" data-product-id="${id}"></button>
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

/* db에 데이터 전달 (post) */

submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  // virtualAccount();

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  const receiverName = receiverNameInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const request = requestSelectBox.value;

  if (!name || !email || !password || !passwordConfirm) {
    return alert('주문 정보를 모두 입력해 주세요.');
  }
  if (!receiverName || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  // 비밀번호 비교
  if (password !== passwordConfirm) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  const items = document.querySelectorAll('.product');
  const orderItems = [];
  items.forEach((item) => {
    const proName = item.querySelector('.pro-name').textContent;
    const proOptions = item.querySelector('.pro-option').textContent;
    const proCount = item.querySelector('.pro-count').textContent.split('개')[0];
    const proPrice = item.querySelector('.pro-price').textContent;

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
      name: proName,
      option: {
        color,
        size,
      },
      count: proCount,
      price: proPrice,
    };
    orderItems.push(orderItem);
  });

  const totalPrice = parseInt(totalInput.textContent.replace(',', ''));

  const data = {
    username: name,
    orderItems,
    totalPrice,
    status: '주문대기',
    isRegistered: false,
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

  // 비회원
  if (!isRegistered) {
    data.password = password;
    const unuserDataJson = JSON.stringify(data);
    const unuserApiUrl = ``;

    try {
      const unuserRes = await fetch(unuserApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: unuserDataJson,
      });
    } catch (error) {
      alert(`${error} 결제 중 오류가 났습니다.`);
    }
  } else {
    // 회원
    const dataJson = JSON.stringify(data);
    const apiUrl = ``;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataJson,
      });

      if (res.status === 201) {
        alert('결제가 완료되었습니다!');
        window.location.href = '/views/pages/Order/order.html';
      } else {
        alert('결제에 실패하였습니다...');
      }
    } catch (error) {
      alert(`${error} 결제 중 오류가 났습니다.`);
    }
  }
}
