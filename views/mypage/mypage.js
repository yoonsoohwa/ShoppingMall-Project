const getInfoButton = document.querySelector('.getInfo-category');
const updateInfoButton = document.querySelector('.changeInfo-category');
const deleteInfoButton = document.querySelector('.deleteInfo-category');
const categoryContainer = document.querySelector('.mypage-controller-container');
const infoContainer = document.querySelector('.mypage-info-container');
const logoutButton = document.querySelector('.logout');





/* 정보 조회 */
getInfoButton.addEventListener('click', async() => {
    try {
        infoContainer.innerHTML = ''; // 정보 초기화
        const userId = sessionStorage.getItem('loginId');
        const res = await fetch(`/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await res.json();
        infoContainer.innerHTML = `
            <table>
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
                <tr>
                    <td>비밀번호</td>
                    <td>${data.user.password}</td>
                </tr>
            </table>
        `
    } catch (error) {
        infoContainer.innerHTML = `다시 시도해 주세요.`
    }
})


/* 정보 수정 */
updateInfoButton.addEventListener('click', async () => {
    infoContainer.innerHTML = ''; // 정보 초기화

    const userId = sessionStorage.getItem('loginId');
    const res = await fetch(`/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await res.json();
    
    infoContainer.innerHTML = `
        <table class="table-container">
            <tr>
                <td>이름</td>
                <td><input type="text" id="name" value=${data.user.name}></td>
            </tr>
            <tr>
                <td>휴대폰 번호</td>
                <td><input type="text" id="phone" value=${data.user.phonenumber}></td>
            </tr>
            <tr>
                <td>이메일</td>
                <td><input type="text" id="email" value=${data.user.email}></td>
            </tr>
            <tr>
                <td>기존 비밀번호</td>
                <td><input type="text" id="oldPassword"></td>
            </tr>
            <tr>
                <td>새로운 비밀번호</td>
                <td><input type="text" id="newPassword"></td>
            </tr>
            <tr>
                <td>새로운 비밀번호 확인</td>
                <td><input type="text" id="confirmPassword"></td>
            </tr>
        </table>

        <div class="confirm-button-container">
            <button class="confirm-button">수정하기</button>
            <button class="cancel-button">취소하기</button>            
        </div>
    `
    const confirmInfoUpdateButton = document.querySelector('.confirm-button');
    const cancelInfoUpdateButton = document.querySelector('.cancel-button');

    confirmInfoUpdateButton.addEventListener('click', async() => {
        const userId = sessionStorage.getItem('loginId');
        const confirmPassword = document.getElementById('confirmPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const userName = document.getElementById('name').value;
        const userPhoneNumber = document.getElementById('phone').value;
        const userEmail = document.getElementById('email').value;
        const oldPassword = document.getElementById('oldPassword').value;
        
        const res = await fetch(`/api/v1/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: oldPassword,
                updatedData: {
                    name: userName, // 다른 업데이트 필드도 추가할 수 있음
                    phonenumber: userPhoneNumber,
                    email: userEmail,
                    password: newPassword,
                },
            }),
        })
        const data = await res.json();

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            window.location.href = 'http://localhost:5001/mypage';
        }

        alert(data.message)
        infoContainer.innerHTML = `
        <table>
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
        `
    })

    cancelInfoUpdateButton.addEventListener('click', () => {
        window.location.href = 'http://localhost:5001/mypage'
    })
})



/* 회원 탈퇴 */
deleteInfoButton.addEventListener('click', () => {
    infoContainer.innerHTML = ''; // 정보 초기화
    infoContainer.innerHTML = `
        <span>
            회원을 탈퇴하시겠습니까?
        </span>

        <table>
            <tr>
                <td>비밀번호</td>
                <td><input type="text" id="password"></td>
            </tr>
            <tr>
                <td>비밀번호 확인</td>
                <td><input type="text" id="confirmPassword"></td>
            </tr>
        </table>

        <button class="quit-button">
            회원 탈퇴
        </button>
    `
    const quitButton = document.querySelector('.quit-button');
    quitButton.addEventListener('click', async () => {
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value

        if (password !== confirmPassword) {
            alert('기존 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        const userId = sessionStorage.getItem('loginId');
        try {
            const res = await fetch(`/api/v1/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })
            const data = await res.json();
            alert(data.message);
            window.location.href = 'http://localhost:5001/'
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    })
})


/* 로그아웃 */
logoutButton.addEventListener('click', async () => {
    if (window.confirm('확인을 누르시면 로그아웃 됩니다.')){
        try {
            const res = await fetch('/api/v1/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const data = await res.json(); // 비동기 -> 동기 처리

            alert(data.message);
            window.location.href = 'http://localhost:5001/'
        } catch (error) {
            console.error(error);
        }
    }
})