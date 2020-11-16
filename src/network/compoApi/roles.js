import apiList from '../networkApi/apiList'

function getRolesList(url) {
    return apiList.get(url)
}

function deleteRolesRight(url) {
    return apiList.deleteMy(url);
}

function getRolesData(url) {
    return apiList.get(url);
}



function authRoles(url,config) {
    return apiList.post(url,config);
}

export {
    getRolesList,deleteRolesRight,getRolesData,authRoles
}