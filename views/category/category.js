import { MainProductList } from './MainProductList.js'; // 메인 프로덕트 렌더
import { BestProductList } from './BestProductList.js'; // 베스트 프로덕트 렌더
import { CategoryList } from './SelectCategory.js'; // 카테고리 리스트 렌더
import { getProductList, getCategoryDataList } from './api.js'; //  각종 데이터 받기

(async () => {
  const categoryData = getCategoryDataList();
  let filter = '';
  for (let category of categoryData) {  
    if (window.location.href.split('?filter=')[1] === category.name) {
      filter = category.name;
    }
  }
  console.log(filter)
const productsContainer = document.querySelector('.products-container');
const bestProductContainer = document.querySelector('.best-product-button-container');
const categoryContainer = document.querySelector('.categories-container');


  // 카테고리 선택시 마다 스와이퍼에 각각의 카테고리 12개 띄우기
const productList = await getProductList();
const recentProductList = [...productList].sort((a, b) => {
  const aDate = new Date(a.date);
  const bDate = new Date(b.date);
  return bDate.getTime() - aDate.getTime();
}).slice(0, 12); // 0 ~ 11
  
const mainProductList = [...productList].sort((a, b) => {
  const aDate = new Date(a.date);
  const bDate = new Date(b.date);
  return bDate.getTime() - aDate.getTime();
}).slice(12, productList.length);  // 12 ~ length
  
  
const mainProductListComponent = new MainProductList(mainProductList);

const bestProductListComponent = new BestProductList(recentProductList);
const categoryList = new CategoryList(categoryData);
  mainProductListComponent.filterName = filter;
  categoryList.filterName = filter;
  categoryList.onClick = ({ id, name }) => {
  mainProductListComponent.filterName = name;
};

mainProductListComponent.render(productsContainer); //  메인 프로덕트 리스트 프로덕트 컨테이너 렌더
bestProductListComponent.render(bestProductContainer); //  베스트 프로덕트 리스트 베스트 프로덕트 컨테이너 렌더
categoryList.render(categoryContainer); //  카테고리 리스트 카테고리 컨테이너 렌더

})()