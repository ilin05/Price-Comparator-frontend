<template>
  <div class="main">

    <el-container>
      <el-header class="title" v-if="!isMobile">
        <div style="margin-top: 12px; display: inline-block;">
          <span style="font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">Price Comparator</span>
          <span style="margin-left :30px; font-size: large; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: bold;">用户 {{this.user.name}} 您好！</span>
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
            <Star />
          </el-icon>
          <RouterLink to="/myFootprints">
            <button class="transparent-button">
              <span style="margin-left: 40px; font-size: medium; font-family: 'Microsoft YaHei'; color: #ffffff; font-weight: lighter">我的足迹</span>
            </button>
          </RouterLink>
          <el-icon style="color: #ffffff; margin-left: 5px">
            <Clock />
          </el-icon>
        </div >
        <div class="avatar-container">
          <el-popover
              ref="popover"
              placement="bottom"
              :width="300"
              trigger="hover"
          >
            <template #reference>
              <el-avatar :icon="UserFilled" />
            </template>
            <p>我的信息</p>
            <p><strong>用户名:</strong> {{ this.user.name }}</p>
            <p><strong>邮箱:</strong> {{ this.user.email }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="modifyPasswordVisible = true">修改密码</el-button>
              <el-button size="small" text @click="modifyUserNameVisible = true">修改用户名</el-button>
              <RouterLink to="/login">
                <el-button size="small" type="primary" style="margin-left: 12px" @click="DeleteToken">登出</el-button>
              </RouterLink>
            </div>
          </el-popover>
        </div>
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

<!--      一级分类：categories-->
      <div class="m-4" style="margin-left: 20px;">
        <p>选择商品类别</p>
        <el-cascader :options="options" :props="props1" clearable @change="filterProducts" />
      </div>

      <el-container v-if="!isMobile">
        <el-card title="商品列表" class="product_table">
          <el-scrollbar height="600px">
            <el-table :data="filteredProductList">
              <el-table-column prop = "" lable = "图片" width="200">
                <template v-slot="scope">
                  <img :src="scope.row.imageUrl || defaultImage" alt="图片" class="left-image" />
                  <!--                  <el-image preview-teleported :preview-src-list="imageUrlList"/>-->
                </template>
              </el-table-column>
              <el-table-column prop="name" label="描述">
                <template v-slot="scope">
                  <a :href="scope.row.link" target="_blank">{{ scope.row.name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格">
                <template v-slot:header>
                  <span>价格</span>
                  <el-icon @click="sortPriceAsc" style="cursor: pointer; margin-left: 5px;">
                    <ArrowUp />
                  </el-icon>
                  <el-icon @click="sortPriceDesc" style="cursor: pointer; margin-left: 5px;">
                    <ArrowDown />
                  </el-icon>
                </template>
                <template v-slot="scope">
                  {{ scope.row.price }}￥
                </template>
              </el-table-column>
              <el-table-column label="平台">
                <template v-slot:header>
                  <span>平台</span>
                  <el-select v-model="selectedPlatform" placeholder="筛选" @change="filterByPlatform" style="margin-left: 10px; width: 100px;">
                    <el-option v-for="platform in platforms" :key="platform.value" :label="platform.label" :value="platform.value"></el-option>
                  </el-select>
                </template>
                <template v-slot="scope">
                  {{ scope.row.platform }}
                </template>
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

      <el-container v-if="isMobile">
        <el-scrollbar height="600px">
          <div class="card-box" v-for="product in filteredProductList" v-if="isMobile">
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
              <button class="collect-button" @click = "this.favoriteProductId = product.id, favoriteProduct()">
                收藏
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
          <RouterLink to="/favorites">
            <el-button type="text" class="footer-button">
              <el-icon><StarFilled /></el-icon>
            </el-button>
          </RouterLink>
          <el-button type="text" class="footer-button">
            <el-icon><Clock /></el-icon>
          </el-button>
          <RouterLink to="/personalInfo">
            <el-button type="text" class="footer-button">
              <el-icon><UserFilled /></el-icon>
            </el-button>
          </RouterLink>
        </div>
      </el-footer>
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
          <el-input type="password" v-model="modifyPasswordInfo.newPassword" placeholder="请输入新密码" required minlength="6"/>
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
          <el-input v-model="modifyUserNameInfo.newUserName" placeholder="请输入新的用户名" required minlength="4"/>
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
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import LineChart from "@/components/LineChart.vue";
import {detectDevice} from "@/device.js";
import defaultImage from '@/assets/淘宝图标.png'; // 引入默认图片
import {UserFilled, Star, Reading, Clock} from '@element-plus/icons-vue';
const props = {
  checkStrictly: true,
}
const platforms=[
  {
    value: '淘宝',
    label: '淘宝'
  },
  {
    value: '苏宁易购',
    label: '苏宁易购'
  },
  {
    value: '唯品会',
    label: '唯品会'
  },
  {
    value: '小米有品',
    label: '小米有品'
  }
]
const options = [
  {
    value: '服装与配饰',
    label: '服装与配饰',
    children: [
      {
        value: '男装',
        label: '男装'
      },
      {
        value: '女装',
        label: '女装'
      },
      {
        value: '配饰',
        label: '配饰'
      }
    ]
  },
  {
    value: '电子产品',
    label: '电子产品',
    children: [
      {
        value: '手机与配件',
        label: '手机与配件'
      },
      {
        value: '电脑与配件',
        label: '电脑与配件'
      },
      {
        value: '家用电器',
        label: '家用电器'
      },
      {
        value: '摄影与摄像',
        label: '摄影与摄像'
      }
    ]
  },
  {
    value: '家居与生活',
    label: '家居与生活',
    children: [
      {
        value: '家具',
        label: '家具'
      },
      {
        value: '家纺',
        label: '家纺'
      },
      {
        value: '厨房用品',
        label: '厨房用品'
      },
      {
        value: '清洁用品',
        label: '清洁用品'
      }
    ]
  },
  {
    value: '美妆与个人护理',
    label: '美妆与个人护理',
    children: [
      {
        value: '护肤品',
        label: '护肤品'
      },
      {
        value: '彩妆',
        label: '彩妆'
      },
      {
        value: '个人护理',
        label: '个人护理'
      }
    ]
  },
  {
    value: '食品与饮料',
    label: '食品与饮料',
    children: [
      {
        value: '零食',
        label: '零食'
      },
      {
        value: '饮料',
        label: '饮料'
      },
      {
        value: '生鲜食品',
        label: '生鲜食品'
      }
    ]
  },
  {
    value: '运动与户外',
    label: '运动与户外',
    children: [
      {
        value: '运动服装',
        label: '运动服装'
      },
      {
        value: '健身器材',
        label: '健身器材'
      },
      {
        value: '户外装备',
        label: '户外装备'
      }
    ]
  },
  {
    value: '母婴用品',
    label: '母婴用品',
    children: [
      {
        value: '婴儿服装',
        label: '婴儿服装'
      },
      {
        value: '婴儿用品',
        label: '婴儿用品'
      },
      {
        value: '孕妇用品',
        label: '孕妇用品'
      }
    ]
  },
  {
    value: '图书与文具',
    label: '图书与文具',
    children: [
      {
        value: '图书',
        label: '图书'
      },
      {
        value: '文具',
        label: '文具'
      }
    ]
  },
  {
    value: '汽车与配件',
    label: '汽车与配件',
    children: [
      {
        value: '汽车',
        label: '汽车'
      },
      {
        value: '汽车配件',
        label: '汽车配件'
      }
    ]
  },
  {
    value: '宠物用品',
    label: '宠物用品',
    children: [
      {
        value: '宠物食品',
        label: '宠物食品'
      },
      {
        value: '宠物用品',
        label: '宠物用品'
      }
    ]
  },
  {
    value: '礼品与定制',
    label: '礼品与定制',
    children: [
      {
        value: '礼品',
        label: '礼品'
      },
      {
        value: '定制产品',
        label: '定制产品'
      }
    ]
  }
]

export default {
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  components: {
    Clock,
    LineChart,
    UserFilled,
    Reading,
    Star
  },
  data() {
    return {
      filteredProductList: [], // Add this line
      props1: props,
      options: options,
      platforms: platforms,
      defaultImage: defaultImage,
      isMobile: false,
      modifyPasswordVisible :false,
      modifyUserNameVisible : false,
      priceHistoryVisible : false,
      discountProductListVisible : false,
      searchProduct : '',
      favoriteProductId : '',
      favoriteEmail: '',
      showPriceHistoryProductId : '',
      passwordMismatch: false,
      selectedPlatform: '',
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      modifyPasswordInfo :{
        oldPassword : '',
        newPassword : '',
        newPasswordAgain : ''
      },
      modifyUserNameInfo :{
        newUserName: '',
        password: '',
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

      imageUrlList:[

      ],

      prices:[

      ],

      dates:[

      ],
    };
  },
  methods: {
    getAllProducts(){
      axios.get("/user/getAllProducts")
          .then(response => {
            if(response.data.code === 1){
              this.productList = response.data.payload;
              this.filteredProductList = this.productList;
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
          })
    },

    favoriteProduct(){
      console.log(this.favoriteProductId)
      console.log(sessionStorage.getItem("token"))
      this.favoriteEmail = sessionStorage.getItem("token")
      axios.post("/user/addFavorites", {
        productId: this.favoriteProductId,
        email: this.favoriteEmail
      })
          .then(response => {
            if(response.data.code === 1){
              ElMessage.success("收藏成功")
            }else{
              ElMessage.error(response.data.message)
            }
          })
          .catch(error => {
            ElMessage.error("出现故障")
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
      if(this.modifyUserNameInfo.newUserName === ''){
        ElMessage.error("新用户名不能为空");
        return;
      }
      if(this.modifyUserNameInfo.password === ''){
        ElMessage.error("请输入密码");
        return;
      }
      if(this.modifyUserNameInfo.newUserName.length < 4){
        ElMessage.error("新用户名长度不能小于4");
        return;
      }
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
    },

    filterProducts(selected) {
      if (selected.length === 1) {
        this.filteredProductList = this.productList.filter(product => product.category.includes(selected[0]));
      } else if (selected.length === 2) {
        const selectedCategory = `${selected[0]}-${selected[1]}`;
        console.log(selectedCategory);
        this.filteredProductList = this.productList.filter(product => product.category.includes(selectedCategory));
      } else {
        this.filteredProductList = this.productList;
      }
    },

    filterByPlatform() {
      if (this.selectedPlatform) {
        this.filteredProductList = this.productList.filter(product => product.platform === this.selectedPlatform);
      } else {
        this.filteredProductList = this.productList;
      }
    },

    sortPriceAsc() {
      this.filteredProductList.sort((a, b) => a.price - b.price);
    },
    sortPriceDesc() {
      this.filteredProductList.sort((a, b) => b.price - a.price);
    }
  },
  created() {
    this.getAllProducts()
    if(detectDevice() === "mobile") {
      this.isMobile = true;
    }
    // console.log(detectDevice())
  },
  mounted() {
    if(detectDevice() === "mobile") {
      this.isMobile = true;
    }
    this.user.name = sessionStorage.getItem("userName");
    this.user.email = sessionStorage.getItem("token");
    this.$watch('modifyPasswordInfo.newPassword', this.CheckPasswordMatch);
    this.$watch('modifyPasswordInfo.newPasswordAgain', this.CheckPasswordMatch);
    if(sessionStorage.getItem('discountProductList') != null){
      this.discountProductList = JSON.parse(sessionStorage.getItem('discountProductList'));
      if(this.discountProductList.length > 0){
        this.discountProductListVisible = true;
      }
      sessionStorage.removeItem('discountProductList');
    }
    this.getAllProducts();
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

.product_table {
  position: absolute;
  top: 18%;
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

.avatar-container {
  display: inline-block;
  margin-left: 20px;
}

/* 其他样式可以根据需要添加 */
</style>