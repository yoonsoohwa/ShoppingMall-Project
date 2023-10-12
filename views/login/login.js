// const { response } = require('express');

/* 로그인 */
const logEmailInput = document.querySelector('#logEmailInput');
const logPasswordInput = document.querySelector('#logPasswordInput');
const logSubmitBtn = document.querySelector('#submit-signin');

logSubmitBtn.addEventListener('click', handleSigninSubmit);

/* sign in post 요청 */
async function handleSigninSubmit(e) {
  e.preventDefault();

  // 유효성 검사 실행
  if (!signinValidation()) {
    // 유효성 검사 실패
    return;
  }

  const email = logEmailInput.value;
  const password = logPasswordInput.value;

  const data = {
    email,
    password,
  };

  const dataJson = JSON.stringify(data);

  const apiUrl = `/api/v1/users/login`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    const result = await res.json();
    if (res.status === 200) {
      alert(result.message);
      sessionStorage.setItem('loginId', result.user._id);
      sessionStorage.setItem('role', result.user.role);
      window.location.href = '/'; // main page로 이동
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('요청 오류:', error);
  }
}

/* --------------------------------------------------------- */
/* 회원가입 */

const nameInput = document.querySelector('#nameInput');
const emailInput = document.querySelector('#emailInput');
const sendBtn = document.querySelector('#send');
const certifyInput = document.querySelector('#certifyInput');
const verificationBtn = document.querySelector('#verification');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitBtn = document.querySelector('#submit-signup');

/* email 인증 */
sendBtn.addEventListener('click', sendMail);

async function sendMail(e) {
  e.preventDefault();

  // 유효성 검사 실행 => email
  if (!emailValidation()) {
    // 유효성 검사 실패
    return;
  }

  const email = emailInput.value;
  const data = {
    email,
  };

  const dataJson = JSON.stringify(data);

  const apiUrl = `/api/v1/users/register/send-mail`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    const result = await res.json();

    if (res.status === 200) {
      alert(result.message);
      authNumber = result.emailVerificationCode;
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('요청 오류:', error);
  }
}

verificationBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const code = certifyInput.value;
  if (email && code) {
    try {
      if (!code) {
        certifyInput.focus();
        return alert('인증번호를 입력해 주세요.');
      }
      const response = await fetch('/api/v1/users/register/verify-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.status === 200) {
        const data = await response.json();
        alert(data.message);
        emailInput.disabled = true;
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
});

/* sign up post 요청 */
submitBtn.addEventListener('click', handleSignupSubmit);

async function handleSignupSubmit(e) {
  e.preventDefault();

  // 유효성 검사 실행
  if (!signupValidation()) {
    // 유효성 검사 실패
    return;
  }

  const name = nameInput.value;
  const email = emailInput.value;
  const phonenumber = phoneNumberInput.value;
  const password = passwordInput.value;

  const data = {
    name,
    email,
    phonenumber,
    password,
  };

  const dataJson = JSON.stringify(data);

  const apiUrl = `/api/v1/users/register`;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: dataJson,
    });

    const result = await res.json();
    if (res.status === 201) {
      alert(result.message);
      document.getElementById('tab-1').checked = true;
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('요청 오류:', error);
  }
}

/* --------------------------------------------- */

/* 유효성 검사 */

// email 부분만 분리 -> send-mail 에 사용
function emailValidation() {
  if (!emailInput.value) {
    emailInput.focus();
    alert('이메일을 입력해 주세요.');
    return false;
  }
  /* 정규식 */
  // 이메일 (영어 대소문자, 숫자, _, .-을 포함 / 최상위 도메인: 최소 2자 이상의 알파벳 대소문자)
  const regMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regMail.test(emailInput.value)) {
    emailInput.focus();
    alert('잘못된 이메일 형식입니다.');
    return false;
  }
  return true;
}

// sign in
function signinValidation() {
  // sign in 제대로 써져있는지 확인
  if (!logEmailInput.value) {
    logEmailInput.focus();
    alert('잘못된 이메일 형식입니다.');
    return false;
  }

  if (!logPasswordInput.value) {
    logPasswordInput.focus();
    alert('비밀번호를 입력해 주세요.');
    return false;
  }

  /* 정규식 */
  // 이메일 (영어 대소문자, 숫자, _, .-을 포함 / 최상위 도메인: 최소 2자 이상의 알파벳 대소문자)
  const regMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 비밀번호 (영어 대소문자, 숫자, 특수문자 포함, 8자 이상)
  const regPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

  // sign in 정규식 확인
  if (!regMail.test(logEmailInput.value)) {
    logEmailInput.focus();
    alert('잘못된 이메일 형식입니다.');
    return false;
  }

  if (!regPw.test(logPasswordInput.value)) {
    logPasswordInput.focus();
    alert('8자 이상의 영문 대소문자, 숫자만 입력하세요.');
    return false;
  }

  // 모든 유효성 검사 통과
  return true;
}

// sign up
function signupValidation() {
  // sign up 제대로 써져있는지 확인
  if (!nameInput.value) {
    nameInput.focus();
    alert('이름을 입력해 주세요.');
    return false;
  }
  if (!phoneNumberInput.value) {
    phoneNumberInput.focus();
    alert('전화번호를 입력해 주세요.');
    return false;
  }
  if (!passwordInput.value) {
    passwordInput.focus();
    alert('비밀번호를 입력해 주세요.');
    return false;
  }
  if (!passwordConfirmInput.value) {
    passwordConfirmInput.focus();
    alert('비밀번호 확인을 입력해 주세요.');
    return false;
  }

  /* 정규식 */
  // 이름 (한글, 영어, 2글자이상)
  const regName = /^[가-힣a-zA-Z]{2,}$/;

  // 비밀번호 (영어 대소문자, 숫자, 특수문자 포함, 8자 이상)
  const regPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

  // 전화번호 (3-3,4-4)
  const regPhone = /([0-9]{3})-([0-9]{3,4})-([0-9]{4})$/;

  // sign up 정규식 확인
  if (!regName.test(nameInput.value)) {
    nameInput.focus();
    alert('최소 2글자 이상, 한글과 영어만 입력하세요.');
    return false;
  }

  if (!regPhone.test(phoneNumberInput.value)) {
    phoneNumberInput.focus();
    alert('잘못된 전화번호 형식입니다.');
    return false;
  }

  if (!regPw.test(passwordInput.value)) {
    passwordInput.focus();
    alert('8자 이상의 영문 대소문자, 숫자만 입력하세요.');
    return false;
  }

  if (!regPw.test(passwordConfirmInput.value)) {
    passwordConfirmInput.focus();
    alert('8자 이상의 영문 대소문자, 숫자만 입력하세요.');
    return false;
  }
  // 비밀번호 확인
  if (passwordInput.value !== passwordConfirmInput.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return false;
  }

  emailValidation();

  // 모든 유효성 검사 통과
  return true;
}
