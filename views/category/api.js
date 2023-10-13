// import { ProductCard } from "./ProductCard";

export const getProductList = async () => {
    try {
        const res = await fetch('/api/v1/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // document.querySelector('.product-card-image').src = img
        // document.querySelector('.detail-image').src = detailImage
        const dataList = await res.json();
        return dataList.map(data => ({
            
            // img: `/dummy/${data.image.url}`,
            // detailImage: `/dummy/${data.detail_image[0].url}`,
            img: data.image.url,
            detailImage: data.detail_image[0].url,
            price: data.price,
            category: data.category,
            date: data.updatedAt,
            id: data._id,
            title: data.name,
        }))
    } catch (error) {
        console.error(error)
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
            "name": "Bag",
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