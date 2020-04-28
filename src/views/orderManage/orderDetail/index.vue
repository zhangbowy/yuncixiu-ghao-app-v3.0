<template>
  <div class="order-detail">
    <top-bar class="top-bar" title="订单详情" />
    <div class="detail-header">
      <span>{{ orderDetail.status==1?'待支付': orderDetail.status==2?'待发货':orderDetail.status==3?'待收货':orderDetail.status==4?'已完成':orderDetail.status==5?'待回复':orderDetail.status==6?'已回复':orderDetail.status==-2?'已取消':'' }}</span>
      <span>运费：{{ orderDetail.express_amount.toFixed(2) }}</span>
    </div>
    <div v-if="orderDetail.status==3" class="express-info">
      <div class="express-icon"><svg-icon icon-class="express-icon" /></div>
      <div class="express-info-right">
        <span>物流详情</span>
      </div>
    </div>
    <div class="address-info">
      <div class="site-icon"><svg-icon icon-class="order-site-icon" /></div>
      <div class="address-info-right">
        <div class="user-info"><span>{{ orderDetail.receiver_name }}</span> <span>{{ orderDetail.receiver_phone }}</span></div>
        <div class="address-detail">{{ orderDetail.receiver_address }}</div>
      </div>
    </div>
    <div class="goods-info">
      <div v-for="(goods,index) in orderDetail.order_item" :key="`${index}-${goods.item_id}`" class="goods-item">
        <img :src="goods.image" alt="">
        <div class="goods-info-right">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="sku-info">{{ goods.sku_name }}</div>
          <div class="price-info">
            <div class="price">￥<span>{{ goods.current_price.toFixed(2) }}</span></div>
            <div class="number">x{{ goods.buy_num }}</div>
          </div>
        </div>
      </div>
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
    <div class="order-details">
      <div class="order-details-item">订单编号：{{ orderDetail.order_no }}</div>
      <div class="order-details-item">下单时间：{{ orderDetail.created_at }}</div>
      <div class="order-details-item">订单类型：{{ orderDetail.order_type==1?'普通订单':orderDetail.order_type==2?'一般定制':orderDetail.order_type==3?'特殊定制':orderDetail.order_type==4?'手绘':'询价' }}</div>
      <div class="order-details-item">付款时间：{{ orderDetail.created_at }}</div>
    </div>
    <div class="order-footer-btn">
      <div v-if="orderDetail.status==1">
        <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(orderDetail.id)">取消订单</van-button>
        <van-button color="coral" round size="small" plain @click.stop="doPay(orderDetail.id)">立即支付</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { orderApi } from '@/api/order'
import { Dialog, Toast } from 'vant'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      order_no: this.$route.query.order_no,
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
    getOrderDetail(order_no) {
      orderApi.orderDetail({
        order_no: order_no
      }).then(res => {
        this.orderDetail = res.data
      })
    },
    doPay(id) {

    },
    cancelOrder(id) {
      Dialog.confirm({
        message: '是否取消该订单？'
      }).then(() => {
        // on confirm
        Toast('您点击确认')
      }).catch(() => {
        // on cancel
        Toast('您点击取消')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail{
  .top-bar{
    position: sticky;
    top: 0;
  }
  .detail-header{
    border-bottom: 10px solid #f5f5f5;
    font-size: 16px;
    padding: 20px 16px;
    color: #fff;
    background: linear-gradient(to right,#ff7f50, rgba(255, 127, 80, 0.4));
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
    padding: 10px 0;
    .express-icon{
      width: 15%;
      font-size: 20px;
      text-align: center;
    }
    .express-info-right{
      width: 85%;
      font-size: 14px;
      color: #13bf6c;
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
      font-size: 16px;
      .user-info{
        color: #000;
        padding-bottom: 10px;
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
    padding: 0 10px;
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
      }
      .goods-info-right{
        flex: 1;
        font-size: 14px;
        padding-left: 10px;
        color: #999;
        position: relative;
        height: 80px;
        .goods-name{
          padding: 0 0 10px;
          font-size: 16px;
          color: #000;
          overflow: hidden;
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
          .price{
            width: 50%;
            color: #ee0a24;
          }
          .number{
            width: 50%;
            text-align: right;
          }
        }
      }
    }
  }
  .order-details{
    padding: 20px 16px;
    font-size: 14px;
    padding-bottom: 45px;
    .order-details-item{
      padding: 5px 0;
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
      border-bottom: 10px solid #f5f5f5;
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
    height: 45px;
    width: 100%;
    box-sizing: border-box;
    text-align: right;
    padding: 0 10px;
    border-top: 1px solid #f5f5f5;
    background: #fff;
    z-index: 999;
    button{
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
</style>
