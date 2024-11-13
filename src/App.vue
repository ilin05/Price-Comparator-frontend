<template>
  <div>
    <div class="main" style="overflow-y: hidden; ">
      <el-container >
        <el-main>
          <RouterView class="main" style="height: 90vh; max-height: 100%; background-color: white; color: black;" />
        </el-main>
      </el-container>

    </div>
  </div>



</template>

<script>
import { RouterView } from 'vue-router'
import {UserFilled} from "@element-plus/icons-vue";

export default {
  components: {UserFilled}
}
</script>

<style scoped>
#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #dcdcdc;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

}

.content{
  position: absolute;
  top: 10%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: #0f184d;
}

.title {
  background-color: rgb(17, 71, 117);
  height: 60px;
}

.aside {
  min-height: calc(100vh - 60px);
  width: 180px;
  background-color: red;
}

body{
  margin:0;
  padding:0;
  border:0
}


</style>
