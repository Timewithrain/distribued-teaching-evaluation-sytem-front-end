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
export default {
  data() {
    return {
      //登陆表单数据对象绑定
      loginForm: {
          username: '大西瓜',
          password: '123'
      },
      //表单验证规则
      loginFormRules: {
          //用户名验证
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 20, message: '长度在3到20之间', trigger: 'blur' },
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
          console.log(valid);
          if (!valid) return;
          //使用await简化promise操作,await关键字仅能在异步函数中使用，因此该函数前加async修饰 
          const { data: result } = await this.$http.post('login', this.loginForm); 
          console.log(result);
          if (result.status != 200) {
            return this.$message.error('登陆失败');
          }
          this.$message.success('登陆成功');
          //登陆成功后将通过sessionStorage的方式将token保存下来
          window.sessionStorage.setItem("token",result.token);
          //登陆后通过编程式导航跳转到后台主页，路由地址为：/home
          this.$router.push('/home')
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