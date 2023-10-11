import { Pagination } from './Pagination.js';
import { ProductCard } from './ProductCard.js';
import { SortButtonList } from './SortButtonList.js';
import { xmlStringToDom, removeChildren } from './utils.js';
import { CATEGORY } from './constants.js';

export class MainProductList {
  mainProductListElement = null;

  _filterName = 'ALL';

  pageOffset = 12;

  currentPage = 1;

  constructor(productItems) {
    this.productItems = productItems;
    const xmlString = `
            <div>
                <div class="product-filter-name">
                    <span class="filter-name">${this._filterName}</span> Items
                </div>
                <div id="standard-controller">
                </div>
                <ul class="products">
                </ul>
                <div class="pagination-container"></div>
            </div>
        `;
    this.mainProductListElement = xmlStringToDom(xmlString);
  }

  set filterName(name) {
    const filterNameElement = this.mainProductListElement.querySelector('.filter-name');
    this._filterName = name;
    filterNameElement.innerHTML = this._filterName;
    this.renderProductCardList();
    this.renderPagination();
  }

  get filterName() {
    return this._filterName;
  }

  renderProductCardList() {
    const productsUl = this.mainProductListElement.querySelector('.products');
    let filteredArray;
    removeChildren(productsUl); // 부모 초기화
    if (this.filterName === 'ALL') {
      filteredArray = this.productItems;
    } else {
      filteredArray = this.productItems.filter((productItem) => productItem.category === CATEGORY[this.filterName]);
    }

    const slicedList = filteredArray.slice(
      this.pageOffset * (this.currentPage - 1),
      this.pageOffset * (this.currentPage - 1) + this.pageOffset,
    );
    slicedList.forEach((productItem) => {
      const productCard = new ProductCard({ ...productItem });
      productCard.onClick = () => {
        sessionStorage.setItem('selectedProductId', productItem.id);
        window.location.href = '../Productpage/product.html';
      }; // 상품누르면 세션스토리지에 해당상품 id 주입. 상품디테일 페이지에 가져다가 상품찾아서 정보끌어와서 사용.
      productCard.render(productsUl);
    });
  }

  renderSortButtonList() {
    const sortButtonsList = new SortButtonList();
    const controller = this.mainProductListElement.querySelector('#standard-controller');

    controller.innerHTML = ''; // 부모 초기화

    sortButtonsList.render(controller);

    sortButtonsList.onRecentClick = (e) => {
      this.productItems = this.productItems.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate.getTime() - aDate.getTime();
      });
      this.renderProductCardList();
    };
    sortButtonsList.onMaxPriceClick = (e) => {
      this.productItems = this.productItems.sort((a, b) => b.price - a.price);
      this.renderProductCardList();
    };
    sortButtonsList.onMinPriceClick = (e) => {
      this.productItems = this.productItems.sort((a, b) => a.price - b.price);
      this.renderProductCardList();
    };
  }

  renderPagination() {
    const paginationContainer = this.mainProductListElement.querySelector('.pagination-container');
    removeChildren(paginationContainer);
    let filteredArray;
    if (this.filterName === 'ALL') {
      filteredArray = this.productItems;
    } else {
      filteredArray = this.productItems.filter((productItem) => productItem.category === CATEGORY[this.filterName]);
    }
    const pagination = new Pagination({
      pages: Math.ceil(filteredArray.length / this.pageOffset),
      currentPage: this.currentPage,
    });
    pagination.onChange = (page) => this.onPageChange(page);
    pagination.render(paginationContainer);
  }

  onPageChange(page) {
    this.currentPage = page;
    this.renderProductCardList();
  }

  render(parentNode) {
    parentNode.append(this.mainProductListElement);
    this.renderProductCardList();
    this.renderSortButtonList();
    this.renderPagination();
  }
}
