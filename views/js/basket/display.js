// 수량 늘리고 줄이는 코드

// export const eventListener = () => {
const countUpBtns = document.querySelectorAll("#count-up");
const countDownBtns = document.querySelectorAll("#count-down");
const inputElements = document.querySelectorAll("#p_num1");

countUpBtns.forEach((countUpBtn, index) => {
  countUpBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputElements[index].value);
    currentValue++;
    inputElements[index].value = currentValue;
  });
});
countDownBtns.forEach((countDownpBtn, index) => {
  countDownpBtn.addEventListener("click", () => {
    let currentValue = parseInt(inputElements[index].value);
    if (currentValue > 1) {
      currentValue--;
      inputElements[index].value = currentValue;
    }
  });
});
// };

// 체크박스

function selectAll(selectAll) {
  const checkboxes = document.getElementsByName("select-all");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  });
}

// 삭제 하기 버튼

let oneDelete = document.getElementById("one-delete");
let goodsData = document.getElementsByClassName("row data");

oneDelete.addEventListener("click", () => {
  for (let i = 0; i < goodsData.length; i++) {
    goodsData[i].style.display = "none";
  }
});

// 모달창

const modalOpenButton = document.getElementById("modal-open-button");
const modalCloseButton = document.getElementById("modal-close-button");
const modalAddButton = document.getElementById("modal-add-button");
const modalChangeButton = document.getElementById("modal-change-button");
const modal = document.getElementById("modal-container");

modalOpenButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

modalCloseButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 전체 삭제

let basketWrapper = document.getElementsByClassName("basket-wrapper");
let clearCart = document.getElementById("clear-cart");

clearCart.addEventListener("click", () => {
  while (basketWrapper.length > 0) {
    basketWrapper[0].remove();
  }
});

////////////////////////////

//  localStorage에서 저장된 장바구니 항목을 불러옵니다.
function loadCart() {
  const parseBasket = JSON.parse(localStorage.getItem("basket")) || [];
}
