import apiList from '../networkApi/apiList'

export function getLoginData(url,loginForm) {
    return apiList.post(url,loginForm);
}
