import apiList from '../networkApi/apiList'

function getCateData(url,queryIfo) {
    // 记得return
    return apiList.get(url,queryIfo);
}

function getParentCateList(url , config) {
    return apiList.get(url , config);
}

function addCateData(url,config) {
    return apiList.post(url,config);
}

export {
    getCateData,
    getParentCateList,
    addCateData,
}