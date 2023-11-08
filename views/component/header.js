function Header() {
  const headerText = `
    <nav id="header" class="navbar navbar-expand-sm d-flex justify-content-center">
      <div class="container-fluid">
        <a class="navbar-brand" href="/"><img src='https://ifh.cc/g/7vx729.png'></a>
        <div class="collapse navbar-collapse ms-4 justify-content-between" id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="product nav-item dropdown me-4">
              <a class="nav-link dropdown-toggle" href="/category" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Product
              </a>
              <ul class="dropdown-menu p-0"></ul>
            </li>
            <li class="account nav-item dropdown me-4">
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Account
              </a>
              <ul class="dropdown-menu p-0"></ul>
            </li>
            <li class="admin nav-item dropdown" style="display:none">
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Admin
              </a>
              <ul class="dropdown-menu p-0">
                <li><a class="dropdown-item" href="/admin/product">상품 관리</a></li>
                <li><a class="dropdown-item" href="/admin/order">주문 관리</a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav d-flex justify-content-end">
            <li><a><i class="bi bi-person me-2"></i></a></li>
            <li><a><i class="bi bi-bag me-2"></i></a></li>
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
const categoryList = ['All', 'Top', 'Outer', 'Bottom', 'Bag', 'Acc', 'Etc'];
for (let i = 0; i < categoryList.length; i++) {
  const item = `
        <li><a class="dropdown-item" href="/category?filter=${categoryList[i]}">${categoryList[i]}</a></li>
      `;
  pListGroup.insertAdjacentHTML('beforeend', item);
}

/* account 카테고리 추가 */
const accountText = `
  <li><a class="dropdown-item my">My page</a></li>
  <li><a class="dropdown-item order">Order</a></li>
`;
aListGroup.insertAdjacentHTML('beforeend', accountText);

const accMypage = document.querySelector('.my');
const accOrder = document.querySelector('.order');
const userIcon = document.querySelector('.bi-person');
const basketIcon = document.querySelector('.bi-bag');

// -------------------------------------------------------

/* user인지 확인 */
async function checkLogin() {
  try {
    const res = await fetch(`/api/v1/users/check-login`, {
      credentials: 'include',
    });
    const data = await res.json();
    const { isLoggedIn } = data;

    // 로그인 여부 클릭 이벤트
    if (isLoggedIn) {
      accMypage.addEventListener('click', () => {
        window.location.href = '/mypage';
      });
      accOrder.addEventListener('click', () => {
        window.location.href = '/order';
      });
      userIcon.addEventListener('click', () => {
        window.location.href = '/mypage';
      });
      basketIcon.addEventListener('click', () => {
        window.location.href = '/basket';
      });
      /* 관리자 계정으로 로그인 시, header에 Admin 생성 */
      if (sessionStorage.getItem('role') === 'admin') {
        document.querySelector('.admin').style.display = 'block';
      }
    } else {
      accMypage.addEventListener('click', () => {
        alert('로그인이 필요한 페이지입니다!');
        window.location.href = '/login';
      });
      accOrder.addEventListener('click', () => {
        if (confirm('비회원으로 주문조회 하시겠습니까?')) {
          window.location.href = '/login/unuser';
        }
      });
      userIcon.addEventListener('click', () => {
        window.location.href = '/login';
      });
      basketIcon.addEventListener('click', () => {
        alert('로그인이 필요한 페이지입니다!');
        window.location.href = '/login';
      });
    }
  } catch (error) {
    alert('데이터를 가져오는 중 에러 발생:', error);
  }
}
checkLogin();
