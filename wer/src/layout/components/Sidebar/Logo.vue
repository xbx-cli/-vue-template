<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <!-- <h1 v-else class="sidebar-title">{{ title }}</h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
const xbxLogo = require("../../../assets/xbx_icon.png");
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: "闲不闲企业服务平台",
      logo: xbxLogo
    };
    // return {
    //   title: 'Vue Admin Template',
    //   logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    // }
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  text-align: center;
  overflow: hidden;

  & a {
    border-bottom: 2px solid #cbd4e8;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      // width: 32px;
      height: 32px;
      vertical-align: middle;
      // margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #1d4abc;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-left: 10px;
      margin-right: 0px;
    }
  }
}
</style>
