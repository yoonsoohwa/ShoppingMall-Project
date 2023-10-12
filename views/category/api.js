export const getProductList = async() => {
    try {
        const res = await fetch('/api/v1/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const dataList = await res.json();
        return dataList.map(data => ({
            img: `/dummy/${data.image.url}`,
            price: data.price,
            category: data.category,
            date: data.updatedAt,
            id: data._id,
            title: data.name,
        }))
    } catch (error) {
        console.log(error)
    }

}


export const getCategoryDataList = () => {
    return [
        {
            "name": "All",
            "__v": 0
        },
        {
            "name": "Top",
            "__v": 0
        },
        {
            "name": "Outer",
            "__v": 0
        },
        {
            "name": "Bottom",
            "__v": 0
        },
        {
            "name": "Dress",
            "__v": 0
        },
        {
            "name": "Bag",
            "__v": 0
        },
        {
            "name": "Shoes",
            "__v": 0
        },
        {
            "name": "Hat",
            "__v": 0
        },
        {
            "name": "Acc",
            "__v": 0
        },
        {
            "name": "Etc",
            "__v": 0
        }
    ]
}


/*
return [
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537044a9f5d7ac941331f"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537044a9f5d7ac941331f"},
        {id : 2, price : 20000, showedPrice : '20,000₩', title : 'navybag3', img : './imgtest/imgtest3.jpeg', date: '2023-09-02 12:21', category: "652537144a9f5d7ac9413322"},
        {id : 3, price : 40000, showedPrice : '40,000₩', title : 'navybag4', img : './imgtest/imgtest4.jpeg', date: '2023-09-01 12:21', category: "652537484a9f5d7ac9413327"},
        {id : 4, price : 90000, showedPrice : '90,000₩', title : 'navybag5', img : './imgtest/imgtest5.jpeg', date: '2023-09-09 17:21', category: "6525374e4a9f5d7ac9413329"},
        {id : 5, price : 60000, showedPrice : '60,000₩', title : 'navybag6', img : './imgtest/imgtest6.jpeg', date: '2023-09-09 11:21', category: "6525375e4a9f5d7ac941332d"},
        {id : 6, price : 45000, showedPrice : '45,000₩', title : 'navybag7', img : './imgtest/imgtest7.jpeg', date: '2023-09-12 10:21', category: "652537644a9f5d7ac941332f"},
        {id : 7, price : 80000, showedPrice : '80,000₩', title : 'navybag8', img : './imgtest/imgtest8.jpeg', date: '2023-09-08 12:21', category: "652537554a9f5d7ac941332b"},
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537144a9f5d7ac9413322"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537694a9f5d7ac9413331"},
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537044a9f5d7ac941331f"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537044a9f5d7ac941331f"},
        {id : 2, price : 20000, showedPrice : '20,000₩', title : 'navybag3', img : './imgtest/imgtest3.jpeg', date: '2023-09-02 12:21', category: "652537144a9f5d7ac9413322"},
        {id : 3, price : 40000, showedPrice : '40,000₩', title : 'navybag4', img : './imgtest/imgtest4.jpeg', date: '2023-09-01 12:21', category: "652537484a9f5d7ac9413327"},
        {id : 4, price : 90000, showedPrice : '90,000₩', title : 'navybag5', img : './imgtest/imgtest5.jpeg', date: '2023-09-09 17:21', category: "6525374e4a9f5d7ac9413329"},
        {id : 5, price : 60000, showedPrice : '60,000₩', title : 'navybag6', img : './imgtest/imgtest6.jpeg', date: '2023-09-09 11:21', category: "6525375e4a9f5d7ac941332d"},
        {id : 6, price : 45000, showedPrice : '45,000₩', title : 'navybag7', img : './imgtest/imgtest7.jpeg', date: '2023-09-12 10:21', category: "652537644a9f5d7ac941332f"},
        {id : 7, price : 80000, showedPrice : '80,000₩', title : 'navybag8', img : './imgtest/imgtest8.jpeg', date: '2023-09-08 12:21', category: "652537554a9f5d7ac941332b"},
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537144a9f5d7ac9413322"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537694a9f5d7ac9413331"},    
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537044a9f5d7ac941331f"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537044a9f5d7ac941331f"},
        {id : 2, price : 20000, showedPrice : '20,000₩', title : 'navybag3', img : './imgtest/imgtest3.jpeg', date: '2023-09-02 12:21', category: "652537144a9f5d7ac9413322"},
        {id : 3, price : 40000, showedPrice : '40,000₩', title : 'navybag4', img : './imgtest/imgtest4.jpeg', date: '2023-09-01 12:21', category: "652537484a9f5d7ac9413327"},
        {id : 4, price : 90000, showedPrice : '90,000₩', title : 'navybag5', img : './imgtest/imgtest5.jpeg', date: '2023-09-09 17:21', category: "6525374e4a9f5d7ac9413329"},
        {id : 5, price : 60000, showedPrice : '60,000₩', title : 'navybag6', img : './imgtest/imgtest6.jpeg', date: '2023-09-09 11:21', category: "6525375e4a9f5d7ac941332d"},
        {id : 6, price : 45000, showedPrice : '45,000₩', title : 'navybag7', img : './imgtest/imgtest7.jpeg', date: '2023-09-12 10:21', category: "652537644a9f5d7ac941332f"},
        {id : 7, price : 80000, showedPrice : '80,000₩', title : 'navybag8', img : './imgtest/imgtest8.jpeg', date: '2023-09-08 12:21', category: "652537554a9f5d7ac941332b"},
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537144a9f5d7ac9413322"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537694a9f5d7ac9413331"},    
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537044a9f5d7ac941331f"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537044a9f5d7ac941331f"},
        {id : 2, price : 20000, showedPrice : '20,000₩', title : 'navybag3', img : './imgtest/imgtest3.jpeg', date: '2023-09-02 12:21', category: "652537144a9f5d7ac9413322"},
        {id : 3, price : 40000, showedPrice : '40,000₩', title : 'navybag4', img : './imgtest/imgtest4.jpeg', date: '2023-09-01 12:21', category: "652537484a9f5d7ac9413327"},
        {id : 4, price : 90000, showedPrice : '90,000₩', title : 'navybag5', img : './imgtest/imgtest5.jpeg', date: '2023-09-09 17:21', category: "6525374e4a9f5d7ac9413329"},
        {id : 5, price : 60000, showedPrice : '60,000₩', title : 'navybag6', img : './imgtest/imgtest6.jpeg', date: '2023-09-09 11:21', category: "6525375e4a9f5d7ac941332d"},
        {id : 6, price : 45000, showedPrice : '45,000₩', title : 'navybag7', img : './imgtest/imgtest7.jpeg', date: '2023-09-12 10:21', category: "652537644a9f5d7ac941332f"},
        {id : 7, price : 80000, showedPrice : '80,000₩', title : 'navybag8', img : './imgtest/imgtest8.jpeg', date: '2023-09-08 12:21', category: "652537554a9f5d7ac941332b"},
        {id : 0, price : 30000, showedPrice : '30,000₩', title : 'navybag1', img : './imgtest/imgtest1.jpeg', date: '2023-09-09 13:21', category: "652537144a9f5d7ac9413322"},
        {id : 1, price : 20000, showedPrice : '20,000₩', title : 'navybag2', img : './imgtest/imgtest2.jpeg', date: '2023-09-09 15:21', category: "652537694a9f5d7ac9413331"},
    ]
*/