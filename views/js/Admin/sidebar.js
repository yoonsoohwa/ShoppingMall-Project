/* 관리자페이지 사이드바 */
function loadSidebar() {
  const sidebar = `
      <div id="sidebar">
          <div class="logo">
              <h1>Logo</h1>
          </div>
          <div class="list">
              <ul>
                <div class="admin-product p-2 mt-3 mb-3">
                  <li class="main mb-2">💜상품</li>
                  <ul class="sub">
                    <li class="pb-2"><a href="./admin.html">- 상품 목록</a></li>
                    <li class="pb-2"><a href="./add.html">- 상품 등록</a></li>
                  </ul>
                </div>
                <div class="admin-order p-2">
                <li class="main mb-2">💜주문</li>
                  <ul class="sub">
                    <li class="pb-2"><a href="#">- 전체 주문조회</a></li>
                    <li class="pb-2"><a href="#">- 입금전 관리</a></li>
                    <li class="pb-2"><a href="#">- 배송 준비중 관리</a></li>
                    <li class="pb-2"><a href="#">- 배송중 관리</a></li>
                    <li class="pb-2"><a href="#">- 배송완료 조회</a></li>
                    <li class="pb-2"><a href="#">- 주문취소 관리</a></li>
                  </ul>
                </div>
              </ul>
          </div>
      </div>
  `;

  const sidebarContainer = document.getElementById('sidebar-container');
  sidebarContainer.insertAdjacentHTML('beforeend', sidebar);
}

loadSidebar();
