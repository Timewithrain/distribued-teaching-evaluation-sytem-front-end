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
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#7cf3c1">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.name}}</span>
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
      <el-main> Main </el-main>
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
      }
    }
  },
  created(){
    this.getMenuList()
  },
  methods: {
    logout() {
      //点击退出后，清除token，并返回至登陆页面
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('已退出系统');
    },
    //获取所有的菜单
    async getMenuList() {
      const result = await this.$http.get('menus')
      // const { data: result } = await this.$http.get('menus')
      //若数据获取不成功，显示提示信息
      if (result.status != 200) {
        return this.$message.error(result.message);
      }
      //若数据获取成功，则提取返回的菜单列表数据
      this.menuList = result.data.data
      console.log(this.menuList)
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
  // height: 90px !important;
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
}
.el-main {
  background-color: #eaedf1;
}
</style>