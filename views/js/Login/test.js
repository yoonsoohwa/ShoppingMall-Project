const test = document.querySelector('.id');
const testBtn = document.querySelector('#data-submit');

testBtn.addEventListener('click', (e) => {
    e.preventDefault();

    console.log(test.value);
})