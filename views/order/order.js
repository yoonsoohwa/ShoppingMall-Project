//페이지네이션//

// const items = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);
// const itemsPerPage = 4;
// let currentPage = 1;

// const paginationWrapContainer = document.querySelector('.pagination-wrap');

// const paginationWrapper = `
//    <nav aria-label="Page navigation example" class="page-controller">
//             <ul class="pagination justify-content-center">
//               <li class="page-item prev">
//               </li>
//               <div class="page-item-container"></div>
//               <li class="page-item next">
//               </li>
//             </ul>
//           </nav>`;
// paginationWrapContainer.innerHTML = paginationWrapper;

// function displayItems(page) {
//   const content = document.querySelector('.basket-wrapper'); // 상품 목록을 감싼 부모 요소 선택
//   content.innerHTML = '';

//   const start = (page - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const itemsToDisplay = items.slice(start, end);

//   itemsToDisplay.forEach((itemText) => {
//     const item = document.createElement('div');
//     item.className = 'row data';
//     item.id = 'row-item-data';
//     item.innerHTML = `
//         <!-- 첫번째 블록 -->
//         <div class="subdiv">
//           <div id="order-date-wrap">
//             <p id="order-date">주문일자</p>
//             <p id="order-id">[주문 번호]</p>
//           </div>

//           <div id="order-img">
//             <img src="#" width="100%" alt="상품 이미지" />
//           </div>
//           <div id="order-pname">${itemText}</div> <!-- 아이템 텍스트를 출력 -->
//         </div>
//         <!-- 두번째 블록 -->
//         <div class="subdiv">
//           <div id="order-num">수량</div>
//           <div id="order-price">상품 구매 금액</div>
//           <div id="order-status">주문 처리 상태</div>
//         </div>
//       `;

//     content.appendChild(item);
//   });
// }

// function changePage(offset) {
//   currentPage += offset;
//   if (currentPage < 1) {
//     currentPage = 1;
//   }
//   const pageCount = Math.ceil(items.length / itemsPerPage);
//   if (currentPage > pageCount) {
//     currentPage = pageCount;
//   }
//   displayItems(currentPage);
//   updatePagination();
// }

// function updatePagination() {
//   const pagination = document.querySelector('.page-item-container');
//   pagination.innerHTML = '';

//   const pageCount = Math.ceil(items.length / itemsPerPage);

//   // 이전 페이지 버튼
//   const prevButton = document.createElement('li');
//   prevButton.className = 'page-item prev';
//   prevButton.innerHTML = `
//       <a class="page-link" href="#" aria-label="Previous">
//         <span aria-hidden="true">&laquo;</span>
//       </a>
//     `;
//   prevButton.addEventListener('click', () => changePage(-1));
//   pagination.appendChild(prevButton);

//   for (let i = 1; i <= pageCount; i++) {
//     const listItem = document.createElement('li');
//     listItem.textContent = i;
//     listItem.className = 'page-item';
//     listItem.className = 'page-link';

//     listItem.addEventListener('click', () => {
//       currentPage = i;
//       displayItems(currentPage);
//       updatePagination();
//     });

//     if (i === currentPage) {
//       listItem.classList.add('active');
//     }

//     pagination.appendChild(listItem);
//   }

//   // 다음 페이지 버튼
//   const nextButton = document.createElement('li');
//   nextButton.className = 'page-item next';
//   nextButton.innerHTML = `
//       <a class="page-link" href="#" aria-label="Next">
//         <span aria-hidden="true">&raquo;</span>
//       </a>
//     `;
//   nextButton.addEventListener('click', () => changePage(1));
//   pagination.appendChild(nextButton);
// }

// displayItems(currentPage);
// updatePagination();

///////////////////

////////////////////////
