import { xmlStringToDom } from './utils.js';
import { ProductCard } from './ProductCard.js';

export class BestProductList {
  productItems;

  bestProductListElement;

  x = 0;

  constructor(productItems) {
    this.productItems = productItems;
    const xmlString = `
        <div class="best-products-container">
            <button type="button">
                <img src="./swipericon/002-prev.png" alt="prev" class="swiper-prev-controller">
            </button>
            <div class="left-intersection"></div>
            <ul class="best-products-swipe">

            </ul>
            <div class="right-intersection"></div>
            <button type="button">
                <img src="./swipericon/001-next.png" alt="next" class="swiper-next-controller">
            </button>
        </div>
        `;

    this.bestProductListElement = xmlStringToDom(xmlString);
  }

  onPrevButtonClick() {
    const prevButton = this.bestProductListElement.querySelector('.swiper-prev-controller');
    const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
    prevButton.addEventListener('click', (e) => {
      const swipeRect = swipe.getBoundingClientRect();
      const containerRect = this.bestProductListElement.getBoundingClientRect();
      const width = swipeRect.width / this.productItems.length;
      const diff = swipeRect.width - containerRect.width;

      if (this.x === 0) {
        swipe.style.transform = `translateX(-${diff}px)`;
        this.x = -Math.round(diff / width);
      } else {
        this.x += 1;
        swipe.style.transform = `translateX(${this.x * width}px)`;
      }
    });
  }

  onNextButtonClick() {
    const nextButton = this.bestProductListElement.querySelector('.swiper-next-controller');
    const swipe = this.bestProductListElement.querySelector('.best-products-swipe');

    nextButton.addEventListener('click', (e) => {
      const swipeRect = swipe.getBoundingClientRect();
      const containerRect = this.bestProductListElement.getBoundingClientRect();
      const width = swipeRect.width / this.productItems.length;
      const diff = swipeRect.width - containerRect.width;

      this.x -= 1;
      swipe.style.transform = `translateX(${this.x * width}px)`;

      if (Math.abs(this.x * width) > diff) {
        this.x = 0;
        swipe.style.transform = `translateX(${this.x * width}px)`;
      }
    });
  }

  renderProductCardList() {
    const productsUl = this.bestProductListElement.querySelector('.best-products-swipe');
    productsUl.innerHTML = ''; // 초기화
    this.productItems.forEach((productItem) => {
      const productCard = new ProductCard({ ...productItem });
      productCard.onClick = () => {
        sessionStorage.setItem('selectedProductId', productItem.id);
        window.location.href = '/product';
      };
      productCard.render(productsUl);
    });
  }

  render(parentNode) {
    parentNode.append(this.bestProductListElement);
    this.renderProductCardList();
    this.onPrevButtonClick();
    this.onNextButtonClick();
  }
}
