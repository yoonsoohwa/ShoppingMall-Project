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
            <li><a><i class="bi bi-person me-2"></i></a></li>
            <li><a href="/views/pages/Basketpage/basket.html"><i class="bi bi-bag me-2"></i></a></li>
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

/* product 카테고리 추가 -> 리스트로 받아오기 코드 추가 예정 */
const productCategories = ['All', 'Top', 'Bottom', 'Outer', 'Dress', 'Bag', 'Shoes', 'Hat', 'Acc', 'Etc'];
for (let i = 0; i < productCategories.length; i++) {
  const item = `
    <li><a class="dropdown-item" href="Product/${productCategories[i]}">${productCategories[i]}</a></li>
  `;
  pListGroup.insertAdjacentHTML('beforeend', item);
}

/* account 카테고리 추가 */
const accountText = `
  <li><a class="dropdown-item my">My page</a></li>
  <li><a class="dropdown-item order">Order</a></li>
`;
aListGroup.insertAdjacentHTML('beforeend', accountText);

/* mypage => login, orderpage => 비회원 login */
const accMypage = document.querySelector('.my');
const accOrder = document.querySelector('.order');
const userIcon = document.querySelector('bi-person');

/* user인지 확인 */
async function checkLogin() {
  try {
    const res = await fetch('http://localhost:5001/api/v1/users//check-login');
    const data = await res.json();
    const { isLoggedIn } = data.isLoggedIn;

    // 로그인 여부 클릭 이벤트
    if (isLoggedIn) {
      accMypage.addEventListener('click', () => {
        window.location.href = '/views/pages/Loginpage/mypage.html';
      });
      accOrder.addEventListener('click', () => {
        window.location.href = '/views/pages/Orderpage/order.html';
      });
      userIcon.addEventListener('click', () => {
        window.location.href = '/views/pages/Loginpage/mypage.html';
      });
    } else {
      accMypage.addEventListener('click', () => {
        window.location.href = '/views/pages/Loginpage/login.html';
      });
      accOrder.addEventListener('click', () => {
        if (confirm('비회원으로 주문조회 하시겠습니까?')) {
          window.location.href = '/views/pages/Loginpage/unuser.html';
        }
      });
      userIcon.addEventListener('click', () => {
        window.location.href = '/views/pages/Loginpage/login.html';
      });
    }
  } catch (error) {
    // alert('데이터를 가져오는 중 에러 발생:', error);
  }
}
checkLogin();