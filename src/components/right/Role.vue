<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row class="bdbottom">
              <el-col :span="5"><el-tag type="info">权限类别</el-tag></el-col>
              <el-col :span="11"><el-tag type="info">权限路径</el-tag></el-col>
              <el-col :span="5"><el-tag type="info">权限属性</el-tag></el-col>
              <el-col :span="3"><el-tag type="info">操作</el-tag></el-col>
            </el-row>
            <el-row :class="['bdbottom', i1==0 ? 'bdtop':'']" v-for="(item1, i1) in scope.row.permissions" :key="item1.id">
              <el-col :span="5">
                <el-tag>{{item1.name}}</el-tag>
              </el-col>
              <el-col :span="11">
                <el-tag type="success">{{item1.url}}</el-tag>
              </el-col>
              <el-col :span="5">
                <el-tag type="warning">{{item1.perms}}</el-tag>
              </el-col>
              <el-col :span="3">
                <el-button class="btn-center" type="danger" size="small" @click="removePermOfRole(scope.row.id, item1.id)">删除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope2">
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetPermsDialog(scope2.row.id)">分配权限</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="showDeleteRoleDialog(scope2.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.startPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
      </el-pagination>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%">
      <el-form :inline="true" :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addRoleForm.name" style="width: 150px;"></el-input>
        </el-form-item>        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddRoleDialog">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">添 加</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限分配" :visible.sync="setPermsDialogVisible" width="50%">
      <el-tree :data="permsList" :props="treeProps" node-key="id" :default-checked-keys="defaultKey" ref="treeRef" show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPermsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantPerms">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色的列表数据
      roleList: [],
      permsList: [],
      pageSize: 5,
      startPage: 1,
      total: 0,
      //控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      //控制权限分配对话框的显示与隐藏
      setPermsDialogVisible: false,
      addRoleForm: {
        id: '',
        name: ''
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        },
      treeProps: {
        label: 'url',
      },
      //每个角色默认拥有的权限id值数组
      defaultKey: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取所有角色列表
    async getRoleList() {
    //   const result = await this.$http.get('listRole')
      const result = await this.$http.get('/user-manager/admin/listRole?pageSize='+this.pageSize+'&startPage='+this.startPage)
      if (result.status != 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.roleList = result.data.data.list
      this.total = result.data.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getRoleList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getRoleList()
    },
    showAddRoleDialog() {
      this.addRoleDialogVisible = true
    },
    submitAddRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请完整填写角色信息！')
        const result = await this.$http.post('/user-manager/admin/addRole', this.addRoleForm)
        if (result.status!=200){
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('成功添加角色！')
        this.$refs.addRoleFormRef.resetFields()
        this.addRoleDialogVisible = false
        this.getRoleList()
      })
    },
    closeAddRoleDialog() {
      this.addRoleDialogVisible = false
      this.$refs.addRoleFormRef.resetFields()
    },
    async removePermOfRole(roleId, permId) {
      //获取角色Id及其对应的权限Id用以删除其映射关系
      const result = await this.$confirm('此操作将删除该角色对应的权限，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消权限删除操作')
      }
      
      const result2 = await this.$http.delete('/user-manager/admin/deleteRolePermission?permsId='+permId+'&roleId='+roleId)
      if (result2.status != 200) {
        return this.$message.error('删除权限失败！')
      }
      this.getRoleList()
    },
    //展示分配权限的对话框
    async showSetPermsDialog(id) {
      //获取所有权限数据
      const result = await this.$http.get('/user-manager/admin/listAllPerms')
      if (result.status != 200) {
        return this.$message.error('删除权限失败！')
      }
      this.permsList = result.data.data
      this.setPermsDialogVisible = true
      //保存当前选中的角色Id
      this.roleId = id
      //先清空defaultKey数组中的值
      this.defaultKey.splice(0,this.defaultKey.length)
      var role = this.roleList[id-1]
      role.permissions.forEach(element => {
        this.defaultKey.push(element.id)
      });
    },
    //为角色分配权限
    async grantPerms() {
      //通过展开运算符将tree中被选中的权限id加入数组
      const keys = [ ...this.$refs.treeRef.getCheckedKeys() ]
      console.log(keys)
      const idStr = keys.join(',')
      console.log(this.roleId)
      console.log(idStr)
      const result = await this.$http.put('/user-manager/admin/updateRolePerms?roleId='+this.roleId+'&perms='+idStr)
      if (result.status != 200) {
        return this.$$message.error('更新权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRoleList()
      this.setPermsDialogVisible = false
    },
    async showDeleteRoleDialog(roleId) {
      const result = await this.$confirm('此操作将彻底删除该角色，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消权限删除操作')
      }
      const result2 = await this.$http.delete('/user-manager/admin/deleteRole?id='+roleId)
      if (result2.status!=200){
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('成功删除角色!')
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

  .btn-center {
    margin: 7px 2px;
  }
</style>