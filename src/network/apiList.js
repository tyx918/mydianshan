import ajax from './ajax'

/*发送get请求,参数形式：
*  1.params的形式
*  2.url后面直接拼接的形式
*  3.待更新
*/ 
const get = (url,config) => ajax.get(url,{params:config});

/*发送post请求,参数形式：
*  直接加对象的形式
*  待更新
*/ 
const post = (url,config) => ajax.post(url,config);

/*发送put请求,参数形式：
*  待更新
*/ 
const put = (url,config) => ajax.put(url,config);

/**
*发送删除请求
*/
const deleteMy = (url,config) => ajax.delete(url);


const apiList = { get,post,put,deleteMy }

export default apiList