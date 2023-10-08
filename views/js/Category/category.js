import { MainProductList } from "./MainProductList.js";
import { BestProductList } from "./BestProductList.js";
import { getProductList, getBestProductList } from "./api.js";


const productsContainer = document.querySelector('.products-container');
const bestProductContainer = document.querySelector('.best-product-button-container');
const mainProductList = new MainProductList(getProductList())
const bestProductList = new BestProductList(getBestProductList())

mainProductList.render(productsContainer);
bestProductList.render(bestProductContainer);


/* 카테고리 데이터 */
let categoryDataList = [{
    name: 'all',
    title: 'All',
    checked: true,
}, {
    name: 'top',
    title: 'Top',
    checked: false,
}, {
    name: 'outer',
    title: 'Outer',
    checked: false,
}, {
    name: 'bottom',
    title: 'Bottom',
    checked: false,
}, {
    name: 'dress',
    title: 'Dress',
    checked: false,
}, {
    name: 'bag',
    title: 'Bag',
    checked: false,
}, {
    name: 'shoes',
    title: 'Shoes',
    checked: false,
}, {
    name: 'hat',
    title: 'Hat',
    checked: false,
}, {
    name: 'acc',
    title: 'Acc',
    checked: false,
}, {
    name: 'etc',
    title: 'Etc',
    checked: false,
}]