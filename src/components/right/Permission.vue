<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="permList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="url"></el-table-column>
        <el-table-column label="权限" prop="perms"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="startPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      permList: [],
      total: 23,
      startPage: 1,
      pageSize: 10
    }
  },
  created (){
    //获取所有的权限
    this.getPermissionList()
  },
  methods: {
    //获取权限列表
    async getPermissionList() {
      // axios('http://localhost:9003/user-manager/admin/listPerms?pageSize='+this.pageSize+'&startPage='+this.startPage)
      // .then((res) => {
      //   this.permList = res.data
      // });      
      // console.log(this.permList)
      const result = await this.$http.get('/user-manager/admin/listPerms?pageSize='+this.pageSize+'&startPage='+this.startPage)
      if (result.status != 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.permList = result.data.data.list
      this.total = result.data.data.total
      console.log(result)
    },
    //监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getPermissionList()
    },
    //监听startPage改变事件
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getPermissionList()
    },
  }
}
</script>

<style lang="less" scoped>
  
</style>
