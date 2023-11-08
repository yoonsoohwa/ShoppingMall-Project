import { xmlStringToDom } from './utils.js';

export class ProductCard {
  title = '';

  price = '';

  img = '';

  detail_image = '';

  date = '';

  productCardElement = null;

  _onClick;

  constructor({ title, price, img, detailImage, date }) {
    this.title = title;
    this.price = price;
    this.img = img;
    this.detailImage = detailImage;
    this.date = date;
    const xmlString = `
            <li class="product-card">
                <img class="detail-image" width="300" height="300" src="${this.detailImage}" alt="" />
                <img class="product-card-image" width="300" height="300" src="${this.img}" alt="" />
                <span class="main-product-name">${this.title}</span>
                <span class="main-product-price">${this.price.toLocaleString('ko-KR')}₩</span>
                <span class="main-product-date">${this.date}</span>
            </li>
        `;

    this.productCardElement = xmlStringToDom(xmlString);
  }

  set onClick(fn) {
    this._onClick = fn;
    this.productCardElement.addEventListener('click', (e) => {
      fn(e);
    });
  }

  get onClick() {
    return this._onClick;
  }

  render(parentNode) {
    parentNode.append(this.productCardElement);
  }
}
