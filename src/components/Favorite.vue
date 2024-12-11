<template>
  <div class="main">
    <el-container>
      <el-header class="title" v-if="!isMobile">
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

      <el-header class="title" v-if="isMobile">
        <div style="margin-top: 12px; display: inline-block;">
          <span style="font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">Price Comparator</span>
          <RouterLink to="/login">
            <el-button type="primary" style="margin-left: 40px; margin-top: 6px; padding-right: 10px;" @click="DeleteToken">
              <span style="font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: normal;">登出</span>
            </el-button>
          </RouterLink>
        </div>
      </el-header>

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

      <el-main v-if="!isMobile">
        <el-card title="商品列表" class="product_table">
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
                <template v-slot="scope">
                  {{ scope.row.price }}￥
                </template>
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

      <el-container v-if="isMobile">
        <el-scrollbar height="600px">
          <div class="card-box" v-for="product in productList" v-if="isMobile">
            <div>
              <img :src="product.imageUrl || defaultImage" alt="图片" class="inbox-image" />
              <el-divider />
              <div>
                <a :href="product.link" target="_blank">{{ product.name }}</a>
              </div>
              <div style="margin-left: 10px; text-align: start; font-size: 16px;">
                <p style="padding: 2.5px;"><span style="font-weight: bold;">价格：</span>{{ product.price }}￥</p>
                <p style="padding: 2.5px;"><span style="font-weight: bold;">平台：</span>{{ product.platform }}</p>
              </div>
            </div>
            <div class="button-container">
              <button class="collect-button" @click = "this.favoriteProductId = product.id, deleteFavoriteVisible = true">
                取消收藏
              </button>
              <button class="history-button" @click = "this.showPriceHistoryProductId = product.id, GetProductPriceHistory()">
                查看历史价格
              </button>
            </div>
          </div>
        </el-scrollbar>
      </el-container>

      <el-footer class="footer" v-if="isMobile">
        <div class="footer-content">
          <RouterLink to="/user">
            <el-button type="text" class="footer-button">
              <el-icon><Search /></el-icon>
            </el-button>
          </RouterLink>
          <el-button type="text" class="footer-button">
            <el-icon><StarFilled /></el-icon>
          </el-button>
          <RouterLink to="/personalInfo">
            <el-button type="text" class="footer-button">
              <el-icon><UserFilled /></el-icon>
            </el-button>
          </RouterLink>
        </div>
      </el-footer>
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

    <el-dialog v-model = "priceHistoryVisible" title="价格历史" :fullscreen="true">
      <div>
        <el-card>
          <LineChart :chartData="prices" :chartLabels="dates" />
        </el-card>
      </div>
    </el-dialog>

    <el-dialog v-model = "discountProductListVisible" title="您收藏的商品降价啦！" :fullscreen="true" v-if="!isMobile">
      <el-card title="您收藏的商品降价啦！" class="product_table" >
        <el-scrollbar height="600px">
          <el-table :data="discountProductList">
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
            <el-table-column prop="price" label="当前价格">
              <template v-slot="scope">
                <span style="color: red; font-weight: bold; font-size: large;">
                  {{ scope.row.price }} ￥
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="previousPrice" label="之前价格">
              <template v-slot="scope">
                {{ scope.row.previousPrice }}￥
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台">
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-card>
    </el-dialog>

    <el-dialog title="您收藏的商品降价啦！" :fullscreen="true" v-if="isMobile">
      <el-card title="您收藏的商品降价啦！" class="product_table" >
        <el-scrollbar height="600px">
          <div class="card-box" v-for="product in discountProductList" v-if="isMobile">
            <div>
              <img :src="product.imageUrl" alt="图片" class="inbox-image" />
              <el-divider />
              <div>
                <a :href="product.link" target="_blank">{{ product.name }}</a>
              </div>
              <div style="margin-left: 10px; text-align: start; font-size: 16px;">
                <p style="padding: 2.5px;"><span style="font-weight: bold;">之前价格：</span> <span style="color: red; font-weight: bold; font-size: large;">{{ product.previousPrice }}￥</span></p>
                <p style="padding: 2.5px;"><span style="font-weight: bold;">现在价格：</span> <span style="color: red; font-weight: bold; font-size: large;">{{ product.price }}￥</span></p>
                <p style="padding: 2.5px;"><span style="font-weight: bold;">平台：</span>{{ product.platform }}</p>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import LineChart from "@/components/LineChart.vue";
import {detectDevice} from "@/device.js";
import defaultImage from '@/assets/淘宝图标.png';
import {Search, Star, User, StarFilled, UserFilled} from "@element-plus/icons-vue"; // 引入默认图片
//import echarts from "echarts";

export default {
  components: {Search, Star, LineChart, User, StarFilled, UserFilled},
  data() {
    return {
      defaultImage: defaultImage,
      isMobile: false,
      deleteFavoriteVisible: false,
      priceHistoryVisible: false,
      discountProductListVisible : false,

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
      }],

      favoriteInfo:{
        productId: '',
        email: ''
      },

      imageUrlList:[

      ],

      prices:[

      ],

      dates:[

      ]

    };
  },
  methods: {
    DeleteFavorite(){
      this.favoriteEmail = sessionStorage.getItem("token")
      axios.post("/user/deleteFavorites", {
        productId: this.favoriteProductId,
        email: this.favoriteEmail
      })
          .then(response => {
            if(response.data.code == 1){
              ElMessage.success("取消收藏成功")
              this.GetFavorites()
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
  created() {
    if(detectDevice() === "mobile") {
      this.isMobile = true;
    }
  },
  mounted() {
    if(detectDevice() === "mobile") {
      this.isMobile = true;
    }
    this.GetFavorites();
    if(sessionStorage.getItem('discountProductList') != null){
      this.discountProductList = JSON.parse(sessionStorage.getItem('discountProductList'));
      if(this.discountProductList.length > 0){
        this.discountProductListVisible = true;
      }
      sessionStorage.removeItem('discountProductList');
    }
    this.productList = JSON.parse(sessionStorage.getItem('productList'));
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

.left-image {
  width: 150px; /* 设置图片宽度 */
  height: auto; /* 自适应高度 */
  margin-right: 10px; /* 图片与文本之间的间距 */
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

.card-box {
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  margin-top: 40px;
  margin-left: 27.5px;
  margin-right: 10px;
  padding: 7.5px;
  padding-right: 10px;
  padding-top: 15px;
}

.inbox-image {
  width: 240px; /* 设置图片宽度 */
  height: auto; /* 自适应高度 */
  margin-right: 10px; /* 图片与文本之间的间距 */
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.collect-button, .history-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.collect-button {
  background-color: #4CAF50; /* 绿色 */
  color: white;
}

.history-button {
  background-color: #2196F3; /* 蓝色 */
  color: white;
}

/* 其他样式可以根据需要添加 */
</style>