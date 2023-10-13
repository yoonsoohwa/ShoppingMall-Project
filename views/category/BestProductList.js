import { xmlStringToDom } from './utils.js';
import { ProductCard } from './ProductCard.js';

export class BestProductList {
  productItems;

  bestProductListElement;

  x = 0;
  isTransition = false;

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
    // this.loopInterval = setInterval((e) => {
    //   this.next();
    // }, 3000);

    // // 슬라이드에 마우스가 올라간 경우 루프 멈추기
    // this.bestProductListElement.addEventListener("mouseover", () => {
    //   clearInterval(this.loopInterval);
    // });

    // // 슬라이드에서 마우스가 나온 경우 루프 재시작하기
    // this.bestProductListElement.addEventListener("mouseout", () => {
    //   this.loopInterval = setInterval((e) => {
    //     this.next();
    //   }, 3000);
    // });
  }

  onPrevButtonClick() {
    const prevButton = this.bestProductListElement.querySelector('.swiper-prev-controller');
    prevButton.addEventListener('click', (e) => {
      this.prev();
    });
  }

  prev() {
    const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
    const swipeRect = swipe.getBoundingClientRect();
    const containerRect = this.bestProductListElement.getBoundingClientRect();
    const width = swipeRect.width / this.productItems.length;
    const diff = swipeRect.width - containerRect.width;
    const viewCardCount = Math.ceil(containerRect.width / width);

   swipe.addEventListener('transitionend', () => {
      this.isTransition = false;
    })

    swipe.addEventListener('transitionrun', () => {
      this.isTransition = true;
    })

    if (this.x === 0) {
      for (let i = 0; i < this.productItems.length - (viewCardCount); i++) {
        const productItem = this.productItems.pop();
        this.productItems.unshift(productItem);
      }
      this.renderProductCardList()
      swipe.style.transition = '0s';
      this.x = -(this.productItems.length - viewCardCount);
      setTimeout(() => { 
        swipe.style.transition = '0.2s';
        this.x += 1;
        swipe.style.transform = `translateX(${this.x * width}px)`;
      })
    } else {
      swipe.style.transition = '0.2s';
      this.x += 1;
    }
    swipe.style.transform = `translateX(${this.x * width}px)`;
  }

  next() {
    const swipe = this.bestProductListElement.querySelector('.best-products-swipe');
    const swipeRect = swipe.getBoundingClientRect();
    const containerRect = this.bestProductListElement.getBoundingClientRect();
    const width = swipeRect.width / this.productItems.length;
    const diff = swipeRect.width - containerRect.width;
    const viewCardCount = Math.ceil(containerRect.width / width);

    swipe.addEventListener('transitionend', () => {
      this.isTransition = false;
      if (Math.abs((this.x - 1) * width) > diff) {
        swipe.style.transition = '0s';

        for (let i = 0; i < Math.abs(this.x); i++) {
          const productItem = this.productItems.shift();
          this.productItems.push(productItem)
        }
        this.x = 0;
    
        this.renderProductCardList()
        swipe.style.transform = `translateX(${this.x * width}px)`;
      }
    })

    swipe.addEventListener('transitionrun', () => {
      this.isTransition = true;
    })

    if (this.isTransition) return;
    this.x -= 1;

    swipe.style.transition = '0.2s';
    swipe.style.transform = `translateX(${this.x * width}px)`;
  }

  onNextButtonClick() {
    const nextButton = this.bestProductListElement.querySelector('.swiper-next-controller');
    nextButton.addEventListener('click', (e) => {
      this.next();
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
