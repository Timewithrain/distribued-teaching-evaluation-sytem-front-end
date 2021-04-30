<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <img id="logo" src="../assets/watermelon.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 侧边栏展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" 
        text-color="#fff" 
        active-text-color="#7cf3c1" 
        :unique-opened="true" 
        :collapse="isCollapse" 
        :collapse-transition="false" 
        :router="true"
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

            <!-- <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu> -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //菜单栏数据
      menuList: [],
      //由于本地无图标资源，因此以下图标无法使用
      iconsObj: {
        '1': 'iconfont icon-user',
        '2': 'iconfont icon-tijikongjian',
        '3': 'iconfont icon-shangpin',
        '4': 'iconfont icon-danju',
        '5': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      //被激活的链接地址
      activePath: ''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
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
    },
    //获取所有的菜单
    async getMenuList() {
      // const result = await this.$http.get('menus')
      // //若数据获取不成功，显示提示信息
      // if (result.status != 200) {
      //   return this.$message.error(result.message);
      // }
      // //若数据获取成功，则提取返回的菜单列表数据s
      // this.menuList = result.data.data
      // console.log(this.menuList)


      var mockData = [
        { id: 1, 
          authName: '用户管理', 
          path: 'user', 
          children: [ { id: 1, authName: '用户列表', path: 'user'},
                      { id: 2, authName: '教师管理', path: 'teacher'},
                      { id: 3, authName: '督导管理', path: 'supervisor'},
                      { id: 4, authName: '学生管理', path: 'student'}] },
        { id: 2, 
          authName: '权限管理', 
          path: 'right', 
          children: [ { id: 1, authName: '角色列表', path: 'role'}, 
                      { id: 2, authName: '权限列表', path: 'permission'}] },
        { id: 3, 
          authName: '课程管理', 
          path: 'courseManage', 
          children: [ { id: 1, authName: '班级管理', path: 'category'}, 
                      { id: 2, authName: '课程管理', path: 'course'}, 
                      { id: 3, authName: '学院管理', path: 'department'}] },
        { id: 4, 
          authName: '班级管理', 
          path: 'class', 
          children: [ { id: 1, authName: '班级管理1', path: 'class1'}, 
                      { id: 2, authName: '班级管理2', path: 'class2'}] },
        { id: 5, 
          authName: '教学评估', 
          path: 'evaluation', 
          children: [ { id: 1, authName: '教学评估1', path: 'evaluate1'}, 
                      { id: 2, authName: '教学评估2', path: 'evaluate2'},
                      { id: 3, authName: '教学评估3', path: 'evaluate3'}] }
      ]
      this.menuList = mockData
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>


<style lang="less" scoped>
#logo {
  width: 70px;
  height: 70px;
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