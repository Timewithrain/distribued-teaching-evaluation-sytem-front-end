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
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="success" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
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

    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%" 
      @close="editDialogVisible = false">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="70px" >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="perms">
          <el-input v-model="editForm.perms"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPermission()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permList: [],
      total: 23,
      startPage: 1,
      pageSize: 10,
      editDialogVisible: false,
      editForm: {
        name: '',
        url: '',
        perms: '',
        type: ''
      },
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
    showEditDialog(perm) {
      this.editForm = perm
      this.editDialogVisible = true
    },
    async editPermission() {
      const result2 = await this.$http.put('/user-manager/admin/updatePerms', this.editForm)
      this.getPermissionList()
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>
