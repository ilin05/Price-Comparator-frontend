<template>
  <div class="main">

    <el-container>
      <el-header class="title">
        <div style="margin-top: 12px; display: inline-block;">
          <span style="font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">Price Comparator</span>
          <span style="margin-left :30px; font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">用户您好！</span>
          <RouterLink to="/user">
            <button class="transparent-button">
              <span style="margin-left: 40px; font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: lighter">搜索商品</span>
            </button>
          </RouterLink>
          <el-icon style="color: #ffffff; margin-left: 5px">
            <Reading />
          </el-icon>
          <RouterLink to="/favorites">
            <button class="transparent-button">
              <span style="margin-left: 40px; font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: lighter">我的收藏</span>
            </button>
          </RouterLink>
          <el-icon style="color: #ffffff; margin-left: 5px">
            <UserFilled />
          </el-icon>
        </div >
        <RouterLink to="/login">
          <el-button type="primary" style="margin-top: 12px; padding-right: 10px;">
            <span style="font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: normal;">登出</span>
          </el-button>
        </RouterLink>
      </el-header>
    </el-container>
    <el-container>

<!--      <el-aside class="aside" style="display: flex; color:#0f184d">-->
<!--        <el-menu active-text-color="#ffd04b" background-color="rgb(17, 71, 117)" default-active="1" text-color="#fff"-->
<!--                 style="height:100%; width: 100%;" :router="true">-->
<!--          <el-menu-item index="user">-->
<!--            <el-icon>-->
<!--              <Reading />-->
<!--            </el-icon>-->
<!--            <span>搜索商品</span>-->
<!--          </el-menu-item>-->
<!--          <el-menu-item index="favorites">-->
<!--            <el-icon>-->
<!--              <UserFilled />-->
<!--            </el-icon>-->
<!--            <span>我的收藏</span>-->
<!--          </el-menu-item>-->
<!--        </el-menu>-->
<!--      </el-aside>-->

      <el-main>
        <el-card title="商品列表" class="product_table" >
          <el-scrollbar height="600px">
            <el-table :data="productList">
              <el-table-column prop = "" lable = "图片" width="200">
                <template v-slot="scope">
                  <img :src="scope.row.imageUrl" alt="图片" class="left-image" />
                  <!--                  <el-image preview-teleported :preview-src-list="imageUrlList"/>-->
                </template>
              </el-table-column>
              <el-table-column prop="name" label="描述">
                <template v-slot="scope">
                  <a :href="scope.row.link" target="_blank">{{ scope.row.name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格">
              </el-table-column>
              <el-table-column prop="platform" label="平台">
              </el-table-column>
              <el-table-column  label="点击取消收藏该商品">
                <template v-slot ="scope">
                  <el-button type="normal" @click = "this.favoriteProductId = scope.row.id, deleteFavoriteVisible = true">
                    取消收藏</el-button>
                </template>
              </el-table-column>
              <el-table-column label="点击查看价格历史">
              <template v-slot ="scope">
                <el-button type="normal" @click = "this.showPriceHistoryProductId = scope.row.id, GetProductPriceHistory()">
                  查看</el-button>
              </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog v-model="deleteFavoriteVisible" title="是否取消收藏该商品？取消收藏后，你将不会收到该商品的降价通知！">
            <template #footer>
                      <span class="dialog-footer">
                          <el-button @click="deleteFavoriteVisible = false">取消</el-button>
                          <el-button type="primary" @click="DeleteFavorite">
                              确认
                          </el-button>
                      </span>
            </template>
    </el-dialog>

    <el-dialog v-model = "priceHistoryVisible" title="价格历史">
      <div>
        <el-card>
          <LineChart :chartData="prices" :chartLabels="dates" />
        </el-card>
      </div>
    </el-dialog>
<!--    <el-dialog v-model = "priceHistoryVisible" title="价格历史">-->
<!--      <div id="app">-->
<!--        &lt;!&ndash;为echarts准备一个具备大小的容器dom&ndash;&gt;-->
<!--        <div id="main" style="width: 600px; height: 400px"></div>-->
<!--      </div>-->
<!--    </el-dialog>-->

  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import LineChart from "@/components/LineChart.vue";
//import echarts from "echarts";

export default {
  components: {LineChart},
  data() {
    return {
      deleteFavoriteVisible: false,
      priceHistoryVisible: false,

      showPriceHistoryProductId: '',
      searchProduct : '',
      favoriteProductId : '',
      favoriteEmail: '',

      productList:[{
        name: '',
        id: '',
        specification: '',
        category: '',
        imageUrl: '',
        link: '',
        platform: '',
        price: 0
      }],

      favoriteInfo:{
        productId: '',
        email: ''
      },

      cashierList:[{
        cashierId :0,
        cashierName : '1',
        idNumber : '2',
        phoneNumber : '3',
        address : '4',
        privilege :'5',
        password :'',
      }],

      imageUrlList:[

      ],

      prices:[

      ],

      dates:[

      ]

    };
  },
  methods: {
    // drawLine(id){
    //   this.charts = echarts.init(document.getElementById(id));
    //   this.charts.setOption({
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     legend: {
    //       data: ['价格']
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     toolbox: {
    //       feature: {
    //         saveAsImage: {}
    //       }
    //     },
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       data: this.dates
    //     },
    //     yAxis: {
    //       type: 'value',
    //       //data: this.prices
    //     },
    //     series: [
    //       {
    //         name: '价格',
    //         type: 'line',
    //         stack: '总量',
    //         data: this.prices
    //       }
    //     ]
    //   })
    // },
    DeleteFavorite(){
      this.favoriteEmail = sessionStorage.getItem("token")
      axios.post("/user/deleteFavorites", {
        productId: this.favoriteProductId,
        email: this.favoriteEmail
      })
          .then(response => {
            if(response.data.code == 1){
              ElMessage.success("取消收藏成功")
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
      this.deleteFavoriteVisible = false
      this.GetFavorites()
    },

    GetFavorites(){
      axios.get("/user/getFavorites", {
        params: {
          email: sessionStorage.getItem("token")
        }
      })
          .then(response => {
            this.productList = response.data.payload;
          })
          .catch(error => {
            ElMessage.error("数据获取错误，请联系开发人员");
          })
    },

    GetProductPriceHistory(){
      axios.get("/user/getProductPriceHistory", {
        params: {
          productId: this.showPriceHistoryProductId
        }
      })
          .then(response => {
            if(response.data.code === 1){
              this.prices = response.data.payload.prices
              this.dates = response.data.payload.dates
              console.log(this.prices)
              console.log(this.dates)
              this.priceHistoryVisible = true
              //this.drawLine("main")
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    }
  },
  mounted() {
    this.GetFavorites();
  }
}
</script>

<style scoped>
/* 将样式移动到<style>标签中，并使用类选择器 */
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

.transparent-button {
  background-color: transparent; /* 设置背景为透明 */
  border: none; /* 去掉边框 */
  color: #000; /* 设置字体颜色，可以根据需要调整 */
  cursor: pointer; /* 鼠标悬停时显示手形光标 */
  padding: 10px 20px; /* 设置内边距 */
  font-size: 16px; /* 设置字体大小 */
}

.title {
  background-color: rgb(17, 71, 117);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.aside {
  min-height: calc(100vh - 60px);
  width: 180px;
  background-color: red;
}

.title2 {
  background: url("../assets/figure2.jpg");
  height: 60px;
  display: flex;
  align-items: center;
  text-align: left;
  color: #ffffff;
  font-weight: bold;
  font-size: xx-large;
  font-family: 'Microsoft YaHei';
}

.history-trail {
  margin-left: 30px;
  font-size: medium;
  color: #ffffff;
  font-weight: normal;
}

.product_table {
  position: absolute;
  top: 10%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: #ffffff;
  overflow-y: hidden;
}

.add_cashier_button {
  position: absolute;
  top: 20%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  background-color: #ffffff;
  overflow-y: hidden;
}

.left-image {
  width: 150px; /* 设置图片宽度 */
  height: auto; /* 自适应高度 */
  margin-right: 10px; /* 图片与文本之间的间距 */
}

/* 其他样式可以根据需要添加 */
</style>