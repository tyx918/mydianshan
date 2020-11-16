import apiList from '../networkApi/apiList'

export function getMenuList(url) {
    return apiList.get(url);
}