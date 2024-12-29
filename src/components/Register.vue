<template>
  <div>
    <div class="main" style="overflow-y: hidden; ">
      <el-container>
        <header class="header">
          <div class="header-content">
            <h1 class="site-title">Price Comparator</h1>
            <p class="welcome-subtitle">欢迎来到商品比价平台！</p>
          </div>
        </header>

        <el-main class="background_container" style="display: flex;" :router = "true">
          <el-card title="注册" class="login_card" style="display: flex; justify-content: center ; vertical-align: center">
            <div style="margin-top: 20px;  font-size: 2em; font-weight: bold; color: #ffffff">
              注册
            </div>
            <div class="form-group">
              <label for="username" style="color: white">Email:</label>
              <input type="text" id="email" placeholder="请输入邮箱" v-model="registerInfo.email" required>
            </div>
            <div class="form-group">
              <label for="username" style="color: white">UserName:</label>
              <input type="text" id="userName" placeholder="用户名(至少4位)" v-model="registerInfo.userName" required minlength="4">
            </div>
            <div class="form-group">
              <label for="password" style="color: white">Password:</label>
              <input type="password" id="password" placeholder="密码(至少6位)" v-model="registerInfo.password" required minlength="6">
            </div>
<!--            获取邮箱验证码按钮-->
            <div class="form-group">
              <label for="password" style="color: white">Verification Code:</label>
              <el-input type="text" id="verificationCode" placeholder="输入邮箱验证码" v-model="registerInfo.verificationCode" required>
<!--              <button type="submit" class="login-button" style="margin-top:20px" @click="getVerificationCode">获取验证码</button>-->
                <template #append>
                  <el-button type="primary" @click="handleVerificationCodeClick" :disabled="isButtonDisabled">获取验证码(60秒内只能获取一次)</el-button>
                </template>
              </el-input>
            </div>
            <button type="submit" class="login-button" style="margin-top:20px" @click="ConfirmRegister">Register</button>
            <RouterLink to="login">
              <button type="button" class="login-button" style="margin-top:20px">Login</button>
            </RouterLink>
          </el-card>
        </el-main>

      </el-container>
    </div>
  </div>
</template>

<style scoped>
.login {
  max-width: 300px;
  margin: 0 auto;
}

.form-group {
  margin: auto;
}

label {
  display: block;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login_card {
  background-color:rgba(255,255,255,20%);
  margin: auto;
  width: 500px;
  height: 65%;
  text-align: center;
  vertical-align:middle;
}

.login-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}

.background_container{
  background:url("@/assets/background.png");
  width:100%;
  height:100%;
  position:fixed;
  background-size:cover;
}

.header {
  background: linear-gradient(135deg, #1e3c72, #2a5298); /* 渐变背景 */
  color: white;
  padding: 20px 40px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://via.placeholder.com/150') no-repeat center center; /* 背景图案 */
  opacity: 0.1;
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 1;
}

.site-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff8a00, #e52e71); /* 文字渐变 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  font-size: 1.4rem;
  margin-top: 10px;
  color: #f1f1f1;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>

<script>

import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
//import SHA256 from "crypto-js/sha256";

export default {

  data(){
    return{
      registerInfo :{
        userName: '',
        email : '',
        password : '',
        verificationCode: '',
      },
      isButtonDisabled: false,
    }

  },

  methods:{
    ConfirmRegister(){
      axios.post("/user/openAccount",{
        userName: this.registerInfo.userName,
        email:this.registerInfo.email,
        password:this.registerInfo.password,
        verificationCode:this.registerInfo.verificationCode,
        sha256Code: sessionStorage.getItem("sha256Code")
        //password:SHA256(this.adminLoginInfo.password).toString(),
      })
          .then(response=>{
            if(response.data.code === 1){
              ElMessage.success("注册成功");
              sessionStorage.setItem("token", response.data.payload);
              router.push('/login');
            }else{
              ElMessage.error(response.data)
            }
          })
          .catch(error =>{
            ElMessage.error("注册失败");
          })
    },
    handleVerificationCodeClick() {
      this.getVerificationCode();
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 60000); // 60 seconds
    },
    getVerificationCode() {
      axios.get("/user/checkEmail", {
        params: {
          email: this.registerInfo.email
        }
      })
          .then(response => {
            if (response.data.code === 1) {
              ElMessage.success("验证码已发送，请查看您的邮箱");
              sessionStorage.setItem("sha256Code", response.data.payload);
            } else {
              ElMessage.error(response.data)
            }
          })
          .catch(error => {
            ElMessage.error("验证码发送失败");
          })
    }
  }
}

</script>