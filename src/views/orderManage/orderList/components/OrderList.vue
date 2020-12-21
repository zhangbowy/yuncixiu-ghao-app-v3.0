<template>
  <div class="order-list">
    <div v-for="item in data" :key="item.id" class="order-list-item">
      <div class="list-item-header">
        <div class="order-number">{{ `${$t('订单号')}${$t('：')}` }}<span>{{ item.order_no }}</span></div>
        <div class="order-status">
          <!-- {{ item._status }} -->
          {{ item.status==1?$t('待支付'): item.status==2||item.status==7||item.status==8||item.status==9||item.status==10?$t('待发货'):item.status==3?$t('待收货'):item.status==4?$t('已完成'):item.status==5?$t('待回复'):item.status==6?$t('已回复'):item.status==-2?$t('已取消'):'' }}
        </div>
      </div>
      <div class="goods-info" @click="toDetail(item.order_no)">
        <div v-for="(goods,index) in item.order_item" :key="`${index}-${goods.item_id}`" class="goods-item">
          <img v-lazy="goods.image" alt="">
          <div class="goods-info-right">
            <div class="goods-name">{{ goods.name }}</div>
            <div v-if="goods.sku_id!=0" class="sku-info">{{ goods.sku_name }}</div>
            <div class="price-info">
              <div class="price">
                <div>{{ `${$t('￥')}` }}<span>{{ goods.item_total_price.toFixed(2) }}</span></div>
              </div>
              <div class="number">x{{ goods.buy_num }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="statistics">
        <span class="logistics-type">{{ $t(item._logistics_type) }}</span> <span>{{ $t('共计') }}{{ item.order_item.length }}{{ $t('件商品') }} {{ $t('合计') }}:{{ $t('￥') }}</span><span class="pay-amound">{{ item.pay_amount.toFixed(2) }}</span> <span v-if="item.logistics_type==1">({{ $t('含运费') }}{{ $t('￥') }}{{ item.express_amount.toFixed(2) }})</span>
      </div>
      <div class="list-operation">
        <div class="button-box">
          <van-button
            v-if="item.status==1 || item.status==5 || item.status==6"
            color="#999"
            round
            size="mini"
            plain
            @click.stop="cancelOrder(item.order_no)"
          >{{ $t(`取消订单`) }}</van-button>

          <van-button
            v-if="item.status==1 || item.status==5 || item.status==6"
            color="#ee0a24"
            round
            size="mini"
            @click.stop="doPay(item.order_no)"
          >{{ $t(`立即支付`) }}</van-button>

          <van-button
            v-if="item.order_type!=1 && item.logistics_type==2 && item.status == 10"
            color="#ee0a24"
            round
            size="mini"
            plain
            @click.stop="scanCode(item.order_no)"
          >{{ $t(`扫描机器`) }}</van-button>
          <van-button v-if="item.status==4 || item.status==-2" color="#ee0a24" round size="mini" plain @click.stop="deleteOrder(item.order_no)">{{ $t(`删除订单`) }}</van-button>
          <van-button v-if="item.status==3" color="#ee0a24" round size="mini" plain @click.stop="confirmRceipt(item.order_no)">{{ $t(`确认收货`) }}</van-button>
          <van-button v-if="item.status==6" color="#ee0a24" round size="mini" plain @click.stop="replayOrder(item.order_no)">{{ $t(`回复报价`) }}</van-button>
          <van-button v-if="item.order_type != 1"  color="#ee0a24" round size="mini" plain @click.stop="onClick_showPrevPop(item)">{{ $t(`预览`) }}</van-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Dialog, Toast } from 'vant'
import { orderApi } from '@/api/order'
import { wxSdkApi } from '@/api/common'
import { wxPay } from '@/utils/wxPay'
import wechatInterface from '@/utils/wxUtils'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    doPay(order_no) {
      orderApi.orderPay({
        order_no: order_no
      }).then(res => {
        wxPay(res.data, (success) => {
          // 支付成功回调
          Toast(success)
          this.$emit('getList')
        }, (error) => {
          console.log(error)
          // 支付失败回调
          Toast(`${this.$t('支付失败')}`)
        })
      }).catch(() => {
      })
    },
    cancelOrder(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否取消该订单')}${this.$t('？')}`,
        confirmButtonColor: '#df2525'
      }).then(() => {
        orderApi.orderCancel({
          order_no: order_no
        }).then(res => {
          this.$emit('getList')
        })
      }).catch(() => {
        Toast(`${this.$t('您点击了取消')}`)
      })
    },
    confirmRceipt(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否确认收货')}${this.$t('？')}`,
        confirmButtonColor: '#df2525'
      }).then(() => {
        orderApi.confirmReceived({
          order_no: order_no
        }).then(res => {
          this.$emit('getList')
        })
      }).catch(() => {
        Toast(`${this.$t('您点击了取消')}`)
      })
    },
    // 调用摄像头扫一扫
    scanCode(order_no) {
      wxSdkApi.getJsConfig({
        url: window.location.origin
      }).then(res => {
        wechatInterface(res, 'scan', (result) => {
          if (result) {
            var code = result.split(' ')[0]
            orderApi.scanMachine({
              order_no: order_no,
              machine_code: code
            }).then(res => {
              Toast(this.$t(...res.msg))
            })
          }
        }, (error) => {
          console.log(error)
        })
      })
    },
    replayOrder(order_no) {
      this.$emit('change', { name: 'replay', order_no: order_no })
    },
    toDetail(order_no) {
      this.$router.replace({ path: `/orderDetail?order_no=${order_no}` })
    },
    // 删除订单
    deleteOrder(order_no) {
      Dialog.confirm({
        message: `${this.$t('是否确认删除')}${this.$t('？')}`
      }).then(() => {
        orderApi.deleteOrder({
          order_no: order_no
        }).then(res => {
          this.$emit('getList')
        })
      }).catch(() => {
      })
    },
    onClick_showPrevPop($row) {
      this.$emit('showPrevPop', $row)
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
        width: 28%;
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
          border-radius: 6px;
        }
        .goods-info-right{
          width: 73%;
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
    .statistics{
      font-size: 12px;
      color: #000;
      text-align: right;
      padding: 10px;
      border-bottom: 1px solid #f5f5f5;
      .logistics-type{
        float: left;
        border-radius: 3px;
        padding:3px;
        color: #ee0a24;
        border:1px solid #ee0a24;
      }
      span{
        display: inline-block;
      }
      .pay-amound{
        font-size: 16px;
        color: #df2525;
      }
    }
    .list-operation{
      text-align: right;
      .button-box{
        padding: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        button{
          vertical-align: top;
          margin-left: 10px;
          padding: 5px 10px 2px;
          font-size: 12px;
          height: auto;
        }
      }

    }
  }
}
</style>
