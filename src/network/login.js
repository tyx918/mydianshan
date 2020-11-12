import apiList from './apiList'

export function getLoginData(loginForm) {
    return apiList.post('/login',loginForm);
}
