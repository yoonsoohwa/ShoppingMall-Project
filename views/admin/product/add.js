const categoryInput = document.querySelector('#category-input');
const nameInput = document.querySelector('#name-input');
const priceInput = document.querySelector('#price-input');
const imageInput = document.querySelector('#img-input');
const detailImageInput = document.querySelector('#detail-img-input');
const colorInput = document.querySelector('#color-input');
const sizeInput = document.querySelector('#size-input');
const contentInput = document.querySelector('#content-input');

const imagePreview = document.getElementById('image-preview');
const detailImagePreview = document.getElementById('detail-image-preview');
const delImgBtn = document.querySelector('.delete-img');
const delDetailImgBtn = document.querySelector('.delete-detimg');

/* 이미지 미리보기, 용량제한, 수정, 삭제 */

// 대표 이미지
let mainImage;
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  mainImage = file;

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '150px';
      imagePreview.innerHTML = ''; // 초기화
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
    delImgBtn.style.display = 'block';
  }
});

// 대표 이미지 삭제
delImgBtn.addEventListener('click', () => {
  imagePreview.innerHTML = '';
  imageInput.value = '';
  delImgBtn.style.display = 'none';
  mainImage = '';
});

// 상세 이미지
let detailImages = [];
const MaxImageSize = 5 * 1024 * 1024; // 최대 용량 5MB

detailImageInput.addEventListener('change', () => {
  const { files } = detailImageInput;
  addImagesToDetailImgs(files);
});

function addImagesToDetailImgs(files) {
  let totalSize = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileSize = file.size;

    // 용량 제한
    if (totalSize + fileSize <= MaxImageSize) {
      detailImages.push(file);
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '150px';

        // 체크박스 생성
        const deleteCheckbox = document.createElement('input');
        deleteCheckbox.type = 'checkbox';
        deleteCheckbox.className = 'position-absolute';
        deleteCheckbox.id = 'delete-check-btn';

        const parentDiv = document.createElement('div'); // img, checkbox의 부모div
        parentDiv.style.display = 'inline-block';
        parentDiv.appendChild(img);
        parentDiv.appendChild(deleteCheckbox);
        detailImagePreview.appendChild(parentDiv); // 미리보기에 img,checkbox 담기
      };
      reader.readAsDataURL(file);
      totalSize += fileSize;
      delDetailImgBtn.style.display = 'block';
    } else {
      alert('이미지 용량이 최대 용량을 초과했습니다.');
      detailImageInput.value = '';
    }
  }
}

// 부분 이미지 파일 삭제
delDetailImgBtn.addEventListener('click', () => {
  const checkedItems = document.querySelectorAll('#delete-check-btn');
  const delImages = Array.from(checkedItems)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => {
      const parentDiv = checkbox.parentNode;
      parentDiv.remove();
      return parentDiv.querySelector('img').src;
    });

  // detailImages 배열에서 삭제
  detailImages = detailImages.filter((image) => !delImages.includes(image));

  // detailImages가 없으면, 삭제버튼 안보이도록
  if (detailImages.length === 0) {
    delDetailImgBtn.style.display = 'none';
    detailImageInput.value = '';
  }
});

// -------------------------------------------------------
/* db에 생성한 정보 전달 (post) */

const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  // 필수 입력 필드 검사
  if (!categoryInput.value || !nameInput.value || !priceInput.value || !mainImage) {
    alert('카테고리, 이름, 가격, 대표 이미지는 필수 입력 필드입니다. 모든 필수 입력 필드를 작성하세요.');
    return;
  }

  const formData = new FormData();
  formData.append('category', categoryInput.value);
  formData.append('name', nameInput.value);
  formData.append('price', Number(priceInput.value));
  formData.append('image', mainImage);
  for (let i = 0; i < detailImages.length; i++) {
    formData.append('detail_image', detailImages[i]);
  }
  formData.append('option[color]', colorInput.value.replace(/\s/g, '').split(','));
  formData.append('option[size]', sizeInput.value.replace(/\s/g, '').split(','));
  formData.append('content', contentInput.value);

  const apiUrl = 'http://localhost:5001/api/v1/items';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    if (res.status === 201) {
      const result = await res.json();
      alert(result.message);
      window.location.href = '/order/product'; // 상품 목록 페이지로 이동
    } else {
      alert('생성 요청 실패:', res.status);
    }
  } catch (error) {
    alert('생성 요청 중 오류 발생:', error);
  }
}
