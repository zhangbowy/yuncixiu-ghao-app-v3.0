<template>
  <div class="goods-detail">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar />
    </div>
    <div class="good-content">
      <!-- 商品图片 -->
      <div class="good-images">
        <van-swipe @change="onChange">
          <van-swipe-item v-for="(item, index) in goodDetail.images" :key="item">
            <img :src="item" alt="" @click="preview(index)">
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/{{ goodDetail.images.length }}
            </div>
          </template>
        </van-swipe>
      </div>
      <!-- 基础信息 -->
      <div class="good-info">
        <div class="good-name">
          <p>{{ goodDetail.name }}</p>
          <span>{{ goodDetail.real_sale }}人付款</span>
        </div>
        <div class="share-btn" @click="showShare = true"> <svg-icon icon-class="share" /> <span>分享</span></div>
        <div class="good-price">
          ￥ <span class="current-price">{{ goodDetail.current_price }}</span>
          <span class="old-price">￥{{ goodDetail.old_price }}</span>
        </div>
      </div>
      <!-- 商品规格选择 -->
      <div class="good-cell">
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
              <img :src="skuItem.images?skuItem.images:goodDetail.thumb_image_path" width="96" height="96" alt="">
              <div class="right-info">
                <p class="price">￥{{ skuItem.current_price }}</p>
                <p>剩余{{ skuItem.num }}</p>
                <p>已选：<span v-for="item in skuItem.skus" :key="item.k+item.v">{{ item.k }}:{{ item.v }}  </span>{{ skuItem.checked }}</p>
              </div>
            </div>
            <div class="sku-list">
              <div v-for="(item,index) in skudata" :key="item.id + '_id'" class="sku-item">
                <span class="sku-item-name">{{ item.value }}:</span>
                <div v-if="showSku" class="sku-item-attr">
                  <span v-for="attr in item.leaf" :key="attr.id" :class="{'active':activeSku[index].option&&activeSku[index].option.id === attr.id}" class="attr-name" @click="selectSku(index, attr)">{{ attr.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-action-sheet>
      </div>
      <!-- 商品详 -->
      <div class="goods-detail">
        <div class="title">商品详情</div>
        <div v-html="goodDetail.detail" />
      </div>
      <div class="good-adction">
        <van-goods-action>
          <van-goods-action-icon icon="wap-home-o" text="首页" @click="pathTo('/')" />
          <van-goods-action-icon icon="cart-o" text="购物车" @click="pathTo('/cart')" />
          <van-goods-action-button
            type="warning"
            text="加入购物车"
            @click="onClickButton"
          />
          <van-goods-action-button
            type="danger"
            text="立即购买"
            @click="onClickButton"
          />
        </van-goods-action>
      </div>
      <van-share-sheet
        v-model="showShare"
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
import { ImagePreview } from 'vant'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      current: 0,
      checkedSku: '请选择规格',
      showSku: false,
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ],
      goodDetail: {
        images: []
      },
      skuList: [],
      skudata: [],
      activeSku: [],
      skuItem: {
      },
      checkedSkuIds: '',
      id: this.$route.query.good_id
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
        this.checkedSkuIds = this.activeSku.reduce(
          (total, prev, index) =>
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
              current_price: this.goodDetail.current_price,
              num: this.goodDetail.sum_stock,
              images: this.goodDetail.thumb_image_path
            }
          }
        })
      }
    }
  },
  created() {
    this.goodsId = this.$route.query.good_id
    this.fetchData(this.goodsId)
    // 加载skulist和skudata
  },
  methods: {
    fetchData(id) {
      goodsApi.getGoodsDetail({
        id: id
      }).then(res => {
        this.goodDetail = res.data
        this.goodDetail.images = JSON.parse(res.data.images)
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
          images: this.goodDetail.images,
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
    onClickButton() {
      if (!this.skuItem.sku_id) {
        this.changeSkuShow(0)
      }
    },
    // 分享按钮选中
    onSelect(option) {
      console.log(option.name)
      this.showShare = false
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-detail{
  .navbar{
    position: fixed;
    top: 0;
    z-index: 999;
  }

  .good-content{
    .good-images{
      img{
        width: 100%;
        height: 335px;
      }
    }
    .good-info{
      position: relative;
      padding: 5px 10px;
      border-bottom: 10px solid #f5f5f5;
      .good-name{
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
      .good-price{
        margin-top: 10px;
        color: #ff0a0a;
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
    .good-cell{
      border-bottom: 10px solid #f5f5f5;
      .cell-item{
        font-size: 16px;
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
        .sku-info{
          .right-info{
            display: inline-block;
            font-size: 16px;
            padding-left: 10px;
            vertical-align: top;
            p{
              margin: 0;
              padding-bottom: 10px;
            }
            p.price{
              color: #ff0a0a;
            }
          }
        }
        .sku-list{
          margin-top: 10px;
          font-size: 16px;
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
                font-size: 14px;
              }
              .attr-name.active{
                background: rgba(255, 0, 0, 0.164);
                color: rgb(252, 29, 29);
              }
            }
          }
        }
      }
    }
    .goods-detail{
      padding: 10px;
      .title{
        font-size: 18px;
        color: #333
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

