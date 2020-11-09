<!--  -->
<template>
  <div>
       <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name:'home',
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    /*   退出功能：
     *   1.清除token
     *   2.定向到login的路由
    */
      logout() {
          window.sessionStorage.clear();
          this.$router.push('/login');
      }
  }
}

</script>
<style scoped lang = "less">

</style>