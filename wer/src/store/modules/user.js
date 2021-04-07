import { UserXKEnterprisePCAdminLogin } from "@/api/user";

import {
    getToken,
    setToken,
    removeToken,
    removePermission
} from "@/utils/auth";
import { resetRouter } from "@/router";
const getDefaultState = () => {
    return {
        token: getToken(),
        name: "",
        avatar: "",
        roles: [],
        account: "",

        merchantInfo: {},
    };
};

const state = getDefaultState();

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_ACCOUNT: (state, account) => {
        state.account = account;
    },
    SET_ENTERPRISE: (state, enterprise) => {
        state.enterprise = enterprise;
    },
    SET_MERCHANTINFO: (state, merchantInfo) => {
        state.merchantInfo = merchantInfo;
    },
};

function getContractorByEnterpriseId(id, { commit }) {
    XKGetContractorByEnterpriseId({
        enterpriseId: id // id 先暂时用1做一下测试
    }).then(res => {
        commit("SET_MERCHANTINFO", res);
    });
}

const actions = {
    setMerchantInfo({ commit }, merchantInfo) {
        commit("SET_MERCHANTINFO", merchantInfo);
    },
    // user login
    login({ commit }, userInfo) {

        return new Promise((resolve, reject) => {
            UserXKEnterprisePCAdminLogin(userInfo)
                .then(res => {

                    console.log(res)

                    return


                    const {
                        account,
                        role,
                        token,
                    } = res;
                    const roleList = {
                        超级管理员: "admin"
                    };
                    let roles = [];
                    if (role) {
                        roles.push(roleList[role.role_name]);
                        //角色列表
                        commit("SET_ROLES", roles);
                    }

                    //token
                    sessionStorage.setItem("token", "XKTOKEN_" + token);
                    commit("SET_TOKEN", token);
                    //账号信息
                    commit("SET_ACCOUNT", account);
                    setToken(token);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            removeToken(); // must remove  token  first
            removePermission();
            resetRouter();
            sessionStorage.clear();
            commit("RESET_STATE");
            resolve();
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken(); // must remove  token  first
            commit("RESET_STATE");
            resolve();
        });
    }
};

export default {
    namespaced: true, // 带命名空间的模块。 保证在变量名一样的时候， 添加一个父级名拼接
    state,
    mutations,
    actions
};