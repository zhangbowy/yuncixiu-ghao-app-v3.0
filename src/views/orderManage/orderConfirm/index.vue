<template>
  <div class="order-confirm">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar title="确认订单" />
    </div>
    <div class="express-type">
      <van-cell title="配送方式" @click="show = true">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <span style="background: #ee0a24; color: #fff;border-radius: 8px;padding: 0 5px 0;font-size: 10px">{{ orderType.name }}</span>
        </template>
      </van-cell>
      <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    </div>
    <div v-if="orderType.type==2 && orderInfo.address" class="order-address" @click="toAddress">
      <div class="user-info">
        <span>{{ orderInfo.address.name }}</span>
        <span class="user-phone">{{ orderInfo.address.phone }}</span>
        <span v-if="orderInfo.address.is_default==1" class="is-default">默认地址</span>
      </div>
      <div class="address-detail">
        <span>{{ orderInfo.address.province }}{{ orderInfo.address.city }}{{ orderInfo.address.area }}{{ orderInfo.address.address }}</span>
      </div>
      <span class="right-arrow">
        <svg-icon icon-class="right-arrow" />
      </span>
    </div>
    <div class="good-info">
      <div v-for="(item,index) in orderInfo.item_list" :key="index" class="goods-item">
        <div class="good-img"><img :src="item.image" alt=""></div>
        <div class="good-right">
          <div class="good-name">{{ item.name }}<span v-if="item._order_type" class="order-type">{{ item._order_type }}</span></div>
          <div class="good-sku">已选：{{ item.sku_name }} </div>
          <div class="good-bottom">
            <span class="price">￥{{ item.current_price }}</span>
            <span class="number">x{{ item.buy_num }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="statistical">
      <van-cell title="小计" :value="`￥${orderInfo.item_price}`" />
      <van-cell v-if="orderType.type==2" title="运费" :value="`￥${orderInfo.express_amount}`" />
    </div>
    <div class="order-mask">
      <van-field
        v-model="message"
        rows="2"
        :border="true"
        autosize
        label="留言"
        type="textarea"
        maxlength="100"
        placeholder="请输入留言"
        show-word-limit
      />
    </div>
    <div class="submit-order">
      <van-submit-bar :price="orderInfo.total_price*100" button-text="提交订单" @submit="onSubmit" />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { orderApi } from '@/api/order'
import { mapState } from 'vuex'
import store from '@/store'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      show: false,
      actions: [
        { name: '实体店铺', type: 1 },
        { name: '快递', type: 2 }
      ],
      orderType: {
        name: '快递', type: 2
      },
      orderInfo: {
      },
      message: ''
    }
  },
  computed: {
    ...mapState([
      'order'
    ])
  },
  created() {
    if (this.$route.query.address_id) {
      this.getConfirmData(this.$route.query.address_id)
    } else {
      this.getConfirmData()
    }
  },
  methods: {
    getConfirmData(address_id) {
      orderApi.calculation({
        address_id: address_id,
        cart_list: JSON.parse(this.order.cartList)
      }).then(res => {
        this.orderInfo = res.data
      })
    },
    onSubmit() {
      orderApi.orderPay({
        cart_list: JSON.parse(this.order.cartList),
        address_id: this.orderInfo.address.address_id,
        buyer_message: this.message,
        shopping_type: this.orderInfo.shopping_type
      }).then(res => {
        if (this.$route.query.from === 'shop_cart') {
          store.dispatch('shopCart/removeCartList')
        }
        store.dispatch('order/resetState')
        this.$router.replace({ path: '/orderList' })
      })
    },
    toAddress() {
      this.$router.replace({ path: `/addressList?redirect=${'/orderConfirm'}` })
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
      this.orderType = item
    }
  }
}
</script>

<style lang="scss" scoped>
.order-confirm{
  background: #f5f5f5;
  margin-bottom: 50px;
  .navbar{
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
  }
  .express-type{
    border-bottom: 1px solid #f5f5f5;
  }
  .order-address{
    padding: 10px 10px 20px 16px;
    margin-bottom: 10px;
    position: relative;
    background:#fff url('../../../assets/images/address-bottom-line.png') no-repeat left bottom/100%;;
    .user-info{
      padding: 5px 0;
      color: #000;
      font-size: 16px;
      width: 90%;
      .user-phone{
        color: #999;
        font-size: 12px;
      }
      .is-default{
        margin-left: 10px;
        background: crimson;
        border-radius: 20px;
        padding: 2px 5px 0;
        color: #fff;
        font-size: 10px;
        display: inline-block;
        vertical-align: top;
      }
      span{
        margin-right: 10px;
      }
    }
    .address-detail{
      color: #000000;
      font-size: 12px;
      width: 90%;
      line-height: 1.5;
    }
    .right-arrow{
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
  }
  .good-info{
    .goods-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      background: #fff;
      padding: 10px;
      .good-img{
        width: 25%;
        img{
          width: 100%;
          height: 86px;
        }
      }
      .good-right{
        width: 75%;
        font-size: 16px;
        padding-left: 10px;
        .good-name{
          height: 40px;
          .order-type{
            margin-left: 10px;
            background: crimson;
            border-radius: 20px;
            padding: 3px 5px;
            color: #fff;
            font-size: 10px;
            display: inline-block;
            vertical-align: top;
          }
        }
        .good-sku{
          padding: 5px 0;
          color: #666;
          font-size: 14px;
        }
      }
      .good-bottom{
        span{
          width: 50%;
          display: inline-block;
        }
        span.price{
          color: #df2525;
          font-size: 16px;
        }
        span.number{
          color: #666;
          font-size: 14px;
          text-align: right;
        }
      }
    }

  }
  .statistical{
    margin-bottom: 10px;
    .total-price{
      color: #df2525;
    }
  }
  .order-mask{
    border-bottom: 1px solid #f5f5f5;
  }
  .submit-order{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    overflow: hidden;
    border-top: 1px solid #f5f5f5;
  }
}
</style>
