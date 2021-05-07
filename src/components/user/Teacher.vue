<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-button type="primary" @click="showAddTeacherDialog">添加教师</el-button>
        </el-col>

        <!-- 搜索栏 -->
        <el-col :span="15" style="margin-left: 150px">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="width: 600px;">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.str" placeholder="请输入教师姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="学院">
              <el-select v-model="searchForm.departmentId" placeholder="请选择" style="width: 200px" clearable>
                <el-option v-for="item in departmentList" :key="item.id"
                  :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="getTeacherList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table class="teacher-table" :data="teacherList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="id" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="idNumber" label="工号" width="150">
        </el-table-column>
        <el-table-column prop="gender" :formatter="genderFormat" label="性别" width="70">
        </el-table-column>
        <el-table-column prop="entranceDate" type="datetime" :formatter="dateFormat" label="入职日期" width="100">
        </el-table-column>
        <el-table-column prop="jobTitle" label="职称" width="100">
        </el-table-column>
        <el-table-column prop="politicalStatus" label="政治面貌" width="100">
        </el-table-column>
        <el-table-column prop="department.name" label="学院" width="150">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="120">
          <template v-slot="scope">
            <el-button type="danger" icon="el-tag-delete" size="small" @click="showDeleteTeacherDialog(scope.row)">删除</el-button>
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

    <!-- 添加教师对话框 -->
    <el-dialog title="添加教师" :visible.sync="addTeacherDialogVisible" width="50%">
      <el-form :inline="true" :model="addTeacherForm" :rules="addTeacherFormRules" ref="addTeacherFormRef" label-width="100px">
        <el-form-item label="教师姓名:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addTeacherForm.name" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="工号:" prop="idNumber" style="margin-left: 10px;width: 300px;">
          <el-input v-model="addTeacherForm.idNumber" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
           <el-radio-group v-model="addTeacherForm.gender" style="width: 150px;">
            <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯:" prop="region" style="margin-left: 10px;width: 300px;">
          <el-input v-model="addTeacherForm.region" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="总课时:" prop="totalClass" style="margin-left: 10px;">
          <el-input v-model="addTeacherForm.totalClass" :disabled="true" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="出生年月:" prop="birth" style="margin-left: 10px;width: 300px;">
          <el-date-picker v-model="addTeacherForm.birth" type="date" placeholder="选择日期" style="width: 190px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="职称:" prop="jobTitle" style="margin-left: 10px;">
          <el-input v-model="addTeacherForm.jobTitle" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="入职年月:" prop="entranceDate" style="margin-left: 10px;width: 300px;">
          <el-date-picker v-model="addTeacherForm.entranceDate" type="date" placeholder="选择日期" style="width: 190px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="学位:" prop="degree" style="margin-left: 10px;">
          <el-input v-model="addTeacherForm.degree" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌:" prop="politicalStatus" style="margin-left: 10px;width: 300px;">
          <!-- <el-input v-model="addTeacherForm.politicalStatus" style="width: 190px;"></el-input> -->
          <el-select v-model="addTeacherForm.politicalStatus" placeholder="请选择" style="width: 190px;">
            <el-option label="群众" value="群众"></el-option>
            <el-option label="共青团员" value="共青团员"></el-option>
            <el-option label="中共预备党员" value="中共预备党员"></el-option>
            <el-option label="中共党员" value="中共党员"></el-option>
            <el-option label="民革党员" value="民革党员"></el-option>
            <el-option label="民盟盟员" value="民盟盟员"></el-option>
            <el-option label="民建会员" value="民建会员"></el-option>
            <el-option label="民进会员" value="民进会员"></el-option>
            <el-option label="农工党党员" value="农工党党员"></el-option>
            <el-option label="致公党党员" value="致公党党员"></el-option>
            <el-option label="九三学社社员" value="九三学社社员"></el-option>
            <el-option label="台盟盟员" value="台盟盟员"></el-option>
            <el-option label="无党派人士" value="无党派人士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业院校:" prop="graduateSchool" style="margin-left: 10px;">
          <el-input v-model="addTeacherForm.graduateSchool" style="width: 460px;"></el-input>
        </el-form-item>
        <el-form-item label="学院:" prop="department" style="margin-left: 10px;">
          <template>
            <el-select v-model="addTeacherForm.department.id" placeholder="请选择" clearable style="width: 460px">
              <el-option v-for="item in departmentList" :key="item.id"
                :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddTeacherDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddTeacher()">添 加</el-button>
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
      departmentList: [],
      teacherList: [],
      addTeacherDialogVisible: false,
      searchForm: {
        str: '',
        departmentId: ''
      },
      //添加教师的表单数据对象
      addTeacherForm: {
        name: '',
        idNumber: '',
        password: '',
        role: { id: 2, name: '教师'},
        gender: '',
        region: '',
        totalClass: 0,
        birth: '',
        entranceDate: '',
        jobTitle: '',
        grantDate: '',
        politicalStatus: '',
        degree: '',
        graduateSchool: '',
        department: {}
      },
      //添加教师表单的验证规则
      addTeacherFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        region: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        birth: [{ required: true, message: '请选择出生时间', trigger: 'blur' }],
        jobTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        entranceDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
        degree: [{ required: true, message: '请输入最终学位', trigger: 'blur' }],
        politicalStatus: [{ required: true, message: '请选择政治面貌', trigger: 'blur' }],
        graduateSchool: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        department: [{ required: true, message: '请选择学院', trigger: 'blur' }]
      },
      //添加教师中的性别选项按钮
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]
    }
  },
  created() {
    this.getTeacherList()
    this.getAllDepartmentList()
  },
  methods: {
    async getTeacherList() {
      const result = await this.$http.get('/user-manager/admin/searchTeacher?pageSize='+this.pageSize+'&startPage='+this.startPage+
      '&str='+this.searchForm.str+'&departmentId='+this.searchForm.departmentId)
      if (result.status != 200){
        return this.$message.error('获取教师列表失败！')
      }
      this.teacherList = result.data.data.list
      this.total = result.data.data.total
    },
    async getAllDepartmentList() {
      const result = await this.$http.get('/course-manager/department/listAllDepartment')
      if (result.status != 200){
        return this.$message.error('获取学院列表失败！')
      }
      this.departmentList = result.data.data
    },
    //监听 pageSize改变
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getTeacherList()
    },
    //监听 startPage改变
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getTeacherList()
    },
    //性别信息格式化
    genderFormat(row){
      var dT=new Date(row.entranceDate);//row 表示一行数据, dateTime 表示要格式化的字段名称
      return row.gender == 0 ? '男' : '女'
    },
    //时间格式化函数
    dateFormat(row){
      var dT=new Date(row.entranceDate);//row 表示一行数据, dateTime 表示要格式化的字段名称
      return dT.getFullYear()+"-"+(dT.getMonth()+1)+"-"+dT.getDate();
    },
    showAddTeacherDialog() {
      this.addTeacherDialogVisible = true
    },
    submitAddTeacher() {
      // 验证通过则提交教师信息
      this.$refs.addTeacherFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        const result = await this.$http.post('/user-manager/admin/addTeacher', this.addTeacherForm)
        if (result.status!=200){
          return this.$message.error('添加教师信息失败！')
        }
        this.$message.success('添加教师信息成功！')
        this.$refs.addTeacherFormRef.resetFields()
        this.addTeacherForm.department = {}
        this.addTeacherDialogVisible = false
        this.getTeacherList()
      })
    },
    closeAddTeacherDialog() {
      this.addTeacherDialogVisible = false
      this.addTeacherFormRef.resetFields()
    },
    async showDeleteTeacherDialog(teacher) {
      const result = await this.$confirm('此操作将彻底删除'+teacher.name+'老师的信息，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消删除教师操作')
      }
      //提交删除请求
      const result2 = await this.$http.delete('/user-manager/admin/deleteTeacher?id='+teacher.id)
      if (result2.status!=200){
        return this.$message.error('删除教师操作失败！')
      }
      this.$message.success('成功删除教师!')
      this.getTeacherList()
    }
  }
}
</script>

<style scoped>

</style>