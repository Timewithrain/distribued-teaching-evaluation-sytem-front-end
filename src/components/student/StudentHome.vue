<template>
  <el-container class="home-container">
   <el-header>
      <div>
        <img id="logo" src="../../assets/watermelon.png" alt="" />
        <h2>教学质量评估系统</h2>
      </div>
      <div>
        <span style="font-size: 17px">您好，{{user.name}}同学，欢迎来到学生页面！</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 侧边栏展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#7cf3c1" :unique-opened="true" 
        :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 菜单项目 -->
          <el-menu-item :index="'/'+item.path" v-for="item in menuList" :key="item.id" @click="saveNavState('/'+item.path)">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      menuList: [],
      //控制侧边栏是否收起
      isCollapse: false,
      //选中的页面
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.getUserInfo()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    getUserInfo() {
      var userInfo = this.$route.query.user
      //若页面跳转来时，通过参数获取user并存入session。若参数为空，则从session中获取user
      if (userInfo) {
        this.user = JSON.parse(userInfo)
        window.sessionStorage.setItem("user",JSON.stringify(this.user))
      } else{
        this.user = JSON.parse(window.sessionStorage.getItem("user"))
      }
    },
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
    },
    getMenuList() {
      var menu = [
        {id: 1, authName: '个人中心', path: 'student-info'},
        {id: 2, authName: '教学评价', path: 'student-evaluation'}]
      this.menuList = menu
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
#logo {
  width: 70px;
  height: 70px;
  margin: 3px 10px;
}
.home-container {
  height: 100%;
}
.el-header {
  height: 90px !important;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>