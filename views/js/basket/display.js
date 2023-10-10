// 체크박스

function selectAll(selectAll) {
  const checkboxes = document.getElementsByName('select-all');

  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  });
}

// // 삭제 하기 버튼

// const oneDelete = document.getElementById('one-delete');
// const goodsData = document.getElementsByClassName('row data');

// oneDelete.addEventListener('click', () => {
//   for (let i = 0; i < goodsData.length; i++) {
//     goodsData[i].style.display = 'none';
//   }
// });

// 모달창

// const modalOpenButtons = document.querySelectorAll('#modal-open-button');
// const modalCloseButtons = document.querySelectorAll('#modal-close-button');
// const modalAddButton = document.querySelectorAll('#modal-add-button');
// const modalChangeButtons = document.querySelectorAll('#modal-change-button');
// const modal = document.querySelector('#modal-container');

// console.log('modalOpenButtons', modalOpenButtons);

// modalOpenButtons.forEach((modalOpen) => {
//   modalOpen.addEventListener('click', () => {
//     modal.classList.remove('hidden');
//   });
// });

// modalCloseButtons.forEach((modalClose) => {
//   modalClose.addEventListener('click', () => {
//     modal.classList.add('hidden');
//   });
// });

// 선택 구매

function goBuy() {
  const checkedCnt = document.querySelectorAll('.chk:Checked').length;
  if (checkedCnt == 0) {
    alert('선택한 상품이 없습니다.');
    return;
  }
}

/// /////////////////////////

//  localStorage에서 저장된 장바구니 항목을 불러옵니다.
function loadCart() {
  const parseBasket = JSON.parse(localStorage.getItem('basket')) || [];
}
