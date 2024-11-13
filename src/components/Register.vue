<template>
  <div>
    <div class="main" style="overflow-y: hidden; ">
      <el-container>

        <el-main class="background_container" style="display: flex;" :router = "true">
          <el-card title="注册" class="login_card" style="display: flex; justify-content: center ; vertical-align: center">
            <div style="margin-top: 20px;  font-size: 2em; font-weight: bold; color: #ffffff">
              注册
            </div>
            <div class="form-group">
              <label for="username" style="color: white">Email:</label>
              <input type="text" id="email" v-model="registerInfo.email" required>
            </div>
            <div class="form-group">
              <label for="username" style="color: white">UserName:</label>
              <input type="text" id="userName" v-model="registerInfo.userName" required>
            </div>
            <div class="form-group">
              <label for="password" style="color: white">Password:</label>
              <input type="password" id="password" v-model="registerInfo.password" required>
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
  background:url("@/assets/figure2.jpg");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;
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
      },
    }

  },

  methods:{
    ConfirmRegister(){
      axios.post("/user/openAccount",{
        userName: this.registerInfo.userName,
        email:this.registerInfo.email,
        password:this.registerInfo.password
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
  }
}

</script>