<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/student-home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert ref="message" title="查看学生个人信息" type="info" center show-icon :closable="false">
        <template slot='title'>{{message}}</template>
      </el-alert>

      <el-form :inline="true" :model="studentInfoForm" :rules="studentInfoFormRules" ref="studentInfoFormRef" :hide-required-asterisk="true" style="margin-top: 25px">
        <!-- 选项栏 -->
        <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first" style="margin-left: 30px;">
            <!-- 修改个人信息开关 -->
            <el-switch v-model="isEditable" active-text="修改信息" inactive-text="只读信息" style="margin: 5px 20px 20px 650px;"></el-switch>
            <!-- 教师基本信息 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="姓名:" prop="name" style="margin-left: 10px;">
                  <el-input v-model="studentInfoForm.name" :disabled="!isEditable" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学号:" prop="idNumber" style="margin-left: 10px;">
                  <el-input v-model="studentInfoForm.idNumber" :disabled="true" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
                  <el-radio-group v-model="studentInfoForm.gender" :disabled="true" size="small">
                    <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学分:" prop="score" style="margin-left: 10px;">
                  <el-input v-model="studentInfoForm.totalClass" :disabled="true" style="width: 80px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="班级:" prop="aclass" style="margin-left: 10px;">
                  <el-input v-model="studentInfoForm.aclass.name" :disabled="true" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="籍贯:" prop="region" style="margin-left: 10px;">
                  <el-input v-model="studentInfoForm.region" :disabled="!isEditable" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生年月:" prop="birth" style="margin-left: 10px;">
                  <el-date-picker v-model="studentInfoForm.birth" type="date" placeholder="选择日期" :disabled="!isEditable" style="width: 300px;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="入学时间:" prop="entranceDate" style="margin-left: 10px;">
                  <el-date-picker v-model="studentInfoForm.entranceDate" type="date" placeholder="选择日期" :disabled="!isEditable" style="width: 300px;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24" style="text-align: center;">
                <!-- 修改提交按钮 -->
                <el-button :disabled="!isEditable" type="primary" @click="submitUpdateStudent()">提 交</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 账户密码信息 -->
          <el-tab-pane label="账户信息" name="second" style="margin-left: 30px;">
            <el-form-item label="角色:" prop="role" style="margin-left: 10px;">
              <el-input v-model="studentInfoForm.role.name" :disabled="true" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" style="margin-left: 10px;">
              <el-input v-model="studentInfoForm.password" :disabled="true" style="width: 250px"></el-input>
            </el-form-item>
          </el-tab-pane>
          
          <!-- 课程信息 -->
          <el-tab-pane label="课程信息" name="third" style="margin-left: 30px;">
            <el-table class="course-table" :data="courseList" style="width: 100%;margin-bottom: 20px;" row-key="id">  
              <el-table-column label="序号" type="index" width="70"></el-table-column>
              <el-table-column prop="name" label="课程名" width="200">
              </el-table-column>
              <el-table-column prop="number" label="课程号" width="120">
              </el-table-column>
              <el-table-column prop="courseClass" label="类型" width="120">
              </el-table-column>
              <el-table-column prop="score" label="学分" width="100">
              </el-table-column>
              <el-table-column prop="time" label="学时" width="100">
              </el-table-column>
              <el-table-column prop="courseDep" label="学院" width="120">
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
                :total="this.total" style="text-align: center;">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      studentInfoForm: {
        name: '',
        idNumber: '',
        password: '',
        role: { id: 3, name: '学生' },
        gender: '',
        region: '',
        score: 0,
        birth: '',
        entranceDate: '',
        aclass: { 
          id: '',
          department: { id: '' } 
        }
      },
      startPage: 1,
      pageSize: 5,
      total: 0,
      //学生课程列表
      courseList: [],
      message: '个人信息页面',
      //面板导航栏的位置
      tabPosition: 'left',
      //当前选中的页面
      activeName: '基本信息',
      isEditable: false,
      studentInfoFormRules: {
        region: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        birth: [{ required: true, message: '请选择出生时间', trigger: 'blur' }],
        entranceDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
      },
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]

    }
  },
  created() {
    this.getStudentInfo()
  },
  methods: {
    async getStudentInfo() {
      const result = await this.$http.get('/user-manager/student/getStudent')
      if (result.status != 200){
        return this.$message.error('获取个人信息失败！')
      }
      const s = result.data.data
      if (s) {
        this.studentInfoForm = s
      } else {
        //若无法获取学生信息则登陆超时，重新登陆
        window.sessionStorage.clear();
        const result = await this.$http.get('/user-manager/user/logout');
        if (result.status != 200){
          return this.$message.error('退出状态异常！');
        }
        this.$router.push('/login');
        this.$message.success('登陆超时，请重新登录');
      }
    },
    handleClick(tab, event) {
      var str = tab.label
      this.message = '查看学生' + str
      if (tab.label=='课程信息') {
        this.getCourseList()
      }
    },
    async submitUpdateStudent() {
      // 验证通过则提交学生信息
      this.$refs.studentInfoFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        //验证通过则询问用户是否确定
        const result = await this.$confirm('确定提交修改信息吗？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result!='confirm' ) {
          return this.$message.info('取消修改操作')
        }
        //提交修改信息
        const result2 = await this.$http.put('/user-manager/student/updateStudent', this.studentInfoForm)
        if (result2.status!=200){
          return this.$message.error('修改个人信息失败！')
        }
        this.$message.success('修改信息成功！')
      })
    },
    async getCourseList() {
      const result = await this.$http.get('/course-manager/courseManage/listCourseByClassId?pageSize='+this.pageSize+'&startPage='+this.startPage+'&classId='+this.studentInfoForm.aclass.id)
        if (result.status!=200){
          return this.$message.error('获取课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.total = result.data.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getCourseList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getCourseList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
