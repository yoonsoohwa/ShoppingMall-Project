const productImage = document.getElementById('product-image');
const colorSelector = document.getElementById('color-selector');
const sizeSelector = document.getElementById('size-selector');
const selectedList = document.getElementById('selected-list');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');

let optionNum = 0;

function setImage(image, detailImage) {
    detailImage.unshift(image);

    for (let i = 0; i < detailImage.length; i += 1) {
        const imageEl = document.createElement('img');
        imageEl.setAttribute('src', detailImage[i]);
        productImage.appendChild(imageEl);
    }
}

function setInfo(name, price, content) {
    productName.innerText = name;
    productPrice.innerText = `${price}원`;
    productDescription.innerText = content;
}

function setOption(option) {
    const { color, size } = option;

    const colorEl = `<option value="${color}">${color}</option>`;
    const sizeEl = `<option value="${size}">${size}</option>`;

    colorSelector.insertAdjacentHTML('beforeend', colorEl);
    sizeSelector.insertAdjacentHTML('beforeend', sizeEl);
}

function insertProductElement() {
    fetch('../../js/product/data.json')
        .then((res) => res.json())
        .then(data => {
            const { name, option, image, detail_image: detailImage, content, price } = data;

            setInfo(name, price, content);
            setImage(image, detailImage);
            setOption(option);
        });
}

function selectOption() {
    const color = colorSelector.options[colorSelector.selectedIndex].value;
    const size = sizeSelector.options[sizeSelector.selectedIndex].value;
    
    const selectedOptions = document.querySelectorAll('td.product > span');

    if (size === "none") {
        return;
    }

    for (let i = 0; i < selectedOptions.length; i += 1) {
        if (selectedOptions[i].innerText === `${color} / ${size}`) {
            // eslint-disable-next-line no-alert
            alert('아래 리스트에서 이미 선택된 옵션을 삭제 후 다시 선택해 주세요.');
            return;
        }
    }

    optionNum += 1;

    const element = `<tr data-option-index=${optionNum}>
    <td class="product">
        <p>${productName}</p>
         - 
        <span>${color} / ${size}</span>
    </td>
    <td class="text-center">
        <a href="#" id="decrease-quantity-${optionNum}"><i class="bi bi-dash-square"></i></a>
        <span id="quantity-${optionNum}">1</span>
        <a href="#" id="increase-quantity-${optionNum}"><i class="bi bi-plus-square"></i></a>
    </td>
    <td class="text-end">${productPrice}
        <a href="#"
          ><i id="product-delete-${optionNum}" class="bi bi-x-square-fill"></i></a>
        <!-- <i class="bi bi-x-circle-fill"></i> -->
    </td>
  </tr>`

    selectedList.insertAdjacentHTML('beforeend', element);

    const quantityEl = document.getElementById(`quantity-${optionNum}`);

    document.getElementById(`increase-quantity-${optionNum}`).addEventListener('click', (e) => {
        e.preventDefault();
        quantityEl.innerText = Number(quantityEl.innerHTML) + 1;
    });

    document.getElementById(`decrease-quantity-${optionNum}`).addEventListener('click', (e) => {
        e.preventDefault();
        if (Number(quantityEl.innerHTML) <= 1) {
            return;
        }
        quantityEl.innerText = Number(quantityEl.innerHTML) - 1;
    });

    document.getElementById(`product-delete-${optionNum}`).addEventListener('click', (e) => {
        e.preventDefault();
        const greatGrandParent = e.currentTarget.parentNode.parentNode.parentNode;
        greatGrandParent.remove();
    });
}

function isColorSelected() {
    const color = colorSelector.options[colorSelector.selectedIndex].value;
    const options = document.querySelectorAll('#size-selector > option');

    if (color === "none") {
        for (let i = 2; i < options.length; i += 1) {
            options[i].style.display = "none";
        }
    } else {
        for (let i = 2; i < options.length; i += 1) {
            options[i].style.display = "block";
        }
    }
}

insertProductElement();
sizeSelector.addEventListener('focus', isColorSelected);
sizeSelector.addEventListener('change', selectOption);