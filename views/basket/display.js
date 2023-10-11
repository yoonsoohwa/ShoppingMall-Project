/// /////////////////////////

//  localStorage에서 저장된 장바구니 항목을 불러옵니다.
function loadCart() {
  const parseBasket = JSON.parse(localStorage.getItem('basket')) || [];
}
