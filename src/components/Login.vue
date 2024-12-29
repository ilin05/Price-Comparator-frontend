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
          <el-card title="登录" class="login_card" style="display: flex; justify-content: center ; vertical-align: center">
            <div style="margin-top: 20px;  font-size: 2em; font-weight: bold; color: #ffffff">
              登录账号
            </div>
            <div class="form-group">
              <label for="username" style="color: white">Email:</label>
              <input type="text" id="email" v-model="userLoginInfo.email" required>
            </div>
            <div class="form-group">
              <label for="password" style="color: white">Password:</label>
              <input type="password" id="password" v-model="userLoginInfo.password" required>
            </div>
            <button type="submit" class="login-button" style="margin-top:20px" @click="ConfirmUserLogin">Login</button>
            <RouterLink to="register">
              <button type="button" class="login-button" style="margin-top:20px">注册</button>
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
  height: 50%;
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
  background-size: cover;
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
  font-size: 1.5rem;
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
      userLoginInfo :{
        email : '',
        password : '',
      },

      discountProductList:[{
        name: '',
        id: '',
        specification: '',
        category: '',
        imageUrl: '',
        link: '',
        platform: '',
        price: 0,
        previousPrice: 0,
      }]
    }

  },

  methods:{
    GetDiscountProducts(){
      axios.get("/user/checkFavoriteProductsPrice", {
        params:{
          email: this.userLoginInfo.email
        }
      })
          .then(response=>{
            if(response.data.code === 1){
              this.discountProductList = response.data.payload;
              sessionStorage.setItem("discountProductList", JSON.stringify(this.discountProductList));
              this.discountProductList.forEach((item)=>{
                console.log(item)
              })
              if(this.discountProductList.length === 0){
                ElMessage.success("您收藏的商品暂无折扣");
              }else{
                ElMessage.success("查询折扣商品成功");
              }
              window.location.reload();
            }else{
              ElMessage.error(response.data)
            }
          })
          .catch(error =>{
            ElMessage.error("获取折扣商品失败");
          })
    },
    ConfirmUserLogin(){
      //如果userLoginInfo.email和userLoginInfo.password为空，则提示用户输入
      if(this.userLoginInfo.email === ''){
        ElMessage.error("请输入邮箱");
        return;
      }
      if(this.userLoginInfo.password === ''){
        ElMessage.error("请输入密码");
        return;
      }
      axios.post("/user/login",{
        email:this.userLoginInfo.email,
        password:this.userLoginInfo.password
        //password:SHA256(this.adminLoginInfo.password).toString(),
      })
          .then(response=>{
            if(response.data.code === 1){
              ElMessage.success("登录成功");
              sessionStorage.setItem("token", response.data.payload.email);
              sessionStorage.setItem("userName", response.data.payload.userName);
              this.GetDiscountProducts();
              router.push('/user');
            }else{
              ElMessage.error(response.data)
            }
          })
          .catch(error =>{
            ElMessage.error("用户名或密码错误");
          })
    },
  }
}

</script>