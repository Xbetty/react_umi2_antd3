/*
 * Author: xiongziting
 * Date: 2021-01-29 16:45:40
 * LastEditors: xiongziting
 * LastEditTime: 2021-01-29 17:05:48
 * Description: 环境配置
 * FilePath: /react-pro-master/src/utils/env.js
 */

const defaultProps = {
    ENV: 'dev',
    NAME: '开发',
    BASE_URL: '/xzt',
  };
  
  const env = [
    {
      ENV: 'formal',
      NAME: '正式',
      HOST: 'q.aircourses.com',
      BASE_URL: 'https://api.aircourses.com',
    },
    {
      ENV: 'pre',
      NAME: '预发',
      HOST: 'pre-q.aircourses.com',
      BASE_URL: 'https://pre-api.aircourses.com',
    },
    {
      ENV: 'test',
      NAME: '测试',
      HOST: 'test-q.aircourses.com',
      BASE_URL: 'http://test-api.aircourses.com',
    },
    {
      ENV: 'dev',
      NAME: '开发',
      HOST: 'dev-q.aircourses.com',
      BASE_URL: 'http://dev-api.aircourses.com',
    },
  ];
  
  //通过url判断接口BASE_URL
  let _COMMON_PROPS = {};
  for (let i = 0; i < env.length; i++) {
    if (env[i].HOST === window.location.host) {
      _COMMON_PROPS = env[i];
      break;
    }
  }
  
  //没有匹配到 默认是本地开发环境
  window._COMMON_PROPS = { ...defaultProps, ..._COMMON_PROPS };
  
  // 通过url配置接口BASE_URL
  window.BASE_URL = window._COMMON_PROPS.BASE_URL;
  