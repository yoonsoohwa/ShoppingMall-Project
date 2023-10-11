import { xmlStringToDom } from './utils.js';

export class SortButtonList {
  sortButtonListElement = null;

  _onRecentClick;

  _onMinPriceClick;

  _onMaxPriceClick;

  constructor() {
    const xmlString = `
            <ul class="sort-button-container">
                <li><button type="button" class="recent">상품 등록순</button></li>
                <li><button type="button" class="min-price">낮은 가격순</button></li>
                <li><button type="button" class="max-price">높은 가격순</button></li>
            </ul>
        `;

    this.sortButtonListElement = xmlStringToDom(xmlString);
  }

  set onRecentClick(fn) {
    this._onRecentClick = fn;
    const button = this.sortButtonListElement.querySelector('.recent');
    button.addEventListener('click', (e) => {
      fn(e);
    });
  }

  set onMaxPriceClick(fn) {
    this._onMaxPriceClick = fn;
    const button = this.sortButtonListElement.querySelector('.max-price');
    button.addEventListener('click', (e) => {
      fn(e);
    });
  }

  set onMinPriceClick(fn) {
    this._onMinPriceClick = fn;
    const button = this.sortButtonListElement.querySelector('.min-price');
    button.addEventListener('click', (e) => {
      fn(e);
    });
  }

  render(parentNode) {
    parentNode.append(this.sortButtonListElement);
  }
}
