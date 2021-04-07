<template>
    <div>
        我是登录1
        <button @click="handleToLogin">登录</button>
    </div>
</template>

<script>
import _ from "lodash";

export default {
    methods: {
        handleToLogin: _.throttle(
            function () {
                const obj = {};
                this.$store.dispatch("user/login", obj).then((res) => {
                    this.$router.push({
                        path: this.redirect || "/",
                    });
                });
            },
            3000,
            {
                leading: true,
                trailing: false, // 节流之后不会执行该函数
            }
        ),
    },
};
</script>

<style lang="scss" scoped>
</style>
