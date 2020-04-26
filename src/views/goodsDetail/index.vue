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
        <div class="goods-name">
          <p>{{ goodsDetail.name }}</p>
          <span>{{ goodsDetail.real_sale }}人付款</span>
        </div>
        <div class="share-btn" @click="share = true"> <svg-icon icon-class="share" /> <span>分享</span></div>
        <div class="goods-price">
          ￥ <span class="current-price">{{ goodsDetail.current_price }}</span>
          <span class="old-price">￥{{ goodsDetail.old_price }}</span>
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
                <p class="price">￥{{ skuItem.current_price }}</p>
                <p>剩余{{ skuItem.num }}</p>
                <p>已选：<span v-for="item in skuItem.skus" :key="item.k+item.v">{{ item.k }}:{{ item.v }}  </span>{{ skuItem.checked }}</p>
              </div>
            </div>
            <div class="goods-number">
              <van-cell title="选择数量">
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template>
                  <van-stepper v-model="goodsNumber" :min="goodsDetail.min_buy" :max="goodsDetail.max_buy" input-width="30px" button-size="22px" />
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
                  type="warning"
                  text="加入购物车"
                  @click="skuAddCart"
                />
                <van-goods-action-button
                  type="danger"
                  text="立即购买"
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
            type="warning"
            text="加入购物车"
            @click="addCart"
          />
          <van-goods-action-button
            type="danger"
            text="立即购买"
            @click="buyNow"
          />
        </van-goods-action>
      </div>
      <!-- 分享组件 -->
      <van-share-sheet
        v-model="share"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { goodsApi } from '@/api/goods'
import { ImagePreview, Toast } from 'vant'
import store from '@/store'
export default {
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
      skuList: [], // sku列表-
      skudata: [], // sku选项
      activeSku: [], // 选中的sku
      skuItem: {}, // 选中sku详细
      options: [
        { name: '微信', icon: 'wechat' }
        // { name: '微博', icon: 'weibo' },
        // { name: '复制链接', icon: 'link' },
        // { name: '分享海报', icon: 'poster' },
        // { name: '二维码', icon: 'qrcode' }
      ], // 分享选项
      goodsNumber: 0, // 购买数量
      checkedSkuIds: '', // 选中sku组合id
      id: this.$route.query.goods_id
    }
  },
  watch: {
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
        this.checkedSkuIds = this.activeSku.reduce((total, prev, index) =>
        // console.log('prev', prev)
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
          if (arr.indexOf(this.checkedSkuIds) < 0) {
            this.checkedSku = '请选择规格'
            this.skuItem = {
              current_price: this.goodsDetail.current_price,
              num: this.goodsDetail.sum_stock,
              images: this.goodsDetail.thumb_image_path
            }
          }
        })
      }
    }
  },
  created() {
    this.goodsId = this.$route.query.goods_id
    this.fetchData(this.goodsId)
    // 加载skulist和skudata
  },
  methods: {
    // 获取商品详情
    fetchData(id) {
      goodsApi.getGoodsDetail({
        id: id
      }).then(res => {
        this.goodsDetail = res.data
        this.goodsDetail.images = JSON.parse(res.data.images)
        this.skuList = JSON.parse(res.data.sku_list)
        this.skudata = JSON.parse(res.data.sku_show)
        this.skuItem.current_price = res.data.current_price
        this.skuItem.num = res.data.sum_stock
        this.skuItem.images = res.data.thumb_image_path
      })
    },
    // 轮播切换
    onChange(index) {
      this.current = index
    },
    // 预览图片
    preview(i) {
      ImagePreview(
        {
          images: this.goodsDetail.images,
          startPosition: i
        }
      )
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
        this.skuItem.goods_name = this.goodsDetail.name
        store.dispatch('shopCart/setCartList', this.skuItem).then(res => {
          Toast('添加成功')
        })
      }
    },
    buyNow() {
      if (!this.skuItem.sku_id) {
        this.changeSkuShow()
      } else {
        this.$router.push({ path: '/orderConfirm' })
      }
    },
    // 分享面板是否显示
    shareIsShow(val) {
      this.share = val
    },
    // sku添加购物车按钮
    skuAddCart() {
      if (!this.skuItem.sku_id) {
        this.changeSkuShow()
      } else {
        this.skuItem.number = this.goodsNumber
        this.skuItem.goods_name = this.goodsDetail.name
        store.dispatch('shopCart/setCartList', this.skuItem).then(res => {
          Toast('添加成功')
        })
      }
    },
    // sku购买按钮
    skuBuy() {
      if (!this.skuItem.sku_id) {
        this.changeSkuShow()
      } else {
        this.$router.push({ path: '/orderConfirm' })
      }
    },
    // 分享按钮选中
    onSelect(option) {
      switch (option.name) {
        case '微信':
          this.bindShareTimeLine()
          break
        case '朋友圈':
          this.bindShareAppMessage()
          break
        case 'QQ':
          this.bindShareQQ()
          break
        case 'QQ空间':
          this.bindShareQzone()
          break
      }
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
  }

  .goods-content{
    .goods-images{
      img{
        width: 100%;
        height: 335px;
      }
    }
    .goods-info{
      position: relative;
      padding: 5px 10px;
      border-bottom: 10px solid #f5f5f5;
      .goods-name{
        color: #333;
        font-weight: bold;
        font-size: 22px;
        position: relative;
        p{
          width: 65%;
          margin: 0;
          overflow: hidden;
        }
        span{
          position: absolute;
          right: 5px;
          top: 0px;
          color: #666;
          font-size: 12px;
        }
      }
      .share-btn{
        position: absolute;
        color: #666;
        right: 0;
        top: 30px;
        font-size: 12px;
        padding: 4px 6px;
        border-radius: 20px 0 0 20px;
        background: rgba(65, 65, 65, 0.1);
      }
      .goods-price{
        margin-top: 10px;
        color: #ee0a24;
        font-size: 12px;
        span.current-price{
          font-size: 18px;
          font-weight: bold;
        }
        span.old-price{
          padding-left: 10px;
          text-decoration: line-through;
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
              .attr-name{
                background: #f5f5f5;
                color: #333;
                border-radius: 10px;
                padding: 5px 10px;
                margin-right: 10px;
                font-size: 12px;
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
