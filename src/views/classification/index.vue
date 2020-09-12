<template>
  <div class="classification">
    <div class="index-search">
      <van-search
        shape="round"
        disabled
        background="#fff"
        placeholder="搜索商品"
        @click="toSearch"
      />
    </div>
    <van-tabs v-model="tabsActive" sticky swipeable @click="onTabsClick">
      <van-tab title="商品">
        <div class="classify-content">
          <van-tree-select height="89vh" :items="items" :active-id.sync="items.activeId" :main-active-index.sync="active" @click-nav="onNavClick">
            <template #content>
              <div class="right-content">
                <img :src="currentImg" alt="" width="100%" @click="toGoodsList(currentId)">
                <div v-for="(item,index) in subCategary" :key="index" class="sub-categary">
                  <div class="sub-name" @click="toGoodsList(item.id)">{{ item.category_name }}</div>
                  <div class="sub-child">
                    <ul>
                      <li v-for="(child,i) in item.children" :key="i" @click="toGoodsList(child.id)">
                        <img :src="child.logo" alt="">
                        <p>{{ child.category_name }}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
          </van-tree-select>
        </div>
      </van-tab>
      <van-tab title="花样">
        <div class="classify-content">
          <van-tree-select height="89vh" :items="figureItems" :active-id.sync="figureItems.activeId" :main-active-index.sync="figureActive" @click-nav="onFigureCategoryNavClick">
            <template #content>
              <div class="content">
                <!-- 花样列表 -->
                <div class="sample-box">
                  <template v-for="(item,index) in figureList">
                    <div :key="index+item.prev_png_path" class="sample-box-item">
                      <img :src="item.prev_png_path" alt="" lazy-load @click="patternDialog(item)">
                      <span v-if="item.is_presell==1" class="corner-mark">{{ '预售' }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </van-tree-select>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { categoryApi } from '@/api/goods'
import { designApi } from '@/api/design'
// import { indexApi } from '@/api/home'
import { Dialog } from 'vant'
export default {
  data() {
    return {
      tabsActive: 0,
      active: 0,
      figureActive: 0,
      currentId: 0,
      currentImg: '',
      items: [],
      figureItems: [
        {
          activeId: '',
          text: '全部',
          image_path: ''
        }
      ],
      categories: [],
      figureCategoryList: [],
      subCategary: [],
      figureCategoryCurrentId: 0,
      figureList: []
    }
  },
  watch: {
    figureCategoryCurrentId: {
      handler(newValue, oldValue) {
        this.getFigure(newValue)
      }
    }
  },
  created() {
    this.currentId = this.$route.query.category_id
    this.figureCategoryCurrentId = this.$route?.query.design_category_id
    if (this.figureCategoryCurrentId) {
      this.tabsActive = 1
    }
    this.getCategoryList()
  },
  methods: {
    onNavClick(e) {
      Object.assign(this.$route.query, { category_id: this.items[e].activeId })
      this.currentId = this.items[e].activeId
      this.currentImg = this.items[e].image_path
      this.subCategary = this.categories[e].children
    },
    // 获取分类列表
    getCategoryList() {
      // indexApi.getIndex().then((res) => {
      //   this.figureCategoryList = res.data.design_category
      //   // 渲染左侧列表
      //   res.data.design_category.map(item => {
      //     this.figureItems.push({
      //       activeId: item.design_category_id,
      //       text: item.design_category_name,
      //       image_path: item.image_path
      //     })
      //   })
      //   if (this.figureCategoryCurrentId) {
      //     res.data.design_category.forEach((element, i) => {
      //       if (element.design_category_id === parseInt(this.figureCategoryCurrentId)) {
      //         this.figureActive = i
      //         return
      //       }
      //     })
      //   } else {
      //     this.figureCategoryCurrentId = ''
      //   }
      // })
      categoryApi.getCategory().then(res => {
        // 渲染左侧列表
        res.data.map(item => {
          this.items.push({
            activeId: item.id,
            text: item.category_name,
            image_path: item.image_path
          })
          this.figureItems.push({
            activeId: item.id,
            text: item.category_name,
            image_path: item.image_path
          })
        })
        if (this.currentId) {
          res.data.forEach((element, i) => {
            if (element.id === parseInt(this.currentId)) {
              this.active = i
              this.currentImg = res.data[i].image_path
              this.subCategary = res.data[i].children
            }
          })
        } else {
          this.currentId = res.data[0].id
          this.currentImg = res.data[0].image_path
          this.subCategary = res.data[0].children
        }
        if (this.figureCategoryCurrentId) {
          res.data.forEach((element, i) => {
            if (element.id === parseInt(this.figureCategoryCurrentId)) {
              this.figureActive = i
              return
            }
          })
        } else {
          this.figureCategoryCurrentId = ''
        }
        this.categories = res.data
        this.figureCategoryList = res.data
      })
    },
    getFigure(design_category_id) {
      designApi.getFigure({
        currentPage: 1,
        pageSize: 1000,
        design_category_id
      }).then(res => {
        this.figureList = res.data.data
      })
    },
    toSearch() {
      this.$router.push({ path: `/goodsList` })
    },
    // 前往搜索页面
    toGoodsList(id, category_id) {
      this.$router.push({ path: `/goodsList?category_id=${id}` })
    },
    // tab 切换
    onTabsClick(value) {
      this.tabsActive = value
    },
    // 点击花样
    patternDialog(item) {
      Dialog.confirm({
        title: '提示',
        message: item.is_presell ? '该花样正在预售中' : '请先选择定制商品，再选择定制花样。',
        confirmButtonText: item.is_presell ? '确定' : '选择商品',
        confirmButtonColor: '#df2525'
      }).then(() => {
        console.log(this.figureCategoryCurrentId)
        !item.is_presell && this.$router.push({ path: '/goodsList', query: { design_id: item.design_id }})
      }).catch(() => {
      })
    },
    // 花样类别切换
    onFigureCategoryNavClick(value) {
      this.figureCategoryCurrentId = this.figureCategoryList[value - 1]?.id || ''
      this.figureActive = value
    }
  }
}
</script>

<style lang="scss" scoped>
.classification {
  height: 100vh;
  overflow: hidden;
}
.classify-content{
 .right-content{
   padding: 0 10px;
    img{
      width: 100%;
      height: 110px;
      border-radius: 5px;
      object-fit: cover;
    }
    .sub-categary{
      padding: 5px 0;
      .sub-name{
        padding: 8px 0;
        color: #333;
        font-size: 14px;
      }
      .sub-child{
        ul{
          display: flex;
          align-items: center;
          flex-flow: wrap;
          li{
            width: 25%;
            margin-right: 12%;
            img{
              width: 100%;
              height: 58px;
            }
            p{
              margin: 2px 0;
              font-size: 12px;
              text-align: center;
            }
          }
          li:nth-child(3n){
              margin: 0;
            }
        }
      }
    }
  }
}
.van-tabs__wrap {
  margin-bottom: 5px !important;
  box-shadow: 0px 5px 5px 0 rgba(100, 100,100,0.1) !important;
}
.van-tree-select {
  padding-top: 4px !important;
}
.van-tree-select__content {
  box-sizing: border-box;
  padding-bottom: 65px;
}
.sample-box{
  display: flex;
  flex-flow: wrap;
  align-items: center;
  background: #fff;
  padding-top: 10px;
  &-item{
    width:40%;
    border: 1px solid #f5f5f5;
    box-shadow: 0px 10px 20px #f3f3f3;
    margin: 0 5% 15px;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    img{
      width: 90%;
      border-radius: 6px;
      display: block;
    }
    .corner-mark{
      position: absolute;
      left: -3px;
      top: -1px;
      background: #ff2828;
      padding: 3px;
      border-radius: 6px 0 6px 0 ;
      font-size: 10px;
      color: #fff;
      transform: scale(0.8);
      display: inline-block;
    }
  }
}
</style>
