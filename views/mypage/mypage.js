const getInfoButton = document.querySelector('.getInfo-category');
const changeInfoButton = document.querySelector('.changeInfo-category');
const deleteInfoButton = document.querySelector('.deleteInfo-category');
const categoryContainer = document.querySelector('.mypage-controller-container');
const infoContainer = document.querySelector('.mypage-info-container');
const logoutButton = document.querySelector('.logout');





/* 정보 조회 */
getInfoButton.addEventListener('click', async() => {
    infoContainer.innerHTML = ''; // 정보 초기화

    const userId = sessionStorage.getItem('userId');
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
})


/* 정보 수정 */
changeInfoButton.addEventListener('click', async() => {
    infoContainer.innerHTML = ''; // 정보 초기화

    const userId = sessionStorage.getItem('userId');
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
                <td><input type="text" value=${data.user.name}></td>
            </tr>
            <tr>
                <td>휴대폰 번호</td>
                <td><input type="text" value=${data.user.phonenumber}></td>
            </tr>
            <tr>
                <td>이메일</td>
                <td><input type="text" value=${data.user.email}></td>
            </tr>
            <tr>
                <td>비밀번호</td>
                <td><input type="text" value=${data.user.password}></td>
            </tr>
        </table>

        <div class="confirm-button-container">
            <button class="confirm-button">수정하기</button>
            <button class="cancel-button">취소하기</button>            
        </div>
    `

    const confirmInfoChangeButton = document.querySelector('.confirm-button');
    const cancelInfoChangeButton = document.querySelector('.cancel-button');

    confirmInfoChangeButton.addEventListener('click', async() => {
        infoContainer.innerHTML = ''; // 정보 초기화
        
        const userId = sessionStorage.getItem('userId');
        const res = await fetch(`/api/v1/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await res.json();
        console.log(data)
        // alert(data.message)
        // infoContainer.innerHTML = `
        // <table>
        //     <tr>
        //         <td>이름</td>
        //         <td>${data.user.name}</td>
        //     </tr>
        //     <tr>
        //         <td>휴대폰 번호</td>
        //         <td>${data.user.phonenumber}</td>
        //     </tr>
        //     <tr>
        //         <td>이메일</td>
        //         <td>${data.user.email}</td>
        //     </tr>
        //     <tr>
        //         <td>비밀번호</td>
        //         <td>${data.user.password}</td>
        //     </tr>
        // </table>
        // `
    })

    cancelInfoChangeButton.addEventListener('click', () => {
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
        <button class="quit-button">
            회원 탈퇴
        </button>
    `
    const quitButton = document.querySelector('.quit-button');
    quitButton.addEventListener('click', async () => {
            const userId = sessionStorage.getItem('userId');

        if (window.confirm('확인을 누르시면 회원 탈퇴됩니다.')){
            try {
                const res = await fetch(`/api/v1/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await res.json();
                alert(data.message);
                window.location.href = 'http://localhost:5001/'
            } catch (error) {
                console.error(error);
            }
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