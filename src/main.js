import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css
import "@/styles/element-variables.scss";
import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import { Spin } from "view-design";


if (process.env.NODE_ENV !== "production") {
    console.log(123)
    require("./mock");
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

//全局加载
Vue.prototype.$Spin = Spin;
import "../public/rem.js";
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});
// (function() {
//   const rem = document.createElement("script");
//   rem.src = "./rem.js";
//   document.body.appendChild(rem);
// })();
