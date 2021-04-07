<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    pagination: () => import("./components/Pagination")
  }
};
</script>
