import axios from "axios";

// import Loading from '../static/loading'

import {
    Message,
} from 'element-ui'

import { baseURL, userURL } from "@/config";
// import {
// 	getToken
// } from '@/lib/util'

import router from "../router";
import { showLoading, hideLoading } from "../../public/loading";

//是否正在刷新的标记
let isRefreshing = false;
//重试队列，每一项都是一个待执行的函数形式
let requests = [];

class HttpRequest {
    constructor(baseUrl = baseURL) {
        // baseUrl = baseUrl || baseURL
        this.baseUrl = baseUrl;
    }

    getInsideConfig(localUrl) {
        const config = {
            //全局配置
            baseUrl: localUrl ? localUrl : this.baseUrl,
            headers: {
                XKTOKENHeader: "XKTOKEN_" + sessionStorage.getItem("token")
            }
        };
        return config;
    }

    //拦截器
    interceptors(instance) {
        const that = this;
        //请求拦截器
        instance.interceptors.request.use(
            config => {
                //添加全局loading
                if (config.data) {
                    if (config.data.enterpriseId === "") {
                        // Modal.warning({
                        // 	title: '温馨提示',
                        // 	content: '亲，请重新登录!',
                        // 	onOk: function () {
                        // 		router.push({
                        // 			name: 'login'
                        // 		})
                        // 	}
                        // })
                    }
                }
                showLoading();
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        // //是否正在刷新的标记
        // let isRefreshing = false
        // //重试队列，每一项将是一个待执行的函数形式
        // let requests = []
        //响应拦截器
        instance.interceptors.response.use(
            res => {
                // Spin.hide()
                hideLoading();

                if (res.data.code === "1000") {
                    return res.data.data;
                } else if (res.data.code === "2000") {
                    return Promise.reject(res.data.message);
                } else {
                    // Message.warning('请联系客服')
                    return Promise.reject("服务器异常，请稍后再试");
                }
            },
            error => {
                hideLoading();
                const config = error.config;
                if (!isRefreshing) {
                    isRefreshing = true;
                    return that
                        .refreshToken()
                        .then(res => {
                            const token = "XKTOKEN_" + res;
                            sessionStorage.setItem("token", token);
                            config.headers["XKTOKENHeader"] = token;
                            // config.url = ''
                            //已经刷新了token，将所有队列中的请求进行重试
                            requests.forEach(cb => cb(token));
                            requests = [];
                            return instance(config);
                        })
                        .catch(res => {
                            this.$message.error(res);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                } else {
                    //正在刷新token,将返回一个未执行resolve的promise
                    return new Promise(resolve => {
                        //将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                        requests.push(token => {
                            // config.url = ''
                            config.headers["XKTOKENHeader"] = token;
                            resolve(instance(config));
                        });
                    });
                }
                // return response
                return Promise.reject(error);
            }
        );
    }

    // //给实例添加一个setToken方法，用于登录后更新保存token
    // setToken(instance, token) {
    // 	instance.default.headers['XKTOKENHeader'] = token

    // }

    //更新token
    refreshToken() {
        return axios({
            method: "post",
            url: `${userURL}/api/jwt/refreshToken`,
            data: {
                token: sessionStorage.getItem("token")
            }
        }).then(res => res.data.data.newToken);
    }

    request(options, localUrl) {
        const instance = axios.create();
        this.interceptors(instance);
        options = Object.assign(this.getInsideConfig(localUrl), options);
        return instance(options);
    }
}
export default HttpRequest;
