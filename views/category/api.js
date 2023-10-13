export const getProductList = async() => {
    try {
        const res = await fetch('/api/v1/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const dataList = await res.json();
        console.log(dataList)
        return dataList.map(data => ({
            img: `/dummy/${data.image.url}`,
            detailImage: `/dummy/${data.detail_image[0].url}`,
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