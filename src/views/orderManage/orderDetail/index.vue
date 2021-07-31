<template>
  <div class="order-detail">
    <van-nav-bar
      class="top-bar"
      style="color:#333"
      :title="`${$t('订单详情')}`"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="detail-header">
      <span>{{ $t(orderDetail._status) }}</span>
      <span>{{ `${$t('运费')}${$t('：')}` }}{{ orderDetail.express_amount.toFixed(2) }}</span>
    </div>
    <div v-if="orderDetail.status==3 || orderDetail.status==4" class="express-info">
      <van-cell is-link @click="showGoodsCheck = true">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <svg-icon class="express-icon" icon-class="express-icon" />
          <span class="express-info-right">{{ $t(`物流详情`) }}</span>
        </template>
      </van-cell>
    </div>
    <div v-if="orderDetail.logistics_type==1" class="address-info">
      <div class="site-icon"><svg-icon icon-class="order-site-icon" /></div>
      <div class="address-info-right">
        <div class="user-info"><span>{{ orderDetail.receiver_name }}</span> <span class="user-phone">{{ orderDetail.receiver_phone }}</span></div>
        <div class="address-detail">{{ orderDetail.receiver_address }}</div>
      </div>
    </div>
    <div v-else class="express-type">
      <van-cell :title="`${$t('配送方式')}`" style="line-height: 1" :border="false" @click="show = true">
        <template #right-icon>
          <span style="border:1px solid #ee0a24; color: #ee0a24;border-radius: 3px;padding: 2px 5px;font-size: 10px">{{ $t(orderDetail._logistics_type) }}</span>
        </template>
      </van-cell>
    </div>
    <div class="goods-info">
      <div v-for="(goods,index) in orderDetail.order_item" :key="`${index}-${goods.item_id}`" class="goods-item" @click="toGoodsDetail(goods.item_id)">
        <img :src="goods.image" alt="">
        <div class="goods-info-right">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="sku-info">{{ goods.sku_name }}</div>
          <div class="price-info">
            <!-- <div class="price">`${$t('￥')}`<span>{{ goods.current_price.toFixed(2) }}</span></div> -->
            <div class="price">
              <div>{{ `${$t('￥')}` }}<span>{{ goods.item_total_price.toFixed(2) }}</span></div>
            </div>
            <div class="number">x{{ goods.buy_num }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-details">
      <div class="order-details-item"><span>{{ `${$t('订单编号')}${$t('：')}` }}</span>{{ orderDetail.order_no }}</div>
      <div class="order-details-item"><span>{{ `${$t('下单时间')}${$t('：')}` }}</span>{{ orderDetail.created_at }}</div>
      <div class="order-details-item"><span>{{ `${$t('订单类型')}${$t('：')}` }}</span>{{ orderDetail.order_type==1?$t('普通订单'):orderDetail.order_type==2?$t('一般定制'):orderDetail.order_type==3?$t('特殊定制'):orderDetail.order_type==4?$t('手绘'):$t('询价') }}</div>
      <div class="order-details-item"><span>{{ `${$t('付款时间')}${$t('：')}` }}</span>{{ orderDetail.pay_time?orderDetail.pay_time:$t('未支付') }}</div>
    </div>
    <div v-if="orderDetail.buyer_message!=''" class="buyer-message">
      <span>{{ `${$t('买家留言')}${$t('：')}` }}</span>
      <div class="message-content">{{ orderDetail.buyer_message }}</div>
    </div>
    <div class="order-price-info">
      <van-cell :title="`${$t('商品总价')}`" :value="`${$t('￥')}${orderDetail.item_amount.toFixed(2)}`" />
      <van-cell v-if="orderDetail.logistics_type==1" :title="`${$t('运费')}`" :value="`${$t('￥')}${orderDetail.express_amount.toFixed(2)}`" />
      <van-cell :title="`${$t('订单总价')}`" :value="`${$t('￥')}${orderDetail.pay_amount.toFixed(2)}`" />
      <div class="pay-total">
        <p>{{ `${$t('需付款')}${$t('：')}` }}<span>{{ `${$t('￥')}` }}<b>{{ orderDetail.pay_amount.toFixed(2) }}</b></span></p>
      </div>
    </div>
    <div v-if="orderDetail.status!=-2" class="order-footer-btn">
      <div v-if="orderDetail.status==1">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.order_no)">{{ $t(`取消订单`) }}</van-button>
        <van-button color="#ee0a24" round size="small" @click.stop="doPay(orderDetail.order_no)">{{ $t(`立即支付`) }}</van-button>
      </div>
      <div v-if="orderDetail.order_type!=1 && orderDetail.logistics_type==2 && orderDetail.status == 10">
        <van-button color="#ee0a24" round size="small" plain @click.stop="scanCode(orderDetail.order_no)">{{ $t(`扫码刺绣`) }}</van-button>
      </div>
      <div v-if="orderDetail.status==3">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.order_no)">{{ $t(`取消订单`) }}</van-button>
        <van-button color="#ee0a24" round size="small" @click.stop="confirmRceipt(orderDetail.order_no)">{{ $t(`确认收货`) }}</van-button>
      </div>
      <div v-if="orderDetail.status==4">
        <van-button color="#ee0a24" round size="small" plain @click.stop="deleteOrder(orderDetail.order_no)">{{ $t(`删除订单`) }}</van-button>
      </div>
      <div v-if="orderDetail.status==6">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.order_no)">{{ $t(`取消订单`) }}</van-button>
        <van-button color="#ee0a24" round size="small" @click.stop="doPay(orderDetail.order_no)">{{ $t(`立即支付`) }}</van-button>
      </div>
    </div>

    <!-- 物流详情点击弹框 -->
    <van-popup v-model="showGoodsCheck" :style="{ width: '80%', borderRadius: '12px' }">
      <div class="trace-title">{{ `${$t('选择商品')}${$t('：')}` }}</div>
      <div class="trace-content">
        <van-cell v-for="item in orderDetail.order_item" :key="item.order_item_id" :title="item.name" is-link :to="`/orderTrace?id=${item.order_item_id}`" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { orderApi } from '@/api/order'
import { Dialog, Toast } from 'vant'
import { wxSdkApi } from '@/api/common'
import { wxPay } from '@/utils/wxPay'
import wechatInterface from '@/utils/wxUtils'
export default {
  data() {
    return {
      order_no: this.$route.query.order_no,
      showGoodsCheck: false, // 显示goods弹框
      orderDetail: {
        item_amount: 0,
        express_amount: 0,
        pay_amount: 0,
        order_item: []
      },
      isShowPrevPop: false
    }
  },
  created() {
    this.getOrderDetail(this.order_no)
  },
  methods: {
    // 获取订单详情
    getOrderDetail(order_no) {
      orderApi.orderDetail({
        order_no: order_no
      }).then(res => {
        this.orderDetail = res.data
      })
    },
    doPay(order_no) {
      orderApi.orderPay({
        order_no: order_no
      }).then(res => {
        wxPay(res.data, (success) => {
          // 支付成功回调
          Toast(success)
          this.getOrderDetail(this.order_no)
        }, (error) => {
          console.log(error)
          // 支付失败回调
          Toast(`${this.$t('支付失败')}`)
        })
      }).catch(() => {
      })
    },
    toGoodsDetail(id) {
      this.$router.push({ path: `/goodsDetail?goods_id=${id}` })
    },
    // 取消订单
    cancelOrder(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否取消该订单')}${this.$t('？')}`
      }).then(() => {
        orderApi.orderCancel({
          order_no: order_no
        }).then(res => {
          this.getOrderDetail(this.order_no)
        })
      }).catch(() => {
      })
    },
    // 调用摄像头扫一扫
    scanCode(order_no) {
      wxSdkApi.getJsConfig({
        url: window.location.origin
      }).then(res => {
        wechatInterface(res, 'scan', (res) => {
          console.log(res)
        }, (error) => {
          console.log(error)
        })
      })
    },
    // 确认收货
    confirmRceipt(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否确认收货')}${this.$t('？')}`
      }).then(() => {
        orderApi.confirmReceived({
          order_no: order_no
        }).then(res => {
          this.getOrderDetail(this.order_no)
        })
      }).catch(() => {
      })
    },
    // 删除订单
    deleteOrder(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否确认删除')}${this.$t('？')}`
      }).then(() => {
        orderApi.deleteOrder({
          order_no: order_no
        }).then(res => {
          this.getOrderDetail(this.order_no)
        })
      }).catch(() => {
      })
    },
    onClickLeft() {
      this.$router.replace('/orderList')
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail{
  padding-bottom: 50px;
  .top-bar{
    position: sticky;
    top: 0;
  }
  .detail-header{
    border-bottom: 10px solid #f5f5f5;
    font-size: 14px;
    padding: 20px 16px;
    color: #fff;
    background: linear-gradient(to top, #ff6034, #ee0a24);
    span{
      display: block;
    }
    span:last-child{
      font-size: 12px;
      padding: 10px 0;
    }
  }
  .express-info{
    display: flex;
    align-items: center;
    border-bottom: 10px solid #f5f5f5;
    .express-icon{
      font-size: 24px;
      display: inline-block;
      vertical-align: middle;
    }
    .express-info-right{
      width: 85%;
      font-size: 14px;
      color: #1296db;
      margin-left: 15px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .express-type {
    border-bottom: 1px solid #f5f5f5;
  }
  .address-info{
    display: flex;
    align-items: center;
    border-bottom: 10px solid #f5f5f5;
    padding: 10px 0;
    .site-icon{
      width: 15%;
      font-size: 24px;
      text-align: center;
    }
    .address-info-right{
      width: 85%;
      font-size: 14px;
      .user-info{
        color: #333;
        padding-bottom: 10px;
        .user-phone{
          color: #999;
          padding-left: 10px;
        }
      }
      .address-detail{
        font-size: 14px;
      }
    }
  }
  .buyer-message{
    font-size: 14px;
    color: #000;
    padding: 10px 16px;
    border-bottom: 10px solid #f5f5f5;
    .message-content{
      color: #666;
      display: inline-block;
    }
  }
 .goods-info{
    padding: 0 16px;
    border-bottom: 10px solid #f5f5f5;
    .goods-item{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
      padding: 10px 0;
      &:last-child{
        border: none;
      }
      img{
        width: 80px;
        height: 80px;
        border-radius: 6px;
      }
      .goods-info-right{
        flex: 1;
        font-size: 14px;
        padding-left: 10px;
        color: #666;
        position: relative;
        height: 80px;
        .goods-name{
          margin-top: 5px;
          font-size: 14px;
          color: #000;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        }
        .sku-info{
          margin-top: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .price-info{
          display: flex;
          align-items: center;
          padding-top: 10px;
          position: absolute;
          left: 10px;
          bottom: 0;
          width: 100%;
          padding-right: 10px;
          box-sizing: border-box;
          >div{
            display: inline-block;
            color: #666;
          }
          div.price{
            width: 80%;
            font-size: 12px;
            padding: 2px 0;
            color: #df2525;
            span{
              color: #df2525;
              font-size: 14px;
            }
          }
          div.number{
            width: 20%;
            color: #666;
            font-size: 14px;
            text-align: right;
          }
        }
      }
    }
  }
  .order-details{
    padding: 10px 16px;
    font-size: 12px;
    border-bottom: 10px solid #f5f5f5;
    .order-details-item{
      padding: 5px 0;
      color: #323233;
      span{
        color: #323233;
        padding-right: 10px;
      }
    }
  }
  .order-price-info{
    .van-cell__value{
      color: #333;
    }
    .pay-total{
      font-size: 12px;
      text-align: right;
      padding: 10px 16px;
      p{
        margin: 0;
        span{
          color: #ee0a24;
          b{
            font-size: 14px;
          }
        }
      }
    }
  }
  .order-footer-btn{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    text-align: right;
    padding: 10px 16px;
    background: #fff;
    z-index: 999;
    button{
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .trace-title{
    font-size: 14px;
    border-bottom: 1px solid #f5f5f5;
    padding: 10px 16PX;
  }
}
</style>
