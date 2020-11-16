import apiList from '../networkApi/apiList'

function getRightsList(url) {
    return apiList.get(url)
}


export {
    getRightsList,
} 