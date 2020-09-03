<template>
  <div class="goods-detail">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar />
    </div>
    <div class="goods-content">
      <!-- 商品图片 -->
      <div class="goods-images">
        <van-swipe @change="onChange">
          <van-swipe-item v-for="(item, index) in goodsDetail.images" :key="item">
            <img :src="item" alt="" @click="preview(index)">
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/{{ goodsDetail.images.length }}
            </div>
          </template>
        </van-swipe>
      </div>
      <!-- 基础信息 -->
      <div class="goods-info">
        <div class="goods-price">
          ￥<span class="current-price">{{ parseFloat(goodsDetail.current_price).toFixed(2) }}</span>
          <span class="old-price">￥{{ parseFloat(goodsDetail.old_price).toFixed(2) }}</span>
          <span class="sale-num">{{ goodsDetail.sale_num }}人付款</span>
        </div>
        <div class="goods-name">
          <p>{{ goodsDetail.name }}</p>
          <span>{{ goodsDetail.desc }}</span>
        </div>
      </div>
      <!-- 商品规格选择 -->
      <div class="goods-cell">
        <div class="cell-item" @click="changeSkuShow">
          <span class="cell-title">已选</span>
          <span class="cell-content">{{ checkedSku }}</span>
          <span class="right-arrow"><svg-icon icon-class="right-arrow" /></span>
        </div>
      </div>
      <!-- sku容器 -->
      <div class="sku-box">
        <van-action-sheet v-model="showSku" title="选择规格">
          <div class="content">
            <div v-if="skuItem" class="sku-info">
              <img :src="skuItem.images?skuItem.images:goodsDetail.thumb_image_path" width="96" height="96" alt="">
              <div class="right-info">
                <p class="price" :style="{textDecoration: is_batch ? 'line-through' : 'none'}">￥{{ skuItem.current_price }}</p>
                <p v-if="is_batch" class="batch-price"><span :style="{color: '#ee0a24'}">￥{{ batchPrice }}</span> <br>  已达 {{ batchNumber }} 件, 享受批量定制价格 </p>
                <p>剩余{{ skuItem.num }}</p>
                <p>已选：<span v-for="item in skuItem.skus" :key="item.k+item.v">{{ item.k }}:{{ item.v }}  </span>{{ skuItem.checked }}</p>
              </div>
            </div>
            <div class="goods-number">
              <van-cell title="选择数量">
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template>
                  <van-stepper v-model="goodsNumber" :min="1" :max="skuItem.num?skuItem.num: goodsDetail.sum_stock" input-width="30px" button-size="22px" />
                </template>
              </van-cell>
            </div>
            <div class="sku-list">
              <div v-for="(item,index) in skudata" :key="item.id + '_id'" class="sku-item">
                <span class="sku-item-name">{{ item.value }}:</span>
                <div v-if="showSku" class="sku-item-attr">
                  <span v-for="attr in item.leaf" :key="attr.id" :class="{'active':activeSku[index].option&&activeSku[index].option.id === attr.id}" class="attr-name" @click="selectSku(index, attr)">{{ attr.value }}</span>
                </div>
              </div>
            </div>
            <div class="goods-adction">
              <van-goods-action>
                <van-goods-action-button
                  v-if="goodsDetail.is_custom==1 && skuCustom==1"
                  type="warning"
                  text="立即定制"
                  :disabled="skuItem.num==0"
                  @click="skutoCustomized"
                />
                <van-goods-action-button
                  v-else
                  type="warning"
                  text="加入购物车"
                  :disabled="skuItem.num==0"
                  @click="skuAddCart"
                />
                <van-goods-action-button
                  type="danger"
                  text="立即购买"
                  :disabled="skuItem.num==0"
                  @click="skuBuy"
                />
              </van-goods-action>
            </div>
          </div>
        </van-action-sheet>
      </div>
      <!-- 商品详情 -->
      <div class="detail">
        <div class="title">商品详情</div>
        <div class="content" v-html="goodsDetail.detail" />
      </div>
      <!-- 底部操作 -->
      <div class="goods-adction">
        <van-goods-action>
          <van-goods-action-icon icon="wap-home-o" text="首页" @click="pathTo('/')" />
          <van-goods-action-icon icon="cart-o" text="购物车" @click="pathTo('/cart')" />
          <van-goods-action-button
            v-if="is_presell"
            color="#c8c9cc"
            text="商品预售中"
            disabled
          />
          <template v-else>
            <van-goods-action-button
              v-if="goodsDetail.is_custom==0"
              type="warning"
              text="加入购物车"
              :disabled="skuItem.num==0"
              @click="addCart"
            />
            <van-goods-action-button
              v-if="goodsDetail.is_custom==1"
              type="warning"
              text="立即定制"
              :disabled="skuItem.num==0"
              @click="toCustomized(1)"
            />
            <van-goods-action-button
              type="danger"
              text="立即购买"
              :disabled="skuItem.num==0"
              @click="buyNow(0)"
            />
          </template>
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { goodsApi } from '@/api/goods'
import { ImagePreview, Toast } from 'vant'
import { shopCart } from '@/utils/shopCart'
import store from '@/store'
import wechatInterface from '@/utils/wxUtils'
import { wxSdkApi } from '@/api/common'
export default {
  beforeRouteEnter(to, from, next) {
    if (from.name === 'DesginPreview') {
      next((_self) => {
        _self.isPreviewPage = true
      })
    }
    next()
  },
  beforeRouteLeave(to, from, next) {
    if (this.isPreviewPage && to.name !== 'Index') {
      next('/')
    }
    next()
  },
  components: {
    TopBar
  },
  data() {
    return {
      current: 0, // 轮播图当前位
      checkedSku: '请选择规格', // sku-cell文字
      showSku: false, // 是否显示sku
      share: false, // 是否显示分享
      goodsDetail: {
        images: []
      }, // 商品详情
      skuList: [], // sku值列表-
      skudata: [], // sku选项列表
      activeSku: [], // 选中的sku
      skuItem: {}, // 选中sku详细
      checkedSkuIds: '', // 选中sku组合id
      goodsNumber: 1, // 购买数量
      id: this.$route.query.goods_id,
      skuCustom: 0,
      instance: {},
      design_id: '',
      is_presell: false,
      is_batch: false,
      isPreviewPage: false, // 上一个页面是否是预览页
      batchNumber: 0,
      batchPrice: 0,
      item_price_template: []
    }
  },
  watch: {
    goodsNumber: {
      handler(newValue, oldValue) {
        this.item_price_template.forEach(item => {
          if (newValue >= Number(item.number)) {
            this.is_batch = true
            this.batchNumber = item.number
            this.batchPrice = Number(item.price) || 0
          }
        })
      }
    },
    skudata: {
      deep: true,
      immediate: true,
      handler(val) {
        this.activeSku = val.map(item => ({
          spec: { value: item.value, id: item.id },
          option: {}
        }))
      }
    },
    // 监听选中的sku数组
    activeSku: {
      deep: true,
      immediate: true,
      handler(val) {
        // 组合选中的skuid
        this.checkedSkuIds = this.activeSku.reduce((total, prev, index) =>
          `${total}${prev.spec.id}-${prev.option.id}${index === this.activeSku.length - 1 ? '' : '_'}`, ''
        )
      }
    },
    // 监听选中的skuids
    checkedSkuIds: {
      deep: true,
      immediate: true,
      handler(val) {
        const arr = []
        this.skuList.map(item => {
          if (item.sku_id === this.checkedSkuIds) {
            this.skuItem = item
            this.checkedSku = item.skus.reduce((total, prev, index) =>
              `${total}"${prev.v}" `, ''
            )
          }
          arr.push(item.sku_id)
        })
        if (arr.indexOf(this.checkedSkuIds) < 0) {
          this.checkedSku = '请选择规格'
          this.skuItem = {
            current_price: this.goodsDetail.current_price,
            num: this.goodsDetail.sum_stock,
            images: this.goodsDetail.thumb_image_path
          }
        }
      }
    }
  },

  created() {
    this.goodsId = this.$route.query.goods_id
    const { design_id } = this.$route.query || {}

    this.fetchData(this.goodsId)
    this.design_id = design_id
  },
  methods: {
    // 获取商品详情
    fetchData(id) {
      goodsApi.getGoodsDetail({
        id: id
      }).then(res => {
        if (res.code === 0 && res.data) {
          this.goodsDetail = res.data
          this.goodsDetail.images = JSON.parse(res.data.images)
          this.skuList = JSON.parse(res.data.sku_list)
          this.skudata = JSON.parse(res.data.sku_show)
          this.skuItem.current_price = res.data.current_price
          this.skuItem.num = res.data.sum_stock
          this.skuItem.images = res.data.thumb_image_path
          this.is_presell = res.data.is_presell || false
          this.item_price_template = JSON.parse(res.data.item_price_template || '[]')
          // 调用微信分享
          this.wxShare()
        } else {
          Toast('网络错误!')
        }
      })
    },
    // 滑动切换轮播
    onChange(index) {
      this.current = index
    },
    // 预览图片
    preview(i) {
      this.instance = ImagePreview({
        images: this.goodsDetail.images,
        startPosition: i,
        closeOnPopstate: true
      })
    },
    // 显示sku列表
    changeSkuShow() {
      this.showSku = !this.showSku
    },
    // 选择skuitem
    selectSku(index, option) {
      if (this.activeSku[index].option && this.activeSku[index].option.id === option.id) {
        this.activeSku[index].option = {}
        return
      }
      this.activeSku[index].option = option
    },
    // 页面路由跳转
    pathTo(path) {
      this.$router.push({ path: path })
    },
    // 加入购物车/立即购买按钮点击
    addCart() {
      if (!this.skuItem.sku_id) {
        this.changeSkuShow()
      } else {
        this.skuItem.number = this.goodsNumber
        this.skuItem.goods_info = this.goodsDetail
        this.skuItem.shopping_type = 1
        const cartList = shopCart.getItem() ? JSON.parse(shopCart.getItem()) : []
        const arr = []
        // 获取当前购物车的sku_id数组
        cartList.map(item => {
          arr.push(item.sku_id)
        })
        // 判断选中的sku是否已村子购物车数组中
        const index = arr.indexOf(this.skuItem.sku_id)
        if (index < 0) {
          cartList.push(this.skuItem)
        } else {
          cartList[index].number += this.goodsNumber
        }
        shopCart.setItem(JSON.stringify(cartList))
        Toast('添加成功！')
        this.changeSkuShow()
      }
    },
    // 立即购买
    buyNow(type) {
      this.skuCustom = type
      if (!this.skuItem.sku_id) {
        this.changeSkuShow()
      } else {
        const cartList = []
        cartList.push({
          sku_id: this.skuItem.sku_id ? this.skuItem.sku_id : 0,
          item_id: this.goodsDetail.id,
          buy_num: this.goodsNumber,
          shopping_type: 1
        })
        store.dispatch('order/setCartList', JSON.stringify(cartList)).then(() => {
          this.$router.push({ path: '/orderConfirm' })
        })
      }
    },
    // sku添加购物车按钮
    skuAddCart() {
      if (!this.skuItem.sku_id && this.skuList.length > 0) {
        Toast('请选择规格')
      } else {
        this.skuItem.number = this.goodsNumber
        this.skuItem.goods_info = this.goodsDetail
        const cartList = shopCart.getItem() ? JSON.parse(shopCart.getItem()) : []
        const arr = []
        // 获取当前购物车的sku_id数组
        cartList.map(item => {
          arr.push(item.sku_id)
        })
        // 判断选中的sku是否已存在购物车数组中
        const index = arr.indexOf(this.skuItem.sku_id)
        if (index < 0) {
          cartList.push(this.skuItem)
        } else {
          cartList[index].number += this.goodsNumber
        }
        shopCart.setItem(JSON.stringify(cartList))
        Toast('添加成功！')
        // this.changeSkuShow()
      }
    },
    // sku购买按钮
    skuBuy() {
      if (!this.skuItem.sku_id && this.skuList.length > 0) {
        Toast('请选择规格')
      } else {
        const cartList = []
        cartList.push({
          sku_id: this.skuItem.sku_id ? this.skuItem.sku_id : 0,
          item_id: this.goodsDetail.id,
          buy_num: this.goodsNumber,
          shopping_type: 1
        })
        store.dispatch('order/setCartList', JSON.stringify(cartList)).then(() => {
          this.$router.push({ path: '/orderConfirm' })
        })
      }
    },
    // 去定制
    toCustomized(type) {
      this.skuCustom = type
      this.changeSkuShow()
      // if (!this.skuItem.sku_id && this.skuList.length > 0) {
      //   this.changeSkuShow()
      // } else {
      //   const goodsInfo = []
      //   goodsInfo.push({
      //     sku_id: this.skuItem.sku_id ? this.skuItem.sku_id : 0,
      //     item_id: this.goodsDetail.id,
      //     buy_num: this.goodsNumber,
      //     shopping_type: 2
      //   })
      //   store.dispatch('design/setGoodsInfo', JSON.stringify(goodsInfo)).then(() => {
      //     this.$router.push({ path: `/customized/commonly?goods_id=${this.goodsDetail.id}&sku_id=${this.skuItem.sku_id}` })
      //     this.changeSkuShow()
      //   })
      // }
    },
    // sku去定制按钮
    skutoCustomized() {
      if (!this.skuItem.sku_id && this.skuList.length > 0) {
        Toast('请选择规格')
      } else {
        const goodsInfo = []
        goodsInfo.push({
          sku_id: this.skuItem.sku_id ? this.skuItem.sku_id : 0,
          item_id: this.goodsDetail.id,
          buy_num: this.goodsNumber,
          shopping_type: 2
        })
        store.dispatch('design/setGoodsInfo', JSON.stringify(goodsInfo)).then(() => {
          this.$router.push({ path: `/customized/commonly?goods_id=${this.goodsDetail.id}&sku_id=${this.skuItem.sku_id}&design_id=${this.design_id}` })
          localStorage.setItem('desc', this.goodsDetail.desc)
          this.changeSkuShow()
        })
      }
    },
    // 微信分享
    wxShare() {
      wxSdkApi.getJsConfig({
        url: window.location.origin
      }).then(res => {
        // this.doshare(res.data, 0)
        const shareInfo = {}
        shareInfo.data = res.data
        shareInfo.shareInfo = this.goodsDetail
        wechatInterface(shareInfo, 'share', success => {
        }, fail => {
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.goods-detail{
  padding-bottom: 40px;
  .navbar{
    position: fixed;
    top: 0;
    z-index: 999;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.2);
  }
  .goods-content{
    .goods-images{
      min-height: 335px;
      img{
        width: 100%;
        height: 335px;
        display: block;
      }
    }
    .goods-info{
      position: relative;
      padding: 5px 10px;
      border-bottom: 10px solid #f5f5f5;
      .goods-price{
        margin-top: 10px;
        color: #ee0a24;
        font-size: 12px;
        position: relative;
        span.current-price{
          font-size: 18px;
          font-weight: bold;
        }
        span.old-price{
          padding-left: 10px;
          text-decoration: line-through;
          color: #999;
        }
        span.sale-num{
          position: absolute;
          right: 5px;
          top: 0px;
          color: #666;
          font-size: 12px;
        }
      }
      .goods-name{
        color: #333;
        font-weight: bold;
        font-size: 16px;
        min-height: 25px;

        p{
          margin: 0;
          overflow: hidden;
          padding: 5px 0;
        }
        span{
          padding: 5px 0;
          font-size: 12px;
          color: #999;
        }
      }
    }
    // sku部分样式
    .goods-cell{
      border-bottom: 10px solid #f5f5f5;
      .cell-item{
        font-size: 14px;
        padding: 10px;
        span{
          display: inline-block;
          vertical-align: middle;
        }
        span.cell-title{
          width: 20%;
        }
        span.cell-content{
        width: 60%;
        }
        span.right-arrow{
          width: 20%;
          text-align: right;
        }
      }
    }
    .sku-box{
      .content{
        padding: 20px;
        padding-bottom: 60px;
        .sku-info{
          img{
            border-radius: 5px;
          }
          .right-info{
            display: inline-block;
            font-size: 14px;
            padding-left: 10px;
            vertical-align: top;
            padding-top: 20px;
            p{
              margin: 0;
              padding-bottom: 5px;
            }
            p.price{
              color: #ee0a24;
            }
            .batch-price {
              font-size: 12px;
              color: gray;
              span {
                font-size: 14px;
                line-height: 20px;
                color: #ee0a24;
              }
            }
          }
        }
        .goods-number{
          font-size: 14px;
        }
        .sku-list{
          margin-top: 10px;
          font-size: 14px;
          .sku-item{
            margin-bottom: 20px;
            .sku-item-name{
              display: block;
              padding-bottom: 10px;
            }
            .sku-item-attr{
              display: flex;
              flex-wrap: wrap;
              .attr-name{
                background: #f5f5f5;
                color: #333;
                border-radius: 10px;
                padding: 5px 10px;
                margin-right: 10px;
                font-size: 12px;
                margin-top: 10px;
              }
              .attr-name.active{
                background: rgba(255, 0, 0, 0.164);
                color: #fc1d1d;
              }
            }
          }
        }
      }
    }

  }
  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 15px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    color: #fff;
    border-radius: 20px;
  }
}
</style>

<style lang="scss">
// 修改富文本样式
.goods-detail{
  .detail{
    padding: 10px;
    .title{
      font-size: 16px;
      color: #333
    }
    .content{
      font-size: 12pt;
      p{
        margin: 5px 0;
      }
      img{
        width: 100%;
      }
    }
  }
}
</style>
