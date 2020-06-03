<template>
  <div class="order-detail">
    <van-nav-bar
      class="top-bar"
      style="color:#333"
      title="订单详情"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="detail-header">
      <span>{{ orderDetail._status }}</span>
      <span>运费：{{ orderDetail.express_amount.toFixed(2) }}</span>
    </div>
    <div v-if="orderDetail.status==3 || orderDetail.status==4" class="express-info">
      <van-cell is-link @click="showGoodsCheck = true">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <svg-icon class="express-icon" icon-class="express-icon" />
          <span class="express-info-right">物流详情</span>
        </template>
      </van-cell>

    </div>
    <div class="address-info">
      <div class="site-icon"><svg-icon icon-class="order-site-icon" /></div>
      <div class="address-info-right">
        <div class="user-info"><span>{{ orderDetail.receiver_name }}</span> <span class="user-phone">{{ orderDetail.receiver_phone }}</span></div>
        <div class="address-detail">{{ orderDetail.receiver_address }}</div>
      </div>
    </div>
    <div class="goods-info">
      <div v-for="(goods,index) in orderDetail.order_item" :key="`${index}-${goods.item_id}`" class="goods-item" @click="toGoodsDetail(goods.item_id)">
        <img :src="goods.image" alt="">
        <div class="goods-info-right">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="sku-info">{{ goods.sku_name }}</div>
          <div class="price-info">
            <!-- <div class="price">￥<span>{{ goods.current_price.toFixed(2) }}</span></div> -->
            <div class="price">
              <div>￥<span>{{ goods.item_total_price.toFixed(2) }}</span></div>
            </div>
            <div class="number">x{{ goods.buy_num }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-details">
      <div class="order-details-item"><span>订单编号：</span>{{ orderDetail.order_no }}</div>
      <div class="order-details-item"><span>下单时间：</span>{{ orderDetail.created_at }}</div>
      <div class="order-details-item"><span>订单类型：</span>{{ orderDetail.order_type==1?'普通订单':orderDetail.order_type==2?'一般定制':orderDetail.order_type==3?'特殊定制':orderDetail.order_type==4?'手绘':'询价' }}</div>
      <!-- <div class="order-details-item"><span>付款时间：</span>{{ orderDetail.created_at }}</div> -->
    </div>
    <div v-if="orderDetail.buyer_message!=''" class="buyer-message">
      <span>买家留言：</span>
      <div class="message-content">{{ orderDetail.buyer_message }}</div>
    </div>
    <div class="order-price-info">
      <van-cell title="商品总价" :value="`￥${orderDetail.item_amount.toFixed(2)}`" />
      <van-cell title="运费" :value="`￥${orderDetail.express_amount.toFixed(2)}`" />
      <van-cell title="订单总价" :value="`￥${orderDetail.pay_amount.toFixed(2)}`" />
      <div class="pay-total">
        <p>需付款：<span>￥<b>{{ orderDetail.pay_amount.toFixed(2) }}</b></span></p>
      </div>
    </div>

    <div v-if="orderDetail.status!=-2" class="order-footer-btn">
      <div v-if="orderDetail.status==1">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.order_no)">取消订单</van-button>
        <van-button color="#ee0a24" round size="small" @click.stop="doPay(orderDetail.order_no)">立即支付</van-button>
      </div>
      <div v-if="orderDetail.status==3">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.order_no)">取消订单</van-button>
        <van-button color="#ee0a24" round size="small" @click.stop="confirmRceipt(orderDetail.order_no)">确认收货</van-button>
      </div>
    </div>

    <!-- 物流详情点击弹框 -->
    <van-popup v-model="showGoodsCheck" :style="{ width: '80%', borderRadius: '12px' }">
      <div class="trace-title">选择商品：</div>
      <div class="trace-content">
        <van-cell v-for="item in orderDetail.order_item" :key="item.order_item_id" :title="item.name" is-link :to="`/orderTrace?id=${item.order_item_id}`" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { orderApi } from '@/api/order'
import { Dialog, Toast } from 'vant'
import { wxPay } from '@/utils/wxPay'
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
      }
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
          Toast('支付成功')
          this.getOrderDetail(this.order_no)
        }, () => {
          // 支付失败回调
          Toast('支付失败')
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
        message: '是否取消该订单？'
      }).then(() => {
        orderApi.orderCancel({
          order_no: order_no
        }).then(res => {
          this.getOrderDetail(this.order_no)
        })
      }).catch(() => {
      })
    },
    // 确认收货
    confirmRceipt(order_no) {
      Dialog.confirm({
        message: '是否确认收货？'
      }).then(() => {
        orderApi.confirmReceived({
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
