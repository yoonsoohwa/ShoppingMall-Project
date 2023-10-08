import { MainProductList } from "./MainProductList.js";
import { getProductList } from "./api.js";


const productsContainer = document.querySelector('.products-container');

const mainProductList = new MainProductList(getProductList())

mainProductList.render(productsContainer)

let bestItems = [
    {id : 0, price : 10000, showedPrice : '10,000₩', title : 'navybag3', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 13:21'},
    {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag4', img : './imgtest/imgtest3.jpeg', date: '2023-09-09 15:21'},
    {id : 2, price : 20000, showedPrice : '20,000₩', title : 'navybag5', img : './imgtest/imgtest4.jpeg', date: '2023-09-02 12:21'},
    {id : 3, price : 50000, showedPrice : '50,000₩', title : 'navybag6', img : './imgtest/imgtest5.jpeg', date: '2023-09-01 12:21'},
    {id : 4, price : 90000, showedPrice : '90,000₩', title : 'navybag8', img : './imgtest/imgtest8.jpeg', date: '2023-09-09 17:21'},
    {id : 5, price : 70000, showedPrice : '70,000₩', title : 'navybag7', img : './imgtest/imgtest7.jpeg', date: '2023-09-09 11:21'},
    {id : 6, price : 45000, showedPrice : '45,000₩', title : 'navybag2', img : './imgtest/imgtest6.jpeg', date: '2023-09-12 10:21'},
    {id : 7, price : 20000, showedPrice : '20,000₩', title : 'navybag1', img : './imgtest/imgtest5.jpeg', date: '2023-09-08 12:21'},
]

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