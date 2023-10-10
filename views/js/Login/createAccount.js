import { response } from "express";
import { User } from "../../../models/Category.js";
import { register } from "../../../services/userService.js";



    const id = document.querySelector('.id');
    const userName = document.querySelector('.user-name');
    const password = document.querySelector('.password');
    const role = document.querySelector('.role');
    const address = document.querySelector('.address');
    const phoneNumber = document.querySelector('.phone-number');
    const email = document.querySelector('.email');
    const dataSubmit = document.querySelector('#data-submit')


    
    dataSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        
        let data = {
            id: id.value,
            userName: userName.value,
            password: password.value,
            role: role.value,
            address: address.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
        };

        const jsonData = JSON.stringify(data);  // JSON 문자열로 변환.
        
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData, // 변환한 JSON 문자열을 요청의 본문에 포함시킴
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));

        console.log(data)
    })

    //try catch
    //async await