<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/teacher-home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示信息 -->
      <el-alert ref="message" title="查看教师个人信息" type="info" center show-icon :closable="false">
        <template slot='title'>{{message}}</template>
      </el-alert>

      <el-form :inline="true" :model="teacherInfoForm" :rules="teacherInfoFormRules" ref="teacherInfoFormRef" :hide-required-asterisk="true" style="margin-top: 25px">
        <!-- 选项栏 -->
        <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first" style="margin-left: 30px;">
            <!-- 修改个人信息开关 -->
            <el-switch v-model="isEditable" active-text="修改信息" inactive-text="只读信息" style="margin: 5px 20px 20px 650px;"></el-switch>
            <!-- 教师基本信息 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="姓名:" prop="name" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.name" :disabled="true" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工号:" prop="idNumber" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.idNumber" :disabled="true" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
                  <el-radio-group v-model="teacherInfoForm.gender" :disabled="true" size="small">
                    <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总课时:" prop="totalClass" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.totalClass" :disabled="true" style="width: 80px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学院:" prop="department" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.department.name" :disabled="true" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="籍贯:" prop="region" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.region" :disabled="!isEditable" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生年月:" prop="birth" style="margin-left: 10px;">
                  <el-date-picker v-model="teacherInfoForm.birth" type="date" placeholder="选择日期" :disabled="!isEditable" style="width: 300px;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="职称:" prop="jobTitle" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.jobTitle" :disabled="!isEditable" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职年月:" prop="entranceDate" style="margin-left: 10px;">
                  <el-date-picker v-model="teacherInfoForm.entranceDate" type="date" placeholder="选择日期" :disabled="!isEditable" style="width: 300px;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="学位:" prop="degree" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.degree" :disabled="!isEditable" style="width: 300px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="政治面貌:" prop="politicalStatus" style="margin-left: 10px;">
                  <el-select v-model="teacherInfoForm.politicalStatus" placeholder="请选择" :disabled="!isEditable" style="width: 300px;">
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
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="毕业院校:" prop="graduateSchool" style="margin-left: 10px;">
                  <el-input v-model="teacherInfoForm.graduateSchool" :disabled="!isEditable" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24" style="text-align: center;">
                <!-- 修改提交按钮 -->
                <el-button :disabled="!isEditable" type="primary" @click="submitUpdateTeacher()">提 交</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 账户密码信息 -->
          <el-tab-pane label="账户信息" name="second" style="margin-left: 30px;">
            <el-form-item label="角色:" prop="role" style="margin-left: 10px;">
              <el-input v-model="teacherInfoForm.role.name" :disabled="true" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" style="margin-left: 10px;">
              <el-input v-model="teacherInfoForm.password" :disabled="true" style="width: 250px"></el-input>
            </el-form-item>
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
      teacherInfoForm: {
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
      //提示信息
      message: '个人信息页面',
      //面板导航栏的位置
      tabPosition: 'left',
      //当前选中的面板
      activeName: '',
      //判断个人信息是否可修改
      isEditable: false,
      teacherInfoFormRules: {
        region: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        birth: [{ required: true, message: '请选择出生时间', trigger: 'blur' }],
        jobTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        entranceDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
        degree: [{ required: true, message: '请输入最终学位', trigger: 'blur' }],
        politicalStatus: [{ required: true, message: '请选择政治面貌', trigger: 'blur' }],
        graduateSchool: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }]
      },
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]
    }
  },
  created() {
    this.getTeacherInfo()
  },
  methods: {
    async getTeacherInfo() {
      const result = await this.$http.get('/user-manager/teacher/getTeacher')
      if (result.status != 200){
        return this.$message.error('获取个人信息失败！')
      }
      console.log(result)
      this.teacherInfoForm = result.data.data
      console.log(this.teacherInfoForm)
    },
    handleClick(tab, event) {
      var str = tab.label
      this.message = '查看教师' + str
    },
    async submitUpdateTeacher() {
      // 验证通过则提交教师信息
      this.$refs.teacherInfoFormRef.validate(async valid => {
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
        const result2 = await this.$http.put('/user-manager/teacher/updateTeacher', this.teacherInfoForm)
        if (result2.status!=200){
          return this.$message.error('修改个人信息失败！')
        }
        this.$message.success('修改信息成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>