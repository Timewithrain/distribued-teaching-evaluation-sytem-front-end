<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登陆表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      //登陆表单数据对象绑定
      loginForm: {
          username: 'test_管理员33',
          password: 'string'
      },
      //表单验证规则
      loginFormRules: {
          //用户名验证
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在3到20之间', trigger: 'blur' },
          ],
          //密码验证
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 3, max: 15, message: '长度在3到15之间', trigger: 'blur' },
          ]
      }
    };
  },
  methods: {
    //点击按钮，重置登陆表单
    resetLoginForm() {
    //   console.log(this)
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
          if (!valid) return;
          var user = {
            id: 0,
            name: this.loginForm.username,
            password: this.loginForm.password,
            roleId: 0,
            idNumber: this.loginForm.username,
            role: null
          }
          //使用await简化promise操作,await关键字仅能在异步函数中使用，因此该函数前加async修饰 
          const { data: result } = await this.$http.post('/user-manager/user/login', user); 
          console.log(result);
          const userInfo = result.data
          // var result
          // axios.post('http://localhost:9003/user-manager/user/login', user)
          // .then((res) => {
          //   console.log(res)
          //   result = res.data
          // });
          if (result.status != 200) {
            return this.$message.error('登陆失败');
          }
          this.$message.success('登陆成功');
          //登陆成功后将通过sessionStorage的方式将token保存下来
          // window.sessionStorage.setItem("token",result.token);
          //调试状态，伪装token
          window.sessionStorage.setItem("token",'ASYOUCANSEETHISISAFAKETOKENJUSTFORTEST');
          //，路由地址为：/home
          /**
           * 登陆后通过编程式导航跳转到后台主页
           * 登录用户角色为管理员时，跳转至管理员页面，路由地址为：/home
           * 角色为教师时跳转至教师页面，路由地址为：/teacher-home
           * 角色为学生时跳转至学生页面，路由地址为：/student-home
           * 角色为督导时跳转至督导页面，路由地址为：/supervisor-home
           * 其余角色为预留页面，路由地址为：/other-home
           */
          if(userInfo.role.id==1){
            this.$router.push('/home')
          } else if(userInfo.role.id==2) {
            this.$router.push({path: '/teacher-home', query:{user: JSON.stringify(userInfo)}})
          } else if(userInfo.role.id==3) {
            this.$router.push({path: '/student-home', query:{user: JSON.stringify(userInfo)}})
          } else if(userInfo.role.id==4){
            this.$router.push({path: '/supervisor-home', query:{user: JSON.stringify(userInfo)}})
          } else {
            this.$router.push('/other-home')
          }
      });
    }
  }

};
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;

    position: absolute;
    left: 50%;
    top: 50%;
    transform:  translate(-50%, -50%);

    // less语法嵌套
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_form {
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>