<template>
  <div class="order-confirm">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar title="确认订单" />
    </div>
    <div class="order-type">
      <van-cell title="配送方式" @click="show = true">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <span style="background: #ee0a24; color: #fff;border-radius: 8px;padding: 0 5px 0;font-size: 10px">{{ orderType.name }}</span>
        </template>
      </van-cell>
      <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    </div>
    <div v-if="orderType.type==2" class="order-address" @click="toAddress">
      <div class="user-info">
        <span>张三</span>
        <span>18895364554</span>
      </div>
      <div class="address-detail">
        收货地址：<span>浙江省杭州市余杭区利尔达物联网1号楼703</span>
      </div>
      <span class="right-arrow">
        <svg-icon icon-class="right-arrow" />
      </span>
    </div>
    <div class="good-info">
      <div class="good-img"><img src="http://ec4.images-amazon.com/images/I/71gfm0gcb0L._UL1500_.jpg" alt=""></div>
      <div class="good-right">
        <div class="good-name">商品名果水果称</div>
        <div class="good-sku">已选："黑色","大" </div>
        <div class="good-bottom">
          <span class="price">￥0.01</span>
          <span class="number">x1</span>
        </div>
      </div>
    </div>
    <div class="statistical">
      <van-cell title="小计" :value="`￥${subtotal}`" />
      <van-cell v-if="orderType.type==2" title="运费" :value="`￥${orderInfo.yunfei}`" />
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
      <van-submit-bar :price="totalPrice" button-text="提交订单" @submit="onSubmit" />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
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
        yunfei: 5,
        goodsInfo: [
          {
            img: '',
            price: 0.01,
            number: 1,
            skus: [
              {
                k: '颜色',
                v: '红色'
              }, {
                k: '尺寸',
                v: '大'
              }
            ]
          }
        ]
      },
      message: ''
    }
  },
  computed: {
    subtotal() {
      return this.orderInfo.goodsInfo.reduce((prev, cur) => {
        return cur.price * cur.number + prev
      }, 0)
    },
    totalPrice() {
      return parseFloat(this.orderInfo.yunfei) * 100 + parseFloat(this.subtotal) * 100
    }
  },
  methods: {
    onSubmit() {
      console.log('提交按钮点击')
    },
    toAddress() {
      this.$router.push({ path: `/addressList?redirect=${'/orderConfirm'}` })
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
      console.log(item)
      this.orderType = item
    }
  }
}
</script>

<style lang="scss" scoped>
.order-confirm{
  background: #f5f5f5;
  .order-address{
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
    background:#fff url('../../../assets/images/address-bottom-line.png') no-repeat left bottom/100%;;
    .user-info{
      padding: 5px 0;
      color: #000;
      font-size: 16px;
      width: 90%;
      span{
        margin-right: 10px;
      }
    }
    .address-detail{
      color: #666;
      font-size: 14px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
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
