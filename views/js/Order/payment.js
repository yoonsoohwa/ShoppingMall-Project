const goBackBtn = document.querySelector('.bi-arrow-left');

const nameInput = document.querySelector('#inputName');
const emailInput = document.querySelector('#inputEmail');
const phoneNumberInput = document.querySelector('#inputPhoneNumber');
const passwordInput = document.querySelector('#inputPassword');
const passwordConfirmInput = document.querySelector('#inputConfirmPassword');

const flexRadioDefault1 = document.querySelector('#flexRadioDefault1');
const flexRadioDefault2 = document.querySelector('#flexRadioDefault2');

const receiverNameInput = document.querySelector('#inputRName');
const receiverPhoneNumberInput = document.querySelector('#inputRPhoneNumber');
const postalCodeInput = document.querySelector('#postalCode');
const searchAddressButton = document.querySelector('#search-address-btn');
const address1Input = document.querySelector('#inputAdress1');
const address2Input = document.querySelector('#inputAdress2');
const requestSelectBox = document.querySelector('#request-select-box');
const requestTextArea = document.querySelector('#request-textarea');

const products = document.querySelector('.products');
const submitBtn = document.querySelector('#submit-btn');

goBackBtn.addEventListener('click', () => {
  history.go(-1);
});

// 추후에 로그인 상태 확인 코드 추가

/* radio btn value값 채워지기 */
flexRadioDefault1.addEventListener('change', (e) => {
  e.preventDefault();
  if (flexRadioDefault1.checked) {
    receiverNameInput.value = nameInput.value;
    receiverPhoneNumberInput.value = phoneNumberInput.value;
  }
});
flexRadioDefault2.addEventListener('change', (e) => {
  e.preventDefault();
  if (flexRadioDefault2.checked) {
    receiverNameInput.value = '';
    receiverPhoneNumberInput.value = '';
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
  if (requestSelectBox.value === '6') {
    requestTextArea.style.display = 'block';
  }
});

/* 주문상품에 해당 상품 추가 */
products.innerHTML += `
  <div class="product d-flex align-items-center">
    <div class="pro-img">
      <img class="" src="//ulkin.co.kr/web/product/small/202309/19b4596d0e91c03d535b4da0cbff8d5b.jpg" width="100px" height="100px">
    </div>
    <div class="description">
      <strong class="pro-name">Frame Brief Tote Bag</strong>
      <li title="옵션">
        <p class="option m-0">balck/Free</p>
      </li>
      <li>수량: 1개</li>
      <div class="pro-price">429,000</div>
    </div>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
`;

/* 목록 삭제 */
const closeBtn = document.querySelector('.btn-close');
closeBtn.addEventListener('click', () => {
  const parentDiv = closeBtn.parentNode;
  parentDiv.remove();
});

/* db에 데이터 전달 (post) */
submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const phoneNumber = phoneNumberInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordInput.value;

  const receiverName = receiverNameInput.value;
  const receiverPhoneNumber = receiverPhoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const request = requestSelectBox.value;

  if (!name) {
    return alert('주문자를 입력해주세요.');
  }
  if (!phoneNumber) {
    return alert('전화번호를 입력해 주세요.');
  }
  if (!email) {
    return alert('이메일을 입력해 주세요.');
  }
  if (!password) {
    return alert('비밀번호를 입력해 주세요.');
  }
  if (!passwordConfirm) {
    return alert('비밀번호 확인을 입력해 주세요.');
  }
  if (!name || !phoneNumber || !email || !password || !passwordConfirm) {
    return alert('주문 정보를 모두 입력해 주세요.');
  }
  if (!receiverName || !receiverPhoneNumber || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  // 비밀번호 비교
  if (password !== passwordConfirm) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  const data = {
    name: receiverName,
    phone: receiverPhoneNumber,
    address: postalCode + address1 + address2,
    request,
  };

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
  } catch (error) {
    alert(`${error}결제 중 오류가 났습니다.`);
  }
}
