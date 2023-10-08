/* db에서 전체 목록 불러오기(get) */
async function insertProductData() {
  try {
    const res = await fetch(``);
    const data = await res.json();

    data.forEach((product) => {
      const row = document.createElement('tr');
      const tableBody = document.querySelector('#table-body');
      row.innerHTML += `
        <td><input class="form-check-input" type="checkbox" id="check-item"></td>
        <td id="product-id">${product.id}</td>
        <td id="product-category">${product.category}</td>
        <td id="product-image"><img src="${product.image}" class="img-fluid"></td>
        <td id="product-name">${product.name}</td>
        <td id="product-price">${product.price}</td>
        <td id="product-option">color: ${product.option.color}<br/>size: ${product.option.size}</td>
        <td id="product-modify"><button type="button" class="pro-modify btn btn-secondary btn-sm">수정</button></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
}
insertProductData();

/* 총 개수 */
const total = document.querySelector('.total');
const allRow = document.querySelectorAll('tr');
total.innerHTML = allRow.length > 1 ? `[총 ${allRow.length - 1}개]` : `[총 0개]`;

/* 상품 삭제 */
const checkAllBtn = document.querySelector('#check-all');
const checkboxes = document.querySelectorAll('#check-item');

checkAllBtn.addEventListener('change', () => {
  if (checkAllBtn.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
});

const deleteBtn = document.querySelector('.pro-delete');
deleteBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // 체크된 항목의 index를 저장할 배열
  const checkedItemsIndex = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedItemsIndex.push(index);
    }
  });

  // 확인 창 표시
  if (checkedItemsIndex.length > 0) {
    const confirmMessage = `체크된 항목 ${checkedItemsIndex.length}개를 삭제하시겠습니까?`;

    if (window.confirm(confirmMessage)) {
      // 확인
      checkedItemsIndex.forEach((index) => {
        const row = checkboxes[index].closest('tr'); // 체크된 체크박스의 부모 <tr> 요소 찾기
        if (row) {
          row.remove();
        }
      });
      checkAllBtn.checked = false;

      // 삭제된 항목의 id를 저장한 배열 => db로 id list(checkedItemsId) 전달
      const checkedItemsId = [];
      checkedItemsIndex.forEach((index) => {
        const row = checkboxes[index].closest('tr');
        if (row) {
          const productId = row.querySelector('#product-id').textContent;
          checkedItemsId.push(productId);
        }
      });
      // db에 삭제한 정보 전달 (delete)
      const apiUrl = ''; // url 추가
      const reqData = JSON.stringify({ items: checkedItemsId });

      try {
        const res = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: reqData,
        });

        if (res.ok) {
          console.log('삭제 요청이 성공적으로 처리되었습니다.');
        } else {
          console.error('삭제 요청 실패:', res.status);
        }
      } catch (error) {
        console.error('삭제 요청 중 오류 발생:', error);
      }
      insertProductData(); // 데이터 다시 불러오기
    } else {
      // 취소
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      checkAllBtn.checked = false;
    }
  } else {
    alert('삭제할 항목을 선택하세요.');
  }
});

/* 상품 수정 */

// 수정할 id값 추출
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('pro-modify')) {
    // 선택된 상품의 정보 가져오기
    const row = e.target.closest('tr');
    const productId = row.querySelector('#product-id').textContent;

    // 쿼리스트링 사용 > id 값이 일치하는 데이터 값을 modify.html로 불러옴
    // 데이터를 URL 매개변수로 인코딩하여 수정 페이지로 전달
    const modify = './modify.html'; // url 수정
    const queryParams = `?${productId}`;
    const modifyPageURL = `${modify}${queryParams}`;

    // 수정 페이지를 새 창으로 열어 이동
    // 새 창의 크기 조절
    const windowFeatures = 'width=1000,height=600';

    window.open(modifyPageURL, '_blank', windowFeatures);
  }
});
