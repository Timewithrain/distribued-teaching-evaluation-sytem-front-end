<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
          <el-col :span="8">
            <!-- 通过v-model双向绑定将输入数据放入query中,并将其作为参数回传至后台用以查询 -->
            <el-input placeholder="请输入用户名或编号" v-model="queryInfo.query" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="角色" prop="role.name"></el-table-column>
        <el-table-column label="编号" prop="idNumber"></el-table-column>
        <!-- <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch active-color="#13ce66" v-model="scope.row.status" @change="userStateChanged(scope.row.status)"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 角色分配 -->
            <el-tooltip class="item" effect="dark" content="角色分配" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"  size="medium" @click="setRole(scope.row)">角色分配</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.startPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <el-dialog title="角色分配" :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前用户：{{userInfo.name}}</p>
        <p>当前角色: {{roleInfo.name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.Id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    //验证手机号规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      //获取用户列表参数对象
      queryInfo: {
          query: '',
          startPage: 1,
          pageSize: 5
      },
      userList: [],
      total: 0,
      //添加用户表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, 
          { min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, 
          { min: 6, max: 15, message: '密码长度在6到15之间', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
           { validator: checkMobile, trigger: 'blur'}
        ]
      },
      //是否显示角色分配对话框
      setRoleDialogVisible: false,
      //待分配角色的用户信息
      userInfo: {},
      roleInfo: {},
      roleList: [],
      //存储被选中的角色id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
        console.log(this.queryInfo)
        const result = await this.$http.get('/user-manager/admin/searchUser', { params: this.queryInfo })
        if (result.status != 200) {
          return this.$message.error('获取用户列表失败')
        }
        this.userList = result.data.data.list
        this.total = result.data.data.total
        console.log(this.userList)
    },
    //监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    //监听startPage改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.startPage = newPage
      this.getUserList()
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      this.roleInfo = userInfo.role
      const result = await this.$http.get('/user-manager/admin/listAllRole')
      this.roleList = result.data.data
      this.setRoleDialogVisible = true
    },
    async grantRole() {
      if (!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }
      var user = this.userInfo
      user.roleId = this.selectedRoleId
      user.role.id = this.selectedRoleId
      const result = await this.$http.put('/user-manager/admin/updateUser', user)
      if (result.status != 200) {
        return this.$message.error('更改用户角色失败！')
      }
      this.$message.success('更改用户角色成功！')
      this.setRoleDialogVisible = false
      this.getUserList()
    },
    //监听角色分配对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
