import { xmlStringToDom, removeChildren } from './utils.js';

export class CategoryList {
  categoryItems;

  categoryListElement = null;

  _filterName = 'ALL';

  _onClick;

  constructor(categoryItems) {
    categoryItems.unshift({ name: 'ALL', _id: '' });
    this.categoryItems = categoryItems;
    const xmlString = `
        <ul class="all-categories">
        </ul>
        `;
    this.categoryListElement = xmlStringToDom(xmlString);
  }

  set filterName(name) {
    this._filterName = name;
    this.renderCategoryList();
  }

  get filterName() {
    return this._filterName;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get onClick() {
    return this._onClick;
  }

  renderCategoryList() {
    removeChildren(this.categoryListElement);
    this.categoryItems.forEach((category) => {
      const li =
        this.filterName === category.name
          ? xmlStringToDom(`<li class="category-item ${category.name}"><u>${category.name}</u></li>`)
          : xmlStringToDom(`<li class="category-item ${category.name}">${category.name}</li>`);

      li.addEventListener('click', (e) => {
        if (this.onClick) {
          this.filterName = category.name;
          this.onClick({ id: category._id, name: category.name });
        }
      });
      this.categoryListElement.append(li);
    });
  }

  render(parentNode) {
    parentNode.append(this.categoryListElement);
    this.renderCategoryList();
  }
}
