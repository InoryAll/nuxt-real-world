import apis from '../api';
import Vue from 'vue';
import { request } from './request';

// apis注入全局
Vue.prototype.$apis = {
    ...apis,
};

// axios实例注入全局
Vue.prototype.axios = request;

