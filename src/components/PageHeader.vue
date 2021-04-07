<template>
  <div>
    <el-page-header
      title="返回"
      @back="goBack"
      :content="title"
    ></el-page-header>
  </div>
</template>
<script>
export default {
  props: ["title"],
  data() {
    return {};
  },
  methods: {
    goBack() {
      window.history.back();
    }
  }
};
</script>
