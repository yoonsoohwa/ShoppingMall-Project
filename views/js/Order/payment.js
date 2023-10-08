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
const sumInput = document.querySelector('#total-sum');
const totalInput = document.querySelector('#total-pay');
const submitBtn = document.querySelector('#submit-btn');

goBackBtn.addEventListener('click', () => {
  history.go(-1);
});

// 추후에 로그인 상태 확인 코드 추가
// 주문하기를 눌러서 결제창으로 이동했을 때, 로그인창으로 이동 or 비회원으로 주문하기

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
  if (requestSelectBox.value === '직접입력') {
    requestTextArea.style.display = 'block';
  } else {
    requestTextArea.style.display = 'none';
  }
});

/* 주문상품에 해당 상품 추가 */
async function getOrderItems() {
  const url = '../../js/order/data.json'; // 임시 데이터

  try {
    const res = await fetch(url);
    const datas = await res.json();

    datas.forEach((data) => {
      const { id, image, name, option, count, price } = data;
      const color = option.color ? option.color : '';
      const size = option.size ? `/${option.size}` : '';

      products.innerHTML += `
      <div class="product mt-1 d-flex align-items-center" style="border: 1px solid #c0c0c0">
        <div class="pro-img">
          <img src="${image}" width="100px" height="100px">
        </div>
        <div class="description">
          <strong class="pro-name">${name}</strong>
          <li title="옵션">
            <p class="pro-option m-0">${color}${size}</p>
          </li>
          <li>수량: ${count}개</li>
          <div class="pro-price mt-2">${price.toLocaleString('ko-KR')}</div>
        </div>
        <button type="button" class="btn-close" aria-label="Close" data-product-id="${id}"></button>
      </div>
    `;
    });
  } catch (err) {
    console.log(err);
  }
}

/* 주문상품 목록삭제, 가격 업데이트 */

async function afterGetItems() {
  await getOrderItems();

  // 목록 삭제
  const closeBtns = document.querySelectorAll('.btn-close');
  let pricesArray = [];

  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const parentDiv = closeBtn.parentNode;
      const priceEle = parentDiv.querySelector('.pro-price'); // 제외할 가격
      pricesArray = removePriceFromArray(pricesArray, priceEle);

      parentDiv.remove();
      updatePayment(pricesArray); // update
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

/* 가상계좌 */
/*
virtualAccount();
function virtualAccount() {
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
  const customerKey = 'ldpxja-tpcYER6HCW2Xtq'; // 내 상점에서 고객을 구분하기 위해 발급한 고객의 고유 ID
  const submitBtn = document.querySelector('#submit-btn');

  // ------  결제위젯 초기화 ------
  // 비회원 결제에는 customerKey 대신 ANONYMOUS를 사용하세요.
  const paymentWidget = PaymentWidget(clientKey, customerKey); // 회원 결제
  // const paymentWidget = PaymentWidget(clientKey, PaymentWidget.ANONYMOUS) // 비회원 결제

  // ------  결제위젯 렌더링 ------
  // 결제수단 UI를 렌더링할 위치를 지정합니다. `#payment-method`와 같은 CSS 선택자와 결제 금액 객체를 추가하세요.
  // DOM이 생성된 이후에 렌더링 메서드를 호출하세요.
  // https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
  paymentWidget.renderPaymentMethods(
    '#payment-method',
    { value: totalInput.textContent },
    { variantKey: 'DEFAULT' }, // 렌더링하고 싶은 결제 UI의 variantKey
  );

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  // 더 많은 결제 정보 파라미터는 결제위젯 SDK에서 확인하세요.
  // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
  submitBtn.addEventListener('click', () => {
    paymentWidget.requestPayment({
      orderId: 'HEzAYuMwn6anZelPpnu5e', // 주문 ID 자동생성?
      orderName:
        document.querySelectorAll('.pro-name').length > 1
          ? `${document.querySelector('.pro-name').textContent} 외 ${
              document.querySelectorAll('.pro-name').length - 1
            }건`
          : document.querySelector('.pro-name').textContent,
      successUrl: 'http://localhost:8080/success', // 결제에 성공하면 이동하는 페이지(직접 만들어주세요)
      failUrl: 'http://localhost:8080/fail', // 결제에 실패하면 이동하는 페이지(직접 만들어주세요)
      customerEmail: emailInput.value,
      customerName: nameInput.value,
    });
  });
}
*/
virtualAccount();
function virtualAccount() {
  // ------ 클라이언트 키로 객체 초기화 ------
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
  const tossPayments = TossPayments(clientKey);

  submitBtn.addEventListener('click', () => {
    // ------ 결제창 띄우기 ------
    tossPayments
      .requestPayment('가상계좌', {
        // 결제 정보 파라미터
        amount: totalInput.textContent,
        orderId: 'tzdKGiX7b31bdAKMF6LbP', // 주문 ID 자동생성?
        orderName:
          document.querySelectorAll('.pro-name').length > 1
            ? `${document.querySelector('.pro-name').textContent} 외 ${
                document.querySelectorAll('.pro-name').length - 1
              }건`
            : document.querySelector('.pro-name').textContent,
        customerName: nameInput.value,
        customerEmail: emailInput.value,
        successUrl: 'http://localhost:8080/success', // 결제 성공 시 이동할 페이지
        failUrl: 'http://localhost:8080/fail', // 결제 실패 시 이동할 페이지
        validHours: 24, // 입금 기한
        cashReceipt: {
          // 현금영수증 발행
          type: '소득공제',
        },
      })
      // ------ 결제창을 띄울 수 없는 에러 처리 ------
      // 메서드 실행에 실패해서 reject 된 에러를 처리하는 블록입니다.
      // 결제창에서 발생할 수 있는 에러를 확인하세요.
      // https://docs.tosspayments.com/reference/error-codes#결제창공통-sdk-에러
      .catch((error) => {
        if (error.code === 'USER_CANCEL') {
          // 결제 고객이 결제창을 닫았을 때 에러 처리
        } else if (error.code === 'INVALID_CARD_COMPANY') {
          // 유효하지 않은 카드 코드에 대한 에러 처리
        }
      });
  });
}

/* db에 데이터 전달 (post) */

submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  virtualAccount();

  const name = nameInput.value;
  const email = emailInput.value;
  const phoneNumber = phoneNumberInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  const receiverName = receiverNameInput.value;
  const receiverPhoneNumber = receiverPhoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const request = requestSelectBox.value;

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
