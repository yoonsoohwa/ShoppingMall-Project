// const productCategory = document.querySelector('.products-about-category')
const all = document.querySelector('.all')
// const top = document.querySelector('.top');
// const outer = document.querySelector('.outer');
// const bottom = document.querySelector('.bottom');
// const dress = document.querySelector('.dress');
// const bag = document.querySelector('.bag');
// const shoes = document.querySelector('.shoes');
// const hat = document.querySelector('.hat');
// const acc = document.querySelector('.acc');
// const etc = document.querySelector('.etc');
const nextButton = document.querySelector('.swiper-next-controller');
const prevButton = document.querySelector('.swiper-prev-controller');
const swiper = document.querySelector('.best-products-swipe');
// const bestProducts = document.querySelector('.best-product')

/* swiper */
// console.log(swiper.children[3].innerHTML);
// console.log(swiper.lastElementChild.innerHTML);

let bestProductsList = [];
for(let i = 0; i < swiper.childElementCount; i++){
    bestProductsList.push(swiper.children[i].innerHTML)
}

for(let i = 0; i < 3; i++){
        bestProductsList.push(swiper.children[i].innerHTML);
}

for(let i = 7; i < 4; i--){
        bestProductsList.unshift(swiper.children[i].innerHTML);
}

swiper.innerHTML = bestProductsList
console.log(swiper.innerHTML)
let currentIndex = 0;

nextButton.addEventListener('click', () => {
    currentIndex -= 320;
    swiper.style.transform = `translateX(${currentIndex}px)`
})
prevButton.addEventListener('click', () => {
    currentIndex += 320;
    swiper.style.transform = `translateX(${currentIndex}px)`
})
function showItem(index) {
    let item = bestProductsList[index];
}

// 다음 아이템으로 이동
function nextItem() {
    currentIndex++;
    if (currentIndex > bestProductsList.length - 2) { // 만약 복제된 마지막 아이템을 넘어섰다면,
        currentIndex = 1; // 실제 첫 번째 아이템으로 돌아갑니다.
        // 여기서 CSS transition을 off하고, transform 값을 즉시 변경해야 합니다.
        // 그 후 CSS transition을 다시 on합니다.
    }
    showItem(currentIndex);
}

// 이전 아이템으로 이동
function prevItem() {
    currentIndex--;
    if (currentIndex < 1) { // 만약 복제된 첫 번째 아이템보다 앞으로 갔다면,
        currentIndex = bestProductsList.length - 2; // 실제 마지막 아이템으로 돌아갑니다.
        // 여기서도 CSS transition을 off하고, transform 값을 즉시 변경한 후 다시 on해야 합니다.
    }
    showItem(currentIndex);
}


/* categories underline */


all.addEventListener('click', () => {
    all.style.textDecoration = `underline`
})


/* main product title */
    // top.addEventListener('click', () => {
    //     productCategory.innerText = `Top Items`
    // })
    // outer.addEventListener('click', () => {
    //     productCategory.innerText = `Outer Items`
    // })
    // bottom.addEventListener('click', () => {
    //     productCategory.innerText = `Bottom Items`
    // })
    // dress.addEventListener('click', () => {
    //     productCategory.innerText = `Dress Items`
    // })
    // bag.addEventListener('click', () => {
    //     productCategory.innerText = `Bag Items`
    // })
    // shoes.addEventListener('click', () => {
    //     productCategory.innerText = `Shoes Items`
    // })
    // hat.addEventListener('click', () => {
    //     productCategory.innerText = `Hat Items`
    // })
    // acc.addEventListener('click', () => {
    //     productCategory.innerText = `Acc Items`
    // })
    // etc.addEventListener('click', () => {
    //     productCategory.innerText = `ETC Items`
    // })


/* pagination */











































// let data = axios.get('/api/category/best').then(console.log);

    // METHOD GET
    // path /api/best

    // response
    //     [{
    //         name
    //         species
    //         price
    //     }]
