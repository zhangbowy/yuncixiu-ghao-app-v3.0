<template>
  <div class="order-list">
    <div v-for="item in data" :key="item.id" class="order-list-item">
      <div class="list-item-header">
        <div class="order-number">订单号： <span>{{ item.order_no }}</span></div>
        <div class="order-status">
          {{ item.status==1?'待支付': item.status==2?'待发货':item.status==3?'待收货':item.status==4?'已完成':item.status==5?'待回复':item.status==6?'已回复':item.status==-2?'已取消':'' }}
        </div>
      </div>
      <div class="goods-info" @click="toDetail(item.order_no)">
        <div v-for="(goods,index) in item.order_item" :key="`${index}-${goods.item_id}`" class="goods-item">
          <img :src="goods.image" alt="">
          <div class="goods-info-right">
            <div class="goods-name">{{ goods.name }}</div>
            <div class="sku-info">{{ goods.sku_name }}</div>
            <div class="price-info">
              <div class="price">￥<span>{{ goods.current_price }}</span></div>
              <div class="number">x{{ goods.buy_num }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-operation">
        <div v-if="item.status==1" class="button-box">
          <van-button color="#999999" round size="small" plain @click.stop="cancelOrder(item.order_no)">取消订单</van-button>
          <van-button color="#ee0a24" round size="small" @click.stop="doPay(item.order_no)">立即支付</van-button>
        </div>
        <div v-if="item.status==3" class="button-box">
          <van-button color="#ee0a24" round size="small" plain @click.stop="confirmRceipt(item.order_no)">确认收货</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { orderApi } from '@/api/order'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    doPay(id) {

    },
    cancelOrder(order_no) {
      Dialog.confirm({
        message: '是否取消该订单？'
      }).then(() => {
        orderApi.orderCancel({
          order_no: order_no
        }).then(res => {
          this.$emit('getList')
        })
      }).catch(() => {
        Toast('您点击了取消')
      })
    },
    confirmRceipt(order_no) {
      Dialog.confirm({
        message: '是否确认收货？'
      }).then(() => {
        orderApi.confirmReceived({
          order_no: order_no
        }).then(res => {
          this.$emit('getList')
        })
      }).catch(() => {
        Toast('您点击了取消')
      })
    },
    toDetail(order_no) {
      this.$router.replace({ path: `/orderDetail?order_no=${order_no}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list{
  padding: 10px;
  .order-list-item{
    border-radius: 10px;
    box-shadow: 0 2px 15px #ebebeb;
    margin-bottom: 15px;
    &:last-child{
      margin-bottom: 0;
    }
    .list-item-header{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
      padding: 10px 10px 8px;
      .order-number{
        width: 80%;
        font-size: 12px;
        color: #333;
      }
      .order-status{
        width: 20%;
        text-align: right;
        color: coral;
        font-size: 14px;
        font-weight: bold;
      }
    }
    .goods-info{
      border-bottom: 1px solid #f5f5f5;
      .goods-item{
        padding: 10px;
        display: flex;
        align-items: center;
        img{
          width: 25%;
          height: 80px;
        }
        .goods-info-right{
          width: 73%;
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
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
            white-space: nowrap;
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
    .list-operation{
      text-align: right;
      .button-box{
        padding: 10px;
        height: 30px;
        button{
        vertical-align: top;
        margin-left: 10px;
        padding: 0 10px;
      }
      }

    }
  }
}
</style>
