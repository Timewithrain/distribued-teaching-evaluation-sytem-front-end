<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert ref="message" title="查看督导个人信息" type="info" center show-icon :closable="false">
        <template slot='title'>{{message}}</template>
      </el-alert>

      <el-form :inline="true" :model="supervisorInfoForm" :rules="supervisorInfoFormRules" ref="supervisorInfoFormRef" :hide-required-asterisk="true" style="margin-top: 25px">
        <!-- 修改信息开关 -->
        <el-switch v-model="isEditable" active-text="修改信息" inactive-text="只读信息" style="margin: 5px 20px 20px 650px;"></el-switch>
        <!-- 督导基本信息 -->
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="姓名:" prop="name" style="margin-left: 10px;">
              <el-input v-model="supervisorInfoForm.name" :disabled="!isEditable" style="width: 300px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号:" prop="idNumber" style="margin-left: 10px;">
              <el-input v-model="supervisorInfoForm.idNumber" :disabled="true" style="width: 300px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
              <el-radio-group v-model="supervisorInfoForm.gender" :disabled="true" size="small">
                <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色:" prop="role" style="margin-left: 10px;">
              <el-input v-model="supervisorInfoForm.role.name" :disabled="true" style="width: 80px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码:" prop="password" style="margin-left: 10px;">
              <el-input v-model="supervisorInfoForm.password" :disabled="true" style="width: 300px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24" style="text-align: center;">
            <!-- 修改提交按钮 -->
            <el-button :disabled="!isEditable" type="primary" @click="submitUpdateSupervisor()">提 交</el-button>
          </el-col>
        </el-row>
      </el-form>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      supervisorInfoForm: {
        name: '',
        idNumber: '',
        password: '',
        role: { id: 4, name: '督导' },
        gender: '',
      },
      message: '个人信息页面',
      isEditable: false,
      supervisorInfoFormRules: {

      },
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]
    }
  },
  created() {
    this.getSupervisorInfo()
  },
  methods: {
    async getSupervisorInfo() {
      const result = await this.$http.get('/user-manager/supervisor/getSupervisor')
      if (result.status != 200){
        return this.$message.error('获取个人信息失败！')
      }
      const s = result.data.data
      if (s) {
        this.supervisorInfoForm = s
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
    async submitUpdateSupervisor() {
      // 验证通过则提交督导信息
      this.$refs.supervisorInfoFormRef.validate(async valid => {
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
        const result2 = await this.$http.put('/user-manager/supervisor/updateSupervisor', this.supervisorInfoForm)
        if (result2.status!=200){
          return this.$message.error('修改个人信息失败！')
        }
        this.$message.success('修改信息成功！')
      })
    },
  }
}
</script>

<style lang="less" scoped>

</style>