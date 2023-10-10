function Header() {
  const headerText = `
    <nav id="header" class="navbar navbar-expand-sm d-flex justify-content-center">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html"><img src='https://ifh.cc/g/7vx729.png'></a>
        <div class="collapse navbar-collapse ms-4 justify-content-between" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="product nav-item dropdown me-4">
              <a class="nav-link dropdown-toggle" href="category.html" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Product
              </a>
              <ul class="dropdown-menu p-0"></ul>
            </li>
            <li class="account nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="account.html" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Account
              </a>
              <ul class="dropdown-menu p-0"></ul>
            </li>
          </ul>
          <ul class="navbar-nav d-flex justify-content-end">
            <li><a href="login.html"><i class="bi bi-person me-2"></i></a></li>
            <li><a href="basket.html"><i class="bi bi-bag me-2"></i></a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  const header = document.querySelector('#header-container');
  header.insertAdjacentHTML('beforeend', headerText);
}
Header();

const pListGroup = document.querySelector('.product .dropdown-menu');
const aListGroup = document.querySelector('.account .dropdown-menu');

/* product 카테고리 추가 */
const productCategories = ['All', 'Top', 'Bottom', 'Outer', 'Dress', 'Bag', 'Shoes', 'Hat', 'Acc', 'Etc'];
for (let i = 0; i < productCategories.length; i++) {
  const item = `
    <li><a class="dropdown-item" href="Product/${productCategories[i]}">${productCategories[i]}</a></li>
  `;
  pListGroup.insertAdjacentHTML('beforeend', item);
}

/* account 카테고리 추가 */
const mainPage = `<li><a class="dropdown-item my">My page</a></li>`;
const orderPage = `<li><a class="dropdown-item order">Order</a></li>`;

aListGroup.insertAdjacentHTML('beforeend', mainPage);
aListGroup.insertAdjacentHTML('beforeend', orderPage);

/* mypage => login, orderpage => 비회원 login */
const isRegistered = false; // login 확인

const accMypage = document.querySelector('.my');
const accOrder = document.querySelector('.order');

accMypage.addEventListener('click', () => {
  window.location.href = 'login';
});
accOrder.addEventListener('click', () => {
  if (confirm('비회원으로 주문조회 하시겠습니까?')) {
    window.location.href = '/views/pages/Loginpage/unuser.html';
  }
});

/* user인지 확인 */

// 쿠키에서 accessToken 값을 가져오기
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  // 쿠키 값을 찾은 경우 쿠키 값 추출
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const accessToken = getCookie('accessToken');

// accessToken이 존재하는지 확인
if (accessToken) {
  console.log('accessToken이 쿠키에 저장되어 있습니다:', accessToken);
  const loginIcon = document.querySelector('.bi-person');
  loginIcon.style.display = 'none';
} else {
  console.log('accessToken이 쿠키에 저장되어 있지 않습니다.');
}
