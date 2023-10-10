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

/* 카테고리 추가 */
const productCategories = ['All', 'Top', 'Bottom', 'Outer', 'Dress', 'Bag', 'Shoes', 'Hat', 'Acc', 'Etc'];
const accountCategories = ['My page', 'Order'];

function cateList(list, group, category) {
  for (let i = 0; i < list.length; i++) {
    const item = `<li><a class="dropdown-item" href="${category}/${list[i]}">${list[i]}</a></li>`;
    group.insertAdjacentHTML('beforeend', item);
  }
}
cateList(productCategories, pListGroup, 'Product');
cateList(accountCategories, aListGroup, 'Account');
