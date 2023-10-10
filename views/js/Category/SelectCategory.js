import { xmlStringToDom, removeChildren } from './utils.js';


export class CategoryList {
    categoryItems;
    categoryListElement = null;
    _onClick;

    constructor(categoryItems) {
        this.categoryItems = categoryItems;
        const xmlString = `
        <ul>
            <li class="all-categories">${this.title}</li>
        </ul>
        `
        this.categoryListElement = xmlStringToDom(xmlString);
    }


    set onClick(fn) {
        this._onClick = fn
        this.categoryListElement.addEventListener((e) => {
            fn(e)
        })
    }
    
    get onClick(){
        return this._onClick;
    }

    renderCategoryList() {
        const categories = this.categoryListElement.querySelector('.all-categories');
        categories.innerHTML = '' // 초기화
        this.categoryItems.forEach(category => {
            const categoryCard = new CategoryList({...category});
            categoryCard.render(categories);
        })
    }

    render(parentNode){
        parentNode.append(this.categoryListElement);
    }
}
