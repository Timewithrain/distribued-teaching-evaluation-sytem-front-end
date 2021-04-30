<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item type="success" :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>学院管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- 添加按钮 -->
        <el-col :span="3">
            <el-button type="primary" @click="showAddDepartmentDialog">添加学院</el-button>
        </el-col>
        <!-- 搜索框 -->
        <el-col :span="17" style="margin-left: 80px">
          <el-form :inline="true" class="demo-form-inline" style="width: 780px;">
            <el-form-item label="" style="margin-left: 433px;margin-right: 0px">
              <el-input v-model="searchForm" placeholder="请输入学院名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="searchDepartment">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 学院表格 -->
      <el-table :data="departmentList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="id" width="70"></el-table-column>
        <el-table-column prop="name" label="学院名称" width="220">
        </el-table-column>
        <el-table-column prop="courseNumber" label="课程数" width="120">
        </el-table-column>
        <el-table-column prop="classNumber" label="班级数" width="120">
        </el-table-column>
        <el-table-column prop="teacherNumber" label="教师人数" width="120">
        </el-table-column>
        <el-table-column prop="studentNumber" label="学生人数" width="120">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="180">
          <template v-slot="scope">
            <el-button type="warning" icon="el-tag-edit" size="small" @click="showEditDepartmentDialog(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-tag-delete" size="small" @click="showDeleteDepartmentDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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

    <!-- 添加学院对话框 -->
    <el-dialog title="添加学院" :visible.sync="addDepartmentDialogVisible" width="50%">
      <el-form :inline="true" :model="addDepartmentForm" :rules="addDepartmentFormRules" ref="addDepartmentFormRef" label-width="100px">
        <el-form-item label="学院名称:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addDepartmentForm.name" style="width: 460px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDepartmentDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddDepartment()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 删除学院对话框 -->
    <el-dialog title="删除学院" :visible.sync="editDepartmentDialogVisible" width="50%">
      <el-form :inline="true" :model="editDepartmentForm" :rules="addDepartmentFormRules" ref="editDepartmentFormRef" label-width="100px">
        <el-form-item label="学院名称:" prop="name" style="margin-left: 10px;">
          <el-input v-model="editDepartmentForm.name" style="width: 460px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDepartmentDialog()">取 消</el-button>
        <el-button type="primary" @click="submitEditDepartment()">修 改</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      startPage: 1,
      pageSize: 5,
      total: 0,
      departmentList: [],
      searchForm: '',
      addDepartmentForm: {},
      editDepartmentForm: {},
      addDepartmentDialogVisible: false,
      editDepartmentDialogVisible: false,
      addDepartmentFormRules: {name: [{ required: true, message: '请输入学院名称', trigger: 'blur' }]}

      
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      const result = await this.$http.get('/course-manager/department/searchDepartment?pageSize='+this.pageSize+'&startPage='+this.startPage+'&str='+this.searchForm)
      if (result.status!=200){
        return this.$message.error('获取学院列表信息失败！')
      }
      console.log(result)
      this.departmentList = result.data.data.list
      this.total = result.data.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getDepartmentList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getDepartmentList()
    },
    searchDepartment() {
      this.startPage = 1
      this.getDepartmentList()
    },
    //显示添加学院对话框
    showAddDepartmentDialog() {
      this.addDepartmentDialogVisible = true
    },
    //提交添加学院操作
    submitAddDepartment() {
      // 验证学院信息
      this.$refs.addDepartmentFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请填写学院信息！')
        const result = await this.$http.post('/course-manager/department/addDepartment', this.addDepartmentForm)
        if (result.status!=200){
          return this.$message.error('添加学院操作失败！')
        }
        this.$message.success('添加学院操作成功！')
        this.$refs.addDepartmentFormRef.resetFields()
        this.addDepartmentDialogVisible = false
        this.getDepartmentList()
      })
    },
    //关闭添加学院对话框
    closeAddDepartmentDialog() {
      this.addDepartmentDialogVisible = false
      this.$refs.addDepartmentFormRef.resetFields()
    },
    //显示修改学院对话框
    showEditDepartmentDialog(department) {
      this.editDepartmentForm = department
      this.editDepartmentDialogVisible = true
    },
    //提交修改学院操作
    submitEditDepartment() {
      // 验证学院信息
      this.$refs.editDepartmentFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请填写学院信息！')
        const result = await this.$http.put('/course-manager/department/updateDepartment', this.editDepartmentForm)
        if (result.status!=200){
          return this.$message.error('修改学院操作失败！')
        }
        this.$message.success('修改学院操作成功！')
        this.$refs.editDepartmentFormRef.resetFields()
        this.editDepartmentDialogVisible = false
        this.getDepartmentList()
      })
    },
    //关闭修改学院对话框
    closeEditDepartmentDialog() {
      this.editDepartmentDialogVisible = false
      this.$refs.editDepartmentFormRef.resetFields()
    },
    //显示删除学院对话框
    async showDeleteDepartmentDialog(department) {
      const result = await this.$confirm('此操作将彻底删除学院：'+department.name+'及其课程和班级，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消删除学院操作')
      }
      console.log(department)
      //提交删除请求
      const result2 = await this.$http.delete('/course-manager/department/deleteDepartment?id='+department.id)
      if (result2.status!=200){
        return this.$message.error('删除学院操作失败！')
      }
      this.$message.success('成功删除学院!')
      this.getDepartmentList()
    }
  }
}
</script>

<style scoped>

</style>
