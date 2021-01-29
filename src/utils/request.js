/*
 * Author: xiongziting
 * Date: 2021-01-29 17:07:15
 * LastEditors: xiongziting
 * LastEditTime: 2021-01-29 18:11:47
 * Description:
 * FilePath: /react-pro-master/src/utils/request.js
 */
import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: window.baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
// request拦截
instance.interceptors.request.use(
  // 在发送请求之前做些什么
  config => {
    config.headers['x-auth-token'] = JSON.parse(localStorage.getItem('userInfo'))
      ? JSON.parse(localStorage.getItem('userInfo')).token
      : '';
    // config.headers['Content-Type'] = 'application/json';
    config.headers['x-requested-with'] = 'XMLHttpRequest';
    return config;
  },
  // 对请求错误做些什么
  error => {
    return Promise.reject(error);
  },
);

// response拦截
instance.interceptors.response.use(
  // 对响应数据做点什么
  response => {
    console.log('response',response)
    let data = response.data;
    if (data.success || data.code === '0000' || data.code === 0) {
      return Promise.resolve(data);
    } else {
      message.warning(data.message || data.msg || '请重试~');
      return Promise.reject(data);
    }
  },
  // 对响应错误做点什么
  error => {
    console.log('error',error)
    if (error.response) {
      if (error.response.data.code === '0401' || error.response.status === 401) {
        window.location.href = `${window.location.origin}/login`;
      }
      return Promise.reject(error);
    }
  },
);
window.axios = instance;

export default instance;
