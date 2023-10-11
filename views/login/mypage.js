/*
/api/v1/users/:id [사용자 정보 조회 API, GET]
/api/v1/users/:id [사용자 정보 수정 API, PUT]
/api/v1/users/:id [사용자 정보 삭제 API, DELETE]
*/

// import { xmlStringToDom, removeChildren } from "/Users/bighk95/Desktop/coding/eliceproject1/shopping_project_2team/views/js/Category/utils";

const getInfoButton = document.querySelector('.getInfo-category');
const changeInfoButton = document.querySelector('.changeInfo-category');
const deleteInfoButton = document.querySelector('.deleteInfo-category');
const categoryContainer = document.querySelector('.mypage-controller-container');
const infoContainer = document.querySelector('.mypage-info-container');

getInfoButton.addEventListener('click', () => {
    infoContainer.innerHTML = ''; // 정보 초기화
    infoContainer.innerHTML = `
        <span>
            정보를 성공적으로 불러왔습니다.
        </span>
    `
})

changeInfoButton.addEventListener('click', () => {
    infoContainer.innerHTML = ''; // 정보 초기화
    infoContainer.innerHTML = `
        <span>
            정보를 성공적으로 수정했습니다.
        </span>
    `
})

deleteInfoButton.addEventListener('click', () => {
    infoContainer.innerHTML = ''; // 정보 초기화
    infoContainer.innerHTML = `
        <span>
            정보를 성공적으로 삭제했습니다.
        </span>
    `
})
