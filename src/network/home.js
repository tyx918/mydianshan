import apiList from './apiList'

export function getMenuList() {
    return apiList.get('/menus');
}