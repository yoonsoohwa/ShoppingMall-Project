import { xmlStringToDom } from "./utils.js";

export class Pagination {
    paginationElement = null;
    onChange;
    constructor({currentPage, pages}) {
        this.pages = pages;
        this._currentPage = currentPage;
        this.pageCount = 5;
        const xmlString = `
            <nav aria-label="Page navigation example" class="page-controller">
                <ul class="pagination">
                    <li class="page-item prev">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <div class="page-item-container">

                    </div>
                    <li class="page-item next">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `

        this.paginationElement = xmlStringToDom(xmlString);
    }

    set currentPage(page) {
        this._currentPage = page;
        this.onChange(page);
        this.renderPageItem()
    }

    get currentPage() {
        return this._currentPage;
    }

    getStartPage(page) {
        if(page % this.pageCount === 0) {
            return ((Math.floor(page / this.pageCount) - 1) * this.pageCount) + 1
        } else {
            return Math.floor(page / this.pageCount) * this.pageCount + 1
        }
    }

    renderPageItem() {
        const pageItemContainer = this.paginationElement.querySelector('.page-item-container');
        const pageItemButtonList = [];
        pageItemContainer.innerHTML = '';
        const startPage = this.getStartPage(this._currentPage);

        for(let i = startPage; i < startPage + this.pageCount; i++) {
            if(i > this.pages) {
                break;
            }
            const pageItemButton = xmlStringToDom(`<li class="page-item"><a onclick="return false" class="page-link ${i === this._currentPage ? 'active' : ''}" href="#">${i}</a></li>`);
            
            pageItemButton.addEventListener('click', (e) => {
                this.currentPage = i;
            })
            pageItemButtonList.push(pageItemButton);
        }
        pageItemContainer.append(...pageItemButtonList);
    }

    onNextButtonClick() {
        const nextButton = this.paginationElement.querySelector('.next');
        nextButton.addEventListener('click', () => {
            if(this._currentPage + this.pageCount > this.pages) {
                this.currentPage = this.pages;
                return;
            }
            this.currentPage = this.getStartPage(this._currentPage + this.pageCount)
        })
    }
    onPrevButtonClick() {
        const prevButton = this.paginationElement.querySelector('.prev');
        prevButton.addEventListener('click', () => {
            if(this._currentPage - this.pageCount < 1) {
                this.currentPage = 1;
                return;
            }
            this.currentPage = this.getStartPage(this._currentPage - this.pageCount) + this.pageCount - 1
        })
    }
    render(parentNode) {
        parentNode.append(this.paginationElement);
        this.renderPageItem()
        this.onNextButtonClick();
        this.onPrevButtonClick();
    }
}