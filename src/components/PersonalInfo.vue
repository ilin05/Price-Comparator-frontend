<template>
  <div class = "main">
    <el-header class="title">
      <div style="margin-top: 12px; display: inline-block;">
        <span style="font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">Price Comparator</span>
      </div>
    </el-header>

    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <span>我的信息</span>
        </div>
      </template>
<!--      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>-->
      <p><strong>用户名:</strong> {{ this.user.name }}</p>
      <p><strong>邮箱:</strong> {{ this.user.email }}</p>
      <template #footer>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="modifyPasswordVisible = true">修改密码</el-button>
          <el-button size="small" text @click="modifyUserNameVisible = true">修改用户名</el-button>
          <RouterLink to="/login">
            <el-button size="small" type="primary" style="margin-left: 12px" @click="DeleteToken">登出</el-button>
          </RouterLink>
        </div>
      </template>
    </el-card>

    <el-footer class="footer">
      <div class="footer-content">
        <RouterLink to="/user">
          <el-button type="text" class="footer-button">
            <el-icon><Search /></el-icon>
          </el-button>
        </RouterLink>
        <RouterLink to="/favorites">
          <el-button type="text" class="footer-button">
            <el-icon><Star /></el-icon>
          </el-button>
        </RouterLink>
        <RouterLink to="/myFootPrints">
          <el-button type="text" class="footer-button">
            <el-icon><Clock /></el-icon>
          </el-button>
        </RouterLink>
        <el-button type="text" class="footer-button">
          <el-icon><UserFilled /></el-icon>
        </el-button>
      </div>
    </el-footer>

    <el-dialog v-model="modifyPasswordVisible" title="修改密码">
      <el-form
          :label-position="left"
          label-width="auto"
          style="max-width: 600px"
      >
        <el-form-item label="旧密码">
          <el-input type="password" v-model="modifyPasswordInfo.oldPassword" placeholder="请输入旧密码"/>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="modifyPasswordInfo.newPassword" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="再次输入新密码" :error="passwordMismatch ? '两次输入的新密码不一致' : ''">
          <el-input type="password" v-model="modifyPasswordInfo.newPasswordAgain" placeholder="请再次输入新密码"/>
        </el-form-item>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="modifyPasswordVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="ConfirmModifyPassword" :disabled="passwordMismatch">确认</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modifyUserNameVisible" title="修改用户名">
      <el-form
          :label-position="left"
          label-width="auto"
          style="max-width: 600px"
      >
        <el-form-item label="新用户名">
          <el-input v-model="modifyUserNameInfo.newUserName" placeholder="请输入新的用户名"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="modifyUserNameInfo.password" placeholder="请输入密码"/>
        </el-form-item>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="modifyUserNameVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="ConfirmModifyUserName">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import axios from "axios";
import {UserFilled, Reading, Star} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";

export default {
  computed: {
    UserFilled() {
      return UserFilled
    },
  },
  components: {Star, UserFilled, Reading },
  data() {
    return {
      user: {
        name: '',
        email: ''
      },
      modifyPasswordVisible: false,
      modifyUserNameVisible: false,
      passwordMismatch: false,
      modifyPasswordInfo :{
        oldPassword : '',
        newPassword : '',
        newPasswordAgain : ''
      },
      modifyUserNameInfo :{
        newUserName: '',
        password: '',
      },
    }
  },
  methods: {
    ConfirmModifyPassword(){
      axios.post("/user/modifyPassword", {
        email: this.user.email,
        oldPassword: this.modifyPasswordInfo.oldPassword,
        newPassword: this.modifyPasswordInfo.newPassword
      })
          .then(response => {
            if(response.data.code === 1){
              ElMessage.success("修改密码成功");
              this.modifyPasswordVisible = false;
              this.modifyPasswordInfo.oldPassword = '';
              this.modifyPasswordInfo.newPassword = '';
              this.modifyPasswordInfo.newPasswordAgain = '';
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    },

    ConfirmModifyUserName(){
      axios.post("/user/modifyUserName", {
        email: this.user.email,
        newName: this.modifyUserNameInfo.newUserName,
        password: this.modifyUserNameInfo.password
      })
          .then(response => {
            if(response.data.code === 1){
              ElMessage.success("修改用户名成功");
              this.user.name = this.modifyUserNameInfo.newUserName;
              sessionStorage.setItem("userName", this.modifyUserNameInfo.newUserName);
              this.modifyUserNameVisible = false;
              this.modifyUserNameInfo.newUserName = '';
              this.modifyUserNameInfo.password = '';
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    },

    CheckPasswordMatch() {
      this.passwordMismatch = this.modifyPasswordInfo.newPassword !== this.modifyPasswordInfo.newPasswordAgain;
    },

    DeleteToken(){
      ElMessage.success("登出成功");
      sessionStorage.clear()
    }
  },
  mounted() {
    this.user.name = sessionStorage.getItem("userName");
    this.user.email = sessionStorage.getItem("token");
    this.$watch('modifyPasswordInfo.newPassword', this.CheckPasswordMatch);
    this.$watch('modifyPasswordInfo.newPasswordAgain', this.CheckPasswordMatch);
  }

}

</script>

<style scoped>
.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: #0f184d;
  overflow-y: hidden;
}

.title {
  background-color: rgb(17, 71, 117);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.footer {
  background-color: #f5f5f5;
  padding: 10px 20px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e0e0e0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.footer-button {
  font-size: 24px;
  color: #333;
}

.footer-button:hover {
  color: #409EFF;
}

</style>