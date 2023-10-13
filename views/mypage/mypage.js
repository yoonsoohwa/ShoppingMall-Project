const getInfoButton = document.querySelector('.getInfo-category');
const updateInfoButton = document.querySelector('.changeInfo-category');
const deleteInfoButton = document.querySelector('.deleteInfo-category');
const categoryContainer = document.querySelector('.mypage-controller-container');
const infoContainer = document.querySelector('.mypage-info-container');
const logoutButton = document.querySelector('.logout');

/* 정보 조회 */
getInfoButton.addEventListener('click', async () => {
  try {
    infoContainer.innerHTML = ''; // 정보 초기화
    const userId = sessionStorage.getItem('loginId');
    const res = await fetch(`/api/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    infoContainer.innerHTML = `
          <h1 class='infoContainer-title'>Profile</h1>
          <div class='infoContainer-inputbox-profile'>
            <table class="table-container">
                <tr>
                    <td>이름</td>
                    <td>${data.user.name}</td>
                </tr>
                <tr>
                    <td>휴대폰 번호</td>
                    <td>${data.user.phonenumber}</td>
                </tr>
                <tr>
                    <td>이메일</td>
                    <td>${data.user.email}</td>
                </tr>
            </table>
          </div>
        `;
  } catch (error) {
    infoContainer.innerHTML = `다시 시도해 주세요.`;
  }
});

/* 정보 수정 */
updateInfoButton.addEventListener('click', async () => {
  infoContainer.innerHTML = ''; // 정보 초기화

  const userId = sessionStorage.getItem('loginId');
  const res = await fetch(`/api/v1/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();

  infoContainer.innerHTML = `
      <h1 class='infoContainer-title'>Update Profile</h1>
      <div class='infoContainer-inputbox-profileUpdate'>
        <table class="table-container">
            <tr>
                <td>이메일</td>
                <td><input type="text" id="email" value=${data.user.email} disabled></td>
            </tr>
            <tr>
                <td>이름</td>
                <td><input type="text" id="name" value=${data.user.name}></td>
            </tr>
            <tr>
                <td>휴대폰 번호</td>
                <td><input type="text" id="phone" value=${data.user.phonenumber}></td>
            </tr>
            <tr>
                <td>기존 비밀번호</td>
                <td><input type="password" id="oldPassword"></td>
            </tr>
            <tr>
                <td>새 비밀번호</td>
                <td><input type="password" id="newPassword"></td>
            </tr>
            <tr>
                <td>새 비밀번호 확인</td>
                <td><input type="password" id="confirmPassword"></td>
            </tr>
        </table>
      </div>

        <div class="confirm-button-container">
            <button class="confirm-button">수정하기</button>
            <button class="cancel-button">취소하기</button>            
        </div>
    `;
  const confirmInfoUpdateButton = document.querySelector('.confirm-button');
  const cancelInfoUpdateButton = document.querySelector('.cancel-button');

  confirmInfoUpdateButton.addEventListener('click', async () => {
    const userId = sessionStorage.getItem('loginId');
    const confirmPassword = document.getElementById('confirmPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const userName = document.getElementById('name').value;
    const userPhoneNumber = document.getElementById('phone').value;
    const userEmail = document.getElementById('email').value;
    const oldPassword = document.getElementById('oldPassword').value;

    if (!userName) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(userPhoneNumber)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다. (예: 123-4567-8901)');
      return;
    }

    if (!oldPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/.test(newPassword)) {
        alert('8자 이상의 영문 대소문자, 숫자, 특수문자를 입력하세요.');
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const res = await fetch(`/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: oldPassword,
        updatedData: {
          name: userName, // 다른 업데이트 필드도 추가할 수 있음
          phonenumber: userPhoneNumber,
          email: userEmail,
          password: newPassword || undefined,
        },
      }),
    });
    const data = await res.json();

    alert(data.message);
    infoContainer.innerHTML = `
      <h1 class='infoContainer-title'>Update Profile</h1>
      <div class='infoContainer-inputbox-profileUpdate'>
        <table class="table-container">
            <tr>
                <td>이름</td>
                <td>${data.user.name}</td>
            </tr>
            <tr>
                <td>휴대폰 번호</td>
                <td>${data.user.phonenumber}</td>
            </tr>
            <tr>
                <td>이메일</td>
                <td>${data.user.email}</td>
            </tr>
        </table>
      </div>
        `;
  });

  cancelInfoUpdateButton.addEventListener('click', () => {
    window.location.href = 'http://localhost:5001/mypage';
  });
});

/* 회원 탈퇴 */
deleteInfoButton.addEventListener('click', () => {
  infoContainer.innerHTML = ''; // 정보 초기화
  infoContainer.innerHTML = `
      <h1 class='infoContainer-title'>Delete Profile</h1>
      <div class='infoContainer-inputbox-profileDelete'>
        <table class="table-container">
            <tr>
                <td>비밀번호</td>
                <td><input type="password" id="password"></td>
            </tr>
            <tr>
                <td>비밀번호 확인</td>
                <td><input type="password" id="confirmPassword"></td>
            </tr>
        </table>
      </div>

        <button class="quit-button">
            회원 탈퇴
        </button>
    `;
  const quitButton = document.querySelector('.quit-button');
  quitButton.addEventListener('click', async () => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!password || !confirmPassword) {
      alert('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const userId = sessionStorage.getItem('loginId');
    try {
      const res = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.message === '회원 탈퇴가 완료되었습니다.') {
        window.location.href = 'http://localhost:5001/';
      }
    } catch (error) {
      console.error(error);
    }
  });
});

/* 로그아웃 */
logoutButton.addEventListener('click', async () => {
  if (window.confirm('확인을 누르시면 로그아웃 됩니다.')) {
    try {
      const res = await fetch('/api/v1/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      alert(data.message);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  }
});
