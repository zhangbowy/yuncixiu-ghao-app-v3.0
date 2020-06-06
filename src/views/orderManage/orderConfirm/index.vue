<template>
  <div v-loading="loading" class="order-confirm">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar title="确认订单" />
    </div>
    <div class="express-type">
      <van-cell title="配送方式" @click="show = true">
        <template #right-icon>
          <span
            style="background: #ee0a24; color: #fff;border-radius: 8px;padding: 0 5px 0;font-size: 10px"
          >{{ orderType.name }}</span>
        </template>
      </van-cell>
      <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    </div>
    <div
      v-if="orderType.type == 1 && orderInfo.address.phone"
      class="order-address"
      @click="toAddress"
    >
      <div class="user-info">
        <span>{{ orderInfo.address.name }}</span>
        <span class="user-phone">{{ orderInfo.address.phone }}</span>
        <span
          v-if="orderInfo.address.is_default == 1"
          class="is-default"
        >默认</span>
      </div>
      <div class="address-detail">
        <span>{{ orderInfo.address.province }}{{ orderInfo.address.city
        }}{{ orderInfo.address.area }}{{ orderInfo.address.address }}</span>
      </div>
      <span class="right-arrow">
        <svg-icon icon-class="right-arrow" />
      </span>
    </div>
    <div
      v-if="orderType.type == 1 && !orderInfo.address.phone"
      class="order-address"
      @click="toAddress"
    >
      <span class="site-icon">
        <svg-icon icon-class="order-site" />
      </span>
      <div class="add-tip">
        <span>添加收货地址</span>
      </div>
      <span class="right-arrow">
        <svg-icon icon-class="right-arrow" />
      </span>
    </div>
    <div class="good-info">
      <div
        v-for="(item, index) in orderInfo.item_list"
        :key="index"
        class="goods-item"
      >
        <div class="good-img"><img :src="item.image" alt=""></div>
        <div class="good-right">
          <div class="good-name">
            {{ item.name }}
            <span v-if="item._order_type" class="order-type">{{ item._order_type }}</span>
          </div>
          <div v-if="item.sku_id != 0" class="good-sku">
            已选规格：{{ item.sku_name }}
          </div>
          <div class="good-bottom">
            <div class="price">
              <div>
                ￥<span>{{ item.item_total_price.toFixed(2) }}</span>
              </div>
            </div>
            <div class="number">x{{ item.buy_num }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="statistical">
      <van-cell
        title="小计"
        :value="`￥${orderInfo.item_price ? orderInfo.item_price : 0.0}`"
      />
      <van-cell
        v-if="orderType.type == 1"
        title="运费"
        :value="`￥${orderInfo.express_amount ? orderInfo.express_amount : 0.0}`"
      />
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
      <van-submit-bar
        :price="orderInfo.total_price ? orderInfo.total_price * 100 : 0"
        :loading="submitLaoding"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { orderApi } from '@/api/order'
import { mapState } from 'vuex'
import store from '@/store'
import { Toast, Notify } from 'vant'
import { wxPay } from '@/utils/wxPay'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      loading: false,
      show: false,
      submitLaoding: false,
      address_id: '',
      actions: [
        { name: '快递', type: 1 },
        { name: '实体店铺', type: 2 }
      ],
      orderType: {
        name: '快递',
        type: 1
      },
      orderInfo: {
        address: {
          phone: ''
        }
      },
      message: ''
    }
  },
  computed: {
    ...mapState(['order'])
  },
  created() {
    if (this.$route.query.address_id) {
      this.address_id = this.$route.query.address_id
      this.getConfirmData()
    } else {
      this.getConfirmData()
    }
  },
  methods: {
    getConfirmData() {
      this.loading = true
      orderApi
        .calculation({
          address_id: this.address_id,
          cart_list: JSON.parse(this.order.cartList),
          logistics_type: this.orderType.type
        })
        .then((res) => {
          this.loading = false
          this.orderInfo = res.data
        })
        .catch((error) => {
          Notify({ type: 'danger', message: error.msg || '请求异常' })
          this.loading = false
        })
    },
    // 提交订单，创建订单
    onSubmit() {
      this.submitLaoding = true
      orderApi
        .orderCreate({
          cart_list: JSON.parse(this.order.cartList),
          address_id: this.orderInfo.address.address_id,
          buyer_message: this.message,
          logistics_type: this.orderType.type,
          shopping_type: this.orderInfo.order_type
        })
        .then((res) => {
          this.submitLaoding = false
          this.orderPay(res.data.order_no)
        })
    },
    // 订单支付
    orderPay(order_no) {
      orderApi
        .orderPay({
          order_no: order_no
        })
        .then((res) => {
          wxPay(
            res.data,
            (success) => {
              // 支付成功回调
              Toast('支付成功')
              setTimeout(() => {
                if (this.$route.query.from === 'shop_cart') {
                  store.dispatch('shopCart/removeCartList')
                }
                store.dispatch('order/resetState')
                this.$router.replace({ path: '/orderList' })
              }, 500)
            },
            () => {
              // 支付失败回调
              Toast('取消支付')
              setTimeout(() => {
                if (this.$route.query.from === 'shop_cart') {
                  store.dispatch('shopCart/removeCartList')
                }
                store.dispatch('order/resetState')
                this.$router.replace({ path: '/orderList' })
              }, 500)
            }
          )
        })
        .catch(() => {
          setTimeout(() => {
            if (this.$route.query.from === 'shop_cart') {
              store.dispatch('shopCart/removeCartList')
            }
            store.dispatch('order/resetState')
            this.$router.replace({ path: '/orderList' })
          }, 500)
        })
    },
    toAddress() {
      this.$router.push({ path: `/addressList?redirect=${'/orderConfirm'}` })
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
      this.orderType = item
      this.getConfirmData()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-confirm {
  background: #f5f5f5;
  margin-bottom: 50px;
  .navbar {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
  }
  .express-type {
    border-bottom: 1px solid #f5f5f5;
  }
  .order-address {
    padding: 10px 10px 20px 16px;
    margin-bottom: 10px;
    position: relative;
    background: #fff url("../../../assets/images/address-bottom-line.png")
      no-repeat left bottom/100%;
    .site-icon {
      position: absolute;
      left: 10px;
      top: 45%;
      transform: translateY(-50%);
      font-size: 22px;
    }
    .add-tip {
      padding: 8px 20px 0;
      font-size: 14px;
    }
    .user-info {
      padding: 5px 0;
      color: #000;
      font-size: 16px;
      width: 90%;
      .user-phone {
        color: #999;
        font-size: 12px;
      }
      .is-default {
        margin-left: 10px;
        background: crimson;
        border-radius: 20px;
        padding: 2px 5px 0;
        color: #fff;
        font-size: 10px;
        display: inline-block;
        vertical-align: top;
      }
      span {
        margin-right: 10px;
      }
    }
    .address-detail {
      color: #000000;
      font-size: 12px;
      width: 90%;
      line-height: 18px;
    }
    .right-arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
  }
  .good-info {
    .goods-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      background: #fff;
      padding: 10px;
      .good-img {
        width: 25%;
        img {
          width: 100%;
          height: 86px;
          border-radius: 6px;
        }
      }
      .good-right {
        width: 75%;
        font-size: 16px;
        padding-left: 10px;
        .good-name {
          margin-top: 5px;
          font-size: 14px;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          .order-type {
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
        .good-sku {
          padding: 5px 0;
          color: #666;
          font-size: 14px;
        }
      }
      .good-bottom {
        > div {
          display: inline-block;
          color: #666;
        }
        div.price {
          width: 80%;
          font-size: 12px;
          padding: 2px 0;
          color: #df2525;
          span {
            font-size: 14px;
          }
        }
        div.number {
          width: 20%;
          color: #666;
          font-size: 14px;
          text-align: right;
        }
      }
    }
  }
  .statistical {
    margin-bottom: 10px;
    .total-price {
      color: #df2525;
    }
  }
  .order-mask {
    border-bottom: 1px solid #f5f5f5;
  }
  .submit-order {
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
