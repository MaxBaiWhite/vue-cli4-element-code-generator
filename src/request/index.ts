import axios from 'axios'
import {Message} from 'element-ui'
import {getcookie} from './../utils'

/**
 * json类型请求
 */

let http:any = axios.create({});
// @ts-ignore
http.defaults.baseURL = process.env.VUE_APP_context;
http.defaults.headers.post['Content-Type'] = 'application/json';
http.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
http.defaults.timeout = 70000;//超时时间
http.interceptors.request.use((config: any) => {
    return config
});
http.interceptors.response.use((response: any) => {
    if (response.data.errorCode !==undefined && response.data.errorCode !== '0') {
        Message.error(response.data.errorMsg);
        Promise.reject()
    }
    return response.data
},(err: any) => {
    if (err.stack.indexOf('Network Error') > 0) {
        Message.error('网络走丢了☺!');
        Promise.reject()
    }
});

let httpFile:any = axios.create({});
// @ts-ignore
httpFile.defaults.baseURL = process.env.VUE_APP_context;
httpFile.defaults.headers.post['Content-Type'] = 'application/octet-stream;charset=utf-8';
httpFile.defaults.timeout = 70000;//超时时间
httpFile.interceptors.request.use((config: any) => {
    return config
});
httpFile.interceptors.response.use((response: any) => {
    if (response.data.errorCode !==undefined && response.data.errorCode !== '0') {
        Message.error(response.data.errorMsg);
        Promise.reject()
    }
    return response.data
},(err: any) => {
    if (err.stack.indexOf('Network Error') > 0) {
        Message.error('网络走丢了☺!');
        Promise.reject()
    }
});
export {http,httpFile}
