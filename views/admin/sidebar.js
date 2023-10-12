/* 관리자페이지 사이드바 */
function loadSidebar() {
  const sidebar = `
      <div id="sidebar">
          <div class="logo text-center pt-4">
              <img src='https://ifh.cc/g/7vx729.png' class="w-75">
          </div>
          <div class="list">
              <ul>
                <div class="admin-product p-2 mt-3 mb-3">
                  <li class="main mb-2">💜상품</li>
                  <ul class="sub">
                    <li class="pb-2"><a href="/admin/product">- 상품 목록</a></li>
                    <li class="pb-2"><a href="/admin/product/add">- 상품 등록</a></li>
                  </ul>
                </div>
                <div class="admin-order p-2">
                <li class="main mb-2">💜주문</li>
                  <ul class="sub">
                    <li class="pb-2"><a href="/order/order.html">- 전체 주문조회</a></li>
                    <li class="pb-2"><a href="/order/pre-shipping.html">- 배송 준비중 관리</a></li>
                    <li class="pb-2"><a href="/order/shipping.html">- 배송중 관리</a></li>
                    <li class="pb-2"><a href="/order/delivered.html">- 배송완료 조회</a></li>
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
