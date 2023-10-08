// 현재 URL에서 쿼리스트링 가져오기
const queryString = window.location.search;
const queryId = queryString.split('?')[1];

const id = document.getElementById('pro-id');
id.innerHTML = queryId;
const mCategory = document.getElementById('m-category-input');
const mImage = document.getElementById('m-img-input');
const mDetailImage = document.getElementById('m-detail-img-input');
const mName = document.getElementById('m-name-input');
const mPrice = document.getElementById('m-price-input');
const mColor = document.getElementById('m-color-input');
const mSize = document.getElementById('m-size-input');
const mContent = document.getElementById('m-content-input');

const imagePreview = document.getElementById('image-preview');
const detailImagePreview = document.getElementById('detail-image-preview');
const delDetailImgBtn = document.querySelector('.delete-detimg');

// db에서 id값과 일치하는 데이터 불러오기 (get)
async function getProductData(id) {
  try {
    const res = await fetch(``);
    const data = await res.json();

    // 상품목록에서 받아온 데이터를 default 값으로 두고 수정
    mCategory.value = data.category;
    imagePreview.innerHTML = `<img src="${data.image}" style="max-width: 150px">`;
    data.detail_image.forEach((val) => {
      detailImagePreview.innerHTML += `
        <div style="display: inline-block">
          <img src="${val}" style="max-width: 150px">
          <input type="checkbox" class="position-absolute" id="delete-check-btn">
        </div>
      `;
    });
    mName.placeholder = data.name;
    mPrice.placeholder = data.price;
    mColor.placeholder = data.option.color.join(', ');
    mSize.placeholder = data.option.color.join(', ');
    mContent.placeholder = data.content;
  } catch (error) {
    alert('데이터를 가져오는 중 에러 발생:', error);
  }
}

getProductData(queryId);

/* 이미지 미리보기, 용량제한, 수정, 삭제 */

// 대표 이미지
let mainImage = imagePreview.img.src;
mImage.addEventListener('change', (e) => {
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
  } else {
    imagePreview.innerHTML = '';
  }
});

// 상세 이미지
let detailImages = [];
const MaxImageSize = 5 * 1024 * 1024; // 최대 용량 5MB

// detailImages의 기본값 (get으로 받아온 데이터)
const imageDivs = document.querySelectorAll('div[style="display: inline-block"]');

// 각 이미지 요소의 img 태그에서 src를 추출하여 detailImages 배열에 추가합니다.
imageDivs.forEach((div) => {
  const img = div.querySelector('img');
  detailImages.push(img.src);
});

mDetailImage.addEventListener('change', () => {
  const { files } = mDetailImage;
  addImagesToDetailImgs(files);
});

function addImagesToDetailImgs(files) {
  detailImages = []; // 배열 초기화
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
      mDetailImage.value = '';
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

  // detailImages 없으면, 삭제버튼 안보이도록
  if (detailImages.length === 0) {
    delDetailImgBtn.style.display = 'none';
    mDetailImage.value = '';
  }
});

/* db에 수정한 정보 전달 (put) */
const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  // 필수 입력 필드 검사
  if (!mCategory.value || !mName.value || !mPrice.value || !mainImage) {
    alert('카테고리, 이름, 가격, 대표 이미지는 필수 입력 필드입니다. 모든 필수 입력 필드를 작성하세요.');
    return;
  }

  const formData = new FormData();
  formData.append('category', mCategory.value);
  formData.append('name', mName.value);
  formData.append('price', Number(mPrice.value));
  formData.append('image', mainImage);
  for (let i = 0; i < detailImages.length; i++) {
    formData.append('detailImages', detailImages[i]);
  }
  formData.append('option[color]', mColor.value.replace(/\s/g, '').split(','));
  formData.append('option[size]', mSize.value.replace(/\s/g, '').split(','));
  formData.append('content', mContent.value);

  const apiUrl = ``; // url 추가
  try {
    const res = await fetch(apiUrl, {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) {
      alert('상품 수정이 완료되었습니다!');
      // 상품목록 페이지(admin.html)로 이동 코드 추가
    } else {
      alert('수정 요청 실패:', res.status);
    }
  } catch (error) {
    alert('수정 요청 중 오류 발생:', error);
  }
}
