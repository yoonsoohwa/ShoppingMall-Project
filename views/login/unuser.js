const orderIdInput = document.querySelector('#order-id');
const orderPwdInput = document.querySelector('#order-password');
const submitBtn = document.querySelector('#submit-btn');

submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit() {
  const id = orderIdInput.value;
  const password = orderPwdInput.value;

  // 객체 만듦
  const data = {
    id,
    orderPassword: password,
  };

  // 입력 여부 확인
  if (!id) {
    return alert('주문번호를 입력해 주세요.');
  }

  if (!password) {
    return alert('비밀번호를 입력해 주세요.');
  }

  const dataJson = JSON.stringify(data);
  const apiUrl = `http://localhost:5001/api/v1/orders/get/guest`; // 주문정보 보내기 => how..?

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    if (res.status === 200) {
      const result = await res.json();
      alert(result.message);
      window.location.href = '/order';
    } else {
      alert('로그인에 실패하였습니다...');
    }
  } catch (error) {
    alert('요청 오류:', error);
  }
}
