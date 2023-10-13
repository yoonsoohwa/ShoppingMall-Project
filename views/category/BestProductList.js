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
    
    // 스와이퍼 자동 넘기기
    this.loopInterval = setInterval((e) => {
      const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
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
    }, 3000);

    // 슬라이드에 마우스가 올라간 경우 루프 멈추기
    this.bestProductListElement.addEventListener("mouseover", () => {
      clearInterval(this.loopInterval);
    });

    // 슬라이드에서 마우스가 나온 경우 루프 재시작하기
    this.bestProductListElement.addEventListener("mouseout", () => {
      this.loopInterval = setInterval((e) => {
        const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
        const swipeRect = swipe.getBoundingClientRect();
        const containerRect = this.bestProductListElement.getBoundingClientRect();
        const width = swipeRect.width / this.productItems.length;
        const diff = swipeRect.width - containerRect.width;

        this.x -= 1;
        swipe.style.transform = `translateX(${this.x * width}px)`;

     if (Math.abs(this.x * width) > diff) {
        for (let i = 0; i < viewCardCount - 1; i++) {
          const productItem = this.productItems.pop();
          this.productItems.unshift(productItem)
          swipe.style.transition = '0s';
        }
          this.x = 0;
          swipe.style.transform = `translateX(${this.x * width}px)`;
          this.renderProductCardList()
      }
      }, 3000);
    });
  }

  onPrevButtonClick() {
    const prevButton = this.bestProductListElement.querySelector('.swiper-prev-controller');
    const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
    
    prevButton.addEventListener('click', (e) => {
      const swipeRect = swipe.getBoundingClientRect();
      const containerRect = this.bestProductListElement.getBoundingClientRect();
      const width = swipeRect.width / this.productItems.length;
      const diff = swipeRect.width - containerRect.width;
      const viewCardCount = Math.ceil(containerRect.width / width);

      if (this.x === 0) {
        swipe.style.transform = `translateX(-${diff}px)`;
        this.x = -Math.round(diff / width);
      } else {
        this.x += 1;
        swipe.style.transform = `translateX(${this.x * width}px)`;
      }

      // if (Math.abs(this.x * width) > diff) {
      //   for (let i = 0; i < viewCardCount - 1; i++) {
      //     const productItem = this.productItems.splice(0,1)
      //     this.productItems.push(productItem[0])
      //     swipe.style.transition = '0s';
      //   }
      //   this.x = 0;
      //   swipe.style.transform = `translateX(${this.x * width}px)`;
      //   this.renderProductCardList()
      // }
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
      const viewCardCount = Math.ceil(containerRect.width / width);

      this.x -= 1;

      swipe.style.transition = '0.2s';
      swipe.style.transform = `translateX(${this.x * width}px)`;
      
      if (Math.abs(this.x * width) > diff) {
        for (let i = 0; i < viewCardCount - 1; i++) {
          const productItem = this.productItems.pop();
          this.productItems.unshift(productItem)
          swipe.style.transition = '0s';
        }
          this.x = 0;
          swipe.style.transform = `translateX(${this.x * width}px)`;
          this.renderProductCardList()
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
