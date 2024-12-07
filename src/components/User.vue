<template>
  <div class="main">

    <el-container>
      <el-header class="title">
        <div style="margin-top: 12px; display: inline-block;">
          <span style="font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">Price Comparator</span>
          <span style="margin-left :30px; font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">用户您好！</span>
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
          <el-button type="primary" style="margin-top: 12px; padding-right: 10px;" @click="DeleteToken">
            <span style="font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: normal;">登出</span>
          </el-button>
        </RouterLink>
      </el-header>

      <div style="width:30%;margin:0 auto; padding-top:5vh;">

        <el-input v-model="this.searchProduct" style="display:inline; " placeholder="输入要查询的商品">
          <template #append>
            <el-button type="primary" @click="SearchProduct">查询</el-button>
          </template>
        </el-input>

      </div>


      <el-container>
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
                <template v-slot="scope">
                  {{ scope.row.price }}￥
                </template>
              </el-table-column>
              <el-table-column prop="platform" label="平台">
              </el-table-column>
              <el-table-column  label="点击收藏该商品">
                <template v-slot ="scope">
                  <el-button type="normal" @click = "this.favoriteProductId = scope.row.id, favoriteProduct()">
                    收藏</el-button>
<!--                  <el-button type="danger" v-model="deleteCashierVisible" @click = "this.deleteCashierInfo.cashierId = scope.row.cashierId, this.deleteCashierInfo.cashierName = scope.row.cashierName,-->
<!--        this.deleteCashierInfo.idNumber = scope.row.idNumber, this.deleteCashierInfo.phoneNumber = scope.row.phoneNumber, this.deleteCashierInfo.address = scope.row.address,-->
<!--        this.deleteCashierInfo.privilege = scope.row.privilege,-->
<!--        deleteCashierVisible = true">删除</el-button>-->
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
      </el-container>
    </el-container>

    <el-dialog v-model = "priceHistoryVisible" title="价格历史">
      <div>
        <el-card>
          <LineChart :chartData="prices" :chartLabel="dates" />
        </el-card>
      </div>
    </el-dialog>

    <el-dialog v-model = "discountProductListVisible" title="您收藏的商品降价啦！" :fullscreen="true">
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

<!--    <el-dialog v-model="modifyCashierVisible" title="修改出纳员信息">-->
<!--      <el-form-->
<!--          :label-position="left"-->
<!--          label-width="auto"-->
<!--          :model="modifyCashierInfo"-->
<!--          style="max-width: 600px"-->
<!--      >-->
<!--        <el-form-item label="姓名">-->
<!--          <el-input v-model="modifyCashierInfo.cashierName" placeholder="请输入姓名"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="身份证号">-->
<!--          <el-input v-model="modifyCashierInfo.idNumber" placeholder="请输入身份证号"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="电话号码">-->
<!--          <el-input v-model="modifyCashierInfo.phoneNumber" placeholder="请输入电话号码"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="地址">-->
<!--          <el-input v-model="modifyCashierInfo.address" placeholder="请输入地址"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="出纳员权限">-->
<!--          <br>-->
<!--          <el-select v-model= "modifyCashierInfo.privilege" placeholder="请选择权限">-->
<!--            <el-option label="A" value="A"></el-option>-->
<!--            <el-option label="B" value="B"></el-option>-->
<!--            <el-option label="C" value="C"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--                <span class="dialog-footer">-->
<!--                    <el-button @click="modifyCashierVisible = false">取消</el-button>-->
<!--                    <el-button type="primary" @click="ConfirmModifyCashier">-->
<!--                        确认-->
<!--                    </el-button>-->
<!--                </span>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import LineChart from "@/components/LineChart.vue";

export default {
  components: {LineChart},
  data() {
    return {
      addCashierVisible : false,
      modifyCashierVisible :false,
      deleteCashierVisible : false,
      priceHistoryVisible : false,
      discountProductListVisible : false,
      searchProduct : '',
      favoriteProductId : '',
      favoriteEmail: '',
      showPriceHistoryProductId : '',
      formItems1 :{
        cashierName :'',
        idNumber : '',
        phoneNumber :'',
        address : '',
        password : '',
        privilege : '',
      },
      modifyCashierInfo :{
        cashierId : 0,
        cashierName :'',
        idNumber : '',
        phoneNumber :'',
        address : '',
        password : '',
        privilege : '',
      },
      deleteCashierInfo :{
        cashierId : 0,
        cashierName :'',
        idNumber : '',
        phoneNumber :'',
        address : '',
        password : '',
        privilege : '',
      },

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
    favoriteProduct(){
      console.log(this.favoriteProductId)
      console.log(sessionStorage.getItem("token"))
      this.favoriteEmail = sessionStorage.getItem("token")
      axios.post("/user/addFavorites", {
        productId: this.favoriteProductId,
        email: this.favoriteEmail
      })
          .then(response => {
            if(response.data.code == 1){
              ElMessage.success("收藏成功")
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    },

    SearchProduct(){
      ElMessage.success("正在搜索商品，这可能会花费一分钟左右的时间，请耐心等待~");
      this.productList = [];
      sessionStorage.removeItem('productList');
      axios.get("/user/searchProducts", {
        params: {
          productName: this.searchProduct
        }
      })
          .then(response => {
            //console.log(response.data)
            if (response.data.code === 1) {
              this.productList = response.data.payload;
              sessionStorage.setItem('productList', JSON.stringify(this.productList));
              ElMessage.success("搜索完毕，共找到" + this.productList.length + "个商品");
            }
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
              this.priceHistoryVisible = true
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    },

    DeleteToken(){
      sessionStorage.clear()
    }
  },
  beforeDestroy() {
    sessionStorage.setItem('productList', JSON.stringify(this.productList));
  },
  mounted() {
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

.transparent-button {
  background-color: transparent; /* 设置背景为透明 */
  border: none; /* 去掉边框 */
  color: #000; /* 设置字体颜色，可以根据需要调整 */
  cursor: pointer; /* 鼠标悬停时显示手形光标 */
  padding: 10px 20px; /* 设置内边距 */
  font-size: 16px; /* 设置字体大小 */
}

/* 其他样式可以根据需要添加 */
</style>