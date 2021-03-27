<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      //点击退出后，清除token，并返回至登陆页面
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.success('已退出系统');
    }
  }
};
</script>


<style lang="less" scoped>
  
</style>