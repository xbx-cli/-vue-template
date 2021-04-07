<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="left-menu">
      <div class="left-menu-l">
        <div class="left-menu-title">{{ enterprise.name }}</div>

        <el-dropdown @command="handleChange">
          <div class="left-menu-img cursor">
            <img src="../../assets/select.png" class="imgSrc" />
            <span class="cursor el-dropdown-link">
              切换企业
            </span>
          </div>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              style="min-width: 210px"
              v-for="item in enterpriseList"
              :key="item.id"
              :command="item"
              :disabled="item.status != '10103' && item.status != '10104'"
              >{{ item.name }}
              <span
                v-if="item.id === enterprise.id"
                class="fl_r"
                style="color: green;margin-left: 10px"
                >✔</span
              >
              <span
                v-if="item.status === '10103' && item.id !== enterprise.id"
                class="fl_r"
                style="display:inline-block;height:20px;line-height:18px; color: blue;border:1px solid blue; border-radius:20px; padding: 0 15px;margin-top:8px;margin-left:18px"
                >切换</span
              >
              <span
                v-if="item.status === '10101'"
                class="fl_r"
                style="color: red"
                >审核中</span
              >
              <span
                v-if="item.status === '10104'"
                class="fl_r"
                style="color: red"
                >被驳回，去修改 ></span
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="left-menu-r">
        <div class="imgInfo m_r_5">
          <img src="../../assets/init.png" class="imgSrc" />
        </div>
        <div class="fz_14">{{ account.name }}</div>
        <el-divider direction="vertical"></el-divider>
        <div class="fz_14 cursor" @click="personSetting">个人设置</div>
        <el-divider direction="vertical"></el-divider>
        <div class="imgInfo m_r_20 cursor" @click="logout">
          <img src="../../assets/down.png" class="imgSrc" />
        </div>
      </div>
    </div>
    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { GetEnterpriseList, ChangeEnterprise } from "@/api/user";
import _ from "lodash";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      enterprise: this.$store.state.user.enterprise,
      account: this.$store.state.user.account,
      enterpriseList: [],
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  mounted() {
    this.getEnterpriseList();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },

    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },

    getEnterpriseList() {
      GetEnterpriseList({
        accountId: this.$store.state.user.account.id
      }).then(res => {
        this.enterpriseList = res;
      });
    },
    handleChange(item) {
      if (item.status === "10103") {
        this.throttle(this.changeEnterprise(item.id));
      }
      if (item.status === "10104") {
        this.$router.push({
          path: "/add",
          query: { joinType: "update", enterpriseId: item.id }
        });
      }
    },
    throttle(fn) {
      let canRun = true; // 通过闭包保存一个标记
      return function() {
        if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
        canRun = false; // 立即设置为false
        setTimeout(() => {
          // 将外部传入的函数的执行放在setTimeout中
          fn.apply(this, arguments);
          // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
          canRun = true;
        }, 500);
      };
    },
    changeEnterprise: _.throttle(
      function(val) {
        ChangeEnterprise({
          accountId: this.$store.state.user.account.id,
          enterpriseId: val
        }).then(res => {
          this.$store
            .dispatch(
              "user/login",
              JSON.parse(sessionStorage.getItem("loginForm"))
            )
            .then(x => {
             let preUrl = location.pathname ?
               location.pathname.split("/")[1] :
               "";
             if (this.$store.state.user.roles[0] == "operator") {
               location.href = `https://${location.host}/${preUrl}/partners/index`;
             } else {
               location.href = `https://${location.host}/${preUrl}/home`;
             }
            });
        });
      },
      3000,
      {
        trailing: false
      }
    ),
    // changeEnterprise(val) {},
    //更新企业信息
    refreshEnterprise(enterprise_id) {
      this.enterprise = this.enterpriseList.filter(
        u => u.id === enterprise_id
      )[0];
      this.$store.state.user.enterprise = this.enterprise;
    },
    personSetting() {
      this.$router.push("/information/index");
    }
  }
};
</script>

<style lang="scss" scoped>
.f_12 {
  font-size: 12px;
}
.imgSrc {
  width: 100%;
  height: 100%;
}
.imgInfo {
  width: 18px;
  height: 18px;
  img {
    vertical-align: super;
    margin-right: 5px;
  }
}
.cursor {
  cursor: pointer;
}
.m_r_5 {
  margin-right: 5px;
}
.m_r_20 {
  margin-right: 20px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .left-menu {
    display: flex;
    height: 100%;
    justify-content: space-between;
    .left-menu-l {
      display: flex;
      align-items: center;
      .left-menu-title {
        font-weight: bold;
        color: #1d4abc;
        font-size: 20px;
        margin-right: 20px;
      }
      .left-menu-img {
        display: inline-block;
        img {
          width: 18px;
          height: 15px;
          vertical-align: bottom;
          margin-right: 5px;
        }
      }
    }
    .left-menu-r {
      display: flex;
      align-items: center;
    }
  }

  .hamburger-container {
    line-height: 124px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
