import axios from 'axios'


const ajax = axios.create({
    //baseURL:'http://127.0.0.1:8888/api/private/v1/',
    baseURL:'https://www.liulongbin.top:8888/api/private/v1/',
    timeout:8000,
})
// axios的拦截器:预处理请求
ajax.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    //1.显示图标
    return config;
},err => {
    console.log(err);
});
// //响应拦截
// axios.interceptors.response.use(res => {
//     return res.data
// },err => {
//     console.log(err);
// })
export default ajax



