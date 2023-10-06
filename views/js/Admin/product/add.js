const categoryInput = document.querySelector('#category-input')
const nameInput = document.querySelector('#name-input')
const priceInput = document.querySelector('#price-input')
const imageInput = document.querySelector('#img-input')
const detailImageInput = document.querySelector('#detail-img-input')
const colorInput = document.querySelector('#color-input')
const sizeInput = document.querySelector('#size-input')
const contentInput = document.querySelector('#content-input')

const imagePreview = document.getElementById('image-preview');
const detailImagePreview = document.getElementById('detail-image-preview');
const delImgBtn = document.querySelector('.delete-img')
const delDetailImgBtn = document.querySelector('.delete-detimg')



/* !!! 이미지 호스팅 코드로 변경 필요 !!! */

/* 이미지 미리보기, 용량제한, 수정, 삭제 */

// 대표 이미지
let mainImage
imageInput.addEventListener('change', function (e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '150px';
      imagePreview.innerHTML = ''; // 이미지를 미리보기 전에 이전 이미지를 지웁니다.
      imagePreview.appendChild(img);
      // 이미지를 Base64로 인코딩
      const base64Image = e.target.result.split(',')[1];
      mainImage = base64Image
    };
    reader.readAsDataURL(file);
    delImgBtn.style.display = "block";
  } 
});

// 대표 이미지 삭제
delImgBtn.addEventListener('click', () => {
  imagePreview.innerHTML = '';
  imageInput.value = '';
  delImgBtn.style.display = "none";
  mainImage = ''
})



// 상세 이미지
let detailImages = []; // ex) ["첫번째 이미지 base64인코딩값", "두번째 이미지 base64인코딩값", ...]
const maxImageSize = 5 * 1024 * 1024  // 최대 용량 5MB


detailImageInput.addEventListener('change', function () {
  const files = detailImageInput.files;
  addImagesToDetailImgs(files);
});

function addImagesToDetailImgs(files) {
  let totalSize = 0
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      const fileSize = file.size
      // 용량 제한
      if (totalSize + fileSize <= maxImageSize) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '150px';

          // Base64로 이미지 인코딩
          const base64Image = e.target.result.split(',')[1];
          detailImages.push(base64Image);

          // 체크박스 생성
          const deleteCheckbox = document.createElement('input');
          deleteCheckbox.type = 'checkbox';
          deleteCheckbox.className = 'position-absolute';
          deleteCheckbox.id = 'delete-check-btn';

          const parentDiv = document.createElement('div'); // img, checkbox의 부모div
          parentDiv.style.display = 'inline-block'
          parentDiv.appendChild(img);
          parentDiv.appendChild(deleteCheckbox);
          detailImagePreview.appendChild(parentDiv); // 미리보기에 img,checkbox 담기
          delDetailImgBtn.style.display = "block";
        };
        reader.readAsDataURL(file);
        totalSize += fileSize;
      } else {
        alert('이미지 용량이 최대 용량을 초과했습니다.');
        detailImageInput.value = '';
      }
    }
  }
}


// 부분 이미지 파일 삭제
delDetailImgBtn.addEventListener('click', () => {
  const checkedItems = document.querySelectorAll('#delete-check-btn');
  let delImages = []; // 삭제된 이미지들
  
  checkedItems.forEach((checkbox) => {
    if (checkbox.checked) {
      const parentDiv = checkbox.parentNode;
      parentDiv.remove();

      // 체크된 이미지의 base64 인코딩값 추출
      const imgUrl = parentDiv.querySelector('img').src.split(',')[1];
      delImages.push(imgUrl)
    }
  });

  // detailImages 배열에서 삭제
  detailImages = detailImages.filter((image) => !delImages.includes(image));

  // detailImages가 없으면, 삭제버튼 안보이도록
  if (detailImages.length === 0) {
    delDetailImgBtn.style.display = 'none'; 
    detailImageInput.value = ''; 
  }
});



/* db에 생성한 정보 전달 (post)*/
const submitBtn = document.querySelector('.submit')
submitBtn.addEventListener('click', handleSubmit)

async function handleSubmit(e) {
  e.preventDefault()
  
  // 입력값 가져오기
  const category = categoryInput.value
  const image = mainImage
  const detail_image = detailImages
  const name = nameInput.value
  const price = priceInput.value
  const color = colorInput.value.replace(/\s/g, '').split(',')
  const size = sizeInput.value.replace(/\s/g, '').split(',')
  const content = contentInput.value
  
  // 필수 입력 필드 검사
  if (!category || !name || !price || !image) {
    alert('카테고리, 이름, 가격, 대표 이미지는 필수 입력 필드입니다. 모든 필수 입력 필드를 작성하세요.');
    return; 
  }

  const data = {
    category: category,
    image: image,
    detail_image: detail_image,
    name: name,
    price: Number(price),
    option: {
      color: color,
      size: size,
    },
    content: content,
  }
  
  const dataJson = JSON.stringify(data)
  
  const apiUrl = `` // url 추가

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: dataJson,
    }); 
    if (res.ok) {
      alert('상품 등록이 완료되었습니다!')
      // 상품목록 페이지(admin.html)로 이동 코드 추가
    } else {
      console.error('생성 요청 실패:', res.status);
    }
  } catch (error) {
    console.error('생성 요청 중 오류 발생:', error);
  }
}