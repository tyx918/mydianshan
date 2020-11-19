import apiList from '../networkApi/apiList'

function getUserData(url,queryInfo) {
    console.log('uset中的打印数据');
    console.log(queryInfo);
    return apiList.get(url,queryInfo);
}

function putUserState(url,userinfo) {
    return apiList.put(url,userinfo);
}
//改进方法：应该让url变为传入的参数，而不是直接在这里写死
function putUserData(url,config) {
    return apiList.post(url,config);
}

function changeUserData(url) {
    return apiList.get(url);
}

function putChangeUserData(url,config) {
    return apiList.put(url,config)
}

function deleteUser(url) {
    return apiList.deleteMy(url);
}

function getAllUser(url) {
    return apiList.get(url);
}

function allotRole(url,config) {
    return apiList.put(url,config);
}

export {
    getUserData,
    putUserState,
    putUserData,
    changeUserData,
    putChangeUserData,
    deleteUser,
    getAllUser,
    allotRole,
}