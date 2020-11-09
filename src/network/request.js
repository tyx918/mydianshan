import axios from 'axios'


export function request(config) {
    //声明一个实例
    const instance = axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1/',
        timeout:5000,
    })
    // // axios的拦截器
    // axios.interceptors.request.use(config => {
    //     console.log(config.data);
    //     //1.显示图标
    //     return config;
    // },err => {
    //     console.log(err);
    // });

    // //响应拦截
    // axios.interceptors.response.use(res => {
    //     return res.data
    // },err => {
    //     console.log(err);
    // })
    //发送网络请求
    return instance(config)
}



