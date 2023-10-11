import { MainProductList } from './MainProductList.js'; // 메인 프로덕트 렌더
import { BestProductList } from './BestProductList.js'; // 베스트 프로덕트 렌더
import { CategoryList } from './SelectCategory.js'; // 카테고리 리스트 렌더
import { getProductList, getBestProductList, getCategoryDataList } from './api.js'; //  각종 데이터 받기

const productsContainer = document.querySelector('.products-container');
const bestProductContainer = document.querySelector('.best-product-button-container');
const categoryContainer = document.querySelector('.categories-container');

const mainProductList = new MainProductList(getProductList());
const bestProductList = new BestProductList(getBestProductList());
const categoryList = new CategoryList(getCategoryDataList());
categoryList.onClick = ({ id, name }) => {
  mainProductList.filterName = name;
};

mainProductList.render(productsContainer); //  메인 프로덕트 리스트 프로덕트 컨테이너 렌더
bestProductList.render(bestProductContainer); //  베스트 프로덕트 리스트 베스트 프로덕트 컨테이너 렌더
categoryList.render(categoryContainer); //  카테고리 리스트 카테고리 컨테이너 렌더
