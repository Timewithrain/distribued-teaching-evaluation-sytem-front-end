<template>
  <el-container>
   <el-header>
      <div>
        <img id="logo" src="../../assets/watermelon.png" alt="" />
        <span>欢迎来到督导页面！</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
  </el-container>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    async logout() {
      //点击退出后，清除token，并返回至登陆页面
      window.sessionStorage.clear();
      const result = await this.$http.get('/user-manager/user/logout');
      console.log(result)
      if (result.status != 200){
        return this.$message.error('退出状态异常！');
      }
      this.$router.push('/login');
      this.$message.success('已退出系统');
    }
  }
}
</script>

<style lang="less" scoped>

</style>