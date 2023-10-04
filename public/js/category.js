
const ul = document.querySelector('.best-products-slide');

(async () => {
    /*
        pathname /api/category/best
        querystring ?page=1&sort=like  - 인기순

    */
    const res = await axios.get('/api/category/best');
    //TODO: li 태그 여기다가 넣기!
    
})()

//axios -> fetch로 교체필요.