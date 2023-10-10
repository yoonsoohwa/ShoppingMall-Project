// import { response } from "express";
// import { User } from "../../../models/Category.js";
// import { register } from "../../../services/userService.js";


// document.getElementById('register-form').addEventListener('submit', function(event) {
//     event.preventDefault();
    const dataList = document.querySelector('#register-form');
    const dataSubmit = document.querySelector('#data-submit');

    dataSubmit.addEventListener('click', (e) => {
        e.preventDefault();
    
    // 입력된 데이터 가져오기
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let role = document.getElementById('role').value;
    let address = document.getElementById('address').value;
    let phoneNumber = document.getElementById('phone-number').value;
    let email = document.getElementById('email').value;


    // 서버에 전송할 데이터 객체 생성
    let data = {
        id: id,
        name: name,
        password: password,
        role: role,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
    };

    // fetch('/register', { 
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch((error) => console.error('Error:', error));
    console.log(data)
    });