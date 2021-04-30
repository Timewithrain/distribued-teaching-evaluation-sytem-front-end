<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>督导管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-button type="primary" @click="showAddSupervisorDialog">添加督导</el-button>
        </el-col>

        <el-col :span="15" style="margin-left: 150px">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="width: 350px; margin-left: 250px">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.str" placeholder="请输入督导姓名" clearable="true"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="getSupervisorList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table class="supervisor-table" :data="supervisorList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="id" width="70"></el-table-column>
        <el-table-column prop="name" label="姓名" width="170">
        </el-table-column>
        <el-table-column prop="idNumber" label="工号" width="200">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="150">
        </el-table-column>
        <el-table-column prop="" label="" width="274">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="100">
          <template v-slot="scope">
            <el-button type="danger" icon="el-tag-delete" size="medium" @click="showDeleteSupervisorDialog(scope.row)">删除</el-button>
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

    <el-dialog title="添加督导" :visible.sync="addSupervisorDialogVisible" width="50%">
      <el-form :inline="true" :model="addSupervisorForm" :rules="addSupervisorFormRules" ref="addSupervisorFormRef" label-width="100px">
        <el-form-item label="督导姓名:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addSupervisorForm.name" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="工号:" prop="idNumber" style="margin-left: 10px;width: 300px;">
          <el-input v-model="addSupervisorForm.idNumber" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
           <el-radio-group v-model="addSupervisorForm.gender" style="width: 150px;">
            <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddSupervisorDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddSupervisor()">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 5,
      startPage: 1,
      total: 0,
      supervisorList: [],
      addSupervisorDialogVisible: false,
      searchForm: { str: '' },
      //添加督导用户表单
      addSupervisorForm: {
        name: '',
        idNumber: '',
        password: '',
        role: { id: 4, name: '督导'},
        gender: ''
      },
      addSupervisorFormRules: {
        name: [{ required: true, message: '请输入督导姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入工号号', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }]
      },
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]
    }
  },
  created() {
    this.getSupervisorList()
  },
  methods: {
    async getSupervisorList() {
      const result = await this.$http.get('/user-manager/admin/searchSupervisor?pageSize='+this.pageSize+'&startPage='+this.startPage+'&str='+this.searchForm.str)
      if (result.status != 200){
        return this.$message.error('获取督导列表失败！')
      }
      this.supervisorList = result.data.data.list
      this.total = result.data.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getSupervisorList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getSupervisorList()
    },
    showAddSupervisorDialog() {
      this.addSupervisorDialogVisible = true
    },
    submitAddSupervisor() {
      // 验证通过则提交教师信息
      this.$refs.addSupervisorFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        const result = await this.$http.post('/user-manager/admin/addSupervisor', this.addSupervisorForm)
        if (result.status!=200){
          return this.$message.error('添加督导信息失败！')
        }
        this.$message.success('添加教师信息成功！')
        this.$refs.addSupervisorFormRef.resetFields()
        this.addSupervisorForm.department = {}
        this.addSupervisorDialogVisible = false
        this.getSupervisorList()
      })
    },
    closeAddSupervisorDialog() {
      this.addSupervisorDialogVisible = false
      this.addSupervisorFormRef.resetFields()
    },
    async showDeleteSupervisorDialog(supervisor) {
      const result = await this.$confirm('此操作将彻底删除'+supervisor.name+'督导的信息，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消删除督导操作')
      }
      //提交删除请求
      const result2 = await this.$http.delete('/user-manager/admin/deleteSupervisor?id='+supervisor.id)
      if (result2.status!=200){
        return this.$message.error('删除督导操作失败！')
      }
      this.$message.success('成功删除督导!')
      this.getSupervisorList()
    }
  }
}
</script>

<style scoped>

</style>
