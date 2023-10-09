import { Pagination } from "./Pagination.js";
import { ProductCard } from "./ProductCard.js";
import { SortButtonList } from "./SortButtonList.js";
import { xmlStringToDom } from "./utils.js";

export class MainProductList {
    mainProductListElement = null;
    _filterName = 'All'
    pageOffset = 12;
    currentPage = 1;
    constructor(productItems) {
        this.productItems = productItems
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
        `
        this.mainProductListElement = xmlStringToDom(xmlString)
    }

    set filterName(name) {
        const filterNameElement = this.mainProductListElement.querySelector('.filter-name');
        this._filterName = name;
        filterNameElement.innerHTML = this._filterName;
    }

    get filterName() {
        return this._filterName
    }

    renderProductCardList() {
        const productsUl = this.mainProductListElement.querySelector('.products');
        productsUl.innerHTML = '' // 부모 초기화
        const slicedList = this.productItems.slice(this.pageOffset * (this.currentPage - 1), this.pageOffset * (this.currentPage - 1) + this.pageOffset)
        slicedList.forEach(productItem => {
            const productCard = new ProductCard({ ...productItem });
            productCard.render(productsUl)
        })
    }

    renderSortButtonList() {
        const sortButtonsList = new SortButtonList();
        const controller = this.mainProductListElement.querySelector('#standard-controller');

        controller.innerHTML = '' // 부모 초기화

        sortButtonsList.render(controller);

        sortButtonsList.onRecentClick = (e) => {
            this.productItems = this.productItems.sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                return bDate.getTime() - aDate.getTime();
            });
            this.renderProductCardList()
        }
        sortButtonsList.onMaxPriceClick = (e) => {
            this.productItems = this.productItems.sort((a, b) => {
                return b.price - a.price
            });
            this.renderProductCardList()
        }
        sortButtonsList.onMinPriceClick = (e) => {
            this.productItems = this.productItems.sort((a, b) => {
                return a.price - b.price
            });
            this.renderProductCardList()
        }
    }

    onPageChange(page) {
        this.currentPage = page;
        this.renderProductCardList();
    }

    renderPagination() {
        const paginationContainer = this.mainProductListElement.querySelector('.pagination-container');
        const pagination = new Pagination({
            pages: Math.ceil(this.productItems.length / this.pageOffset),
            currentPage: this.currentPage,
        });
        pagination.onChange = (page) => this.onPageChange(page);
        pagination.render(paginationContainer)
    }

    render(parentNode) {
        parentNode.append(this.mainProductListElement)
        this.renderProductCardList()
        this.renderSortButtonList()
        this.renderPagination()
    }
}