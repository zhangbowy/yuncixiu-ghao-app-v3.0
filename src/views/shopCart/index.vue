<template>
  <div class="cart-view">
    <div class="cart-header">
      <van-nav-bar
        title="购物车"
        :right-text="isEdit==true?'完成':'管理'"
        left-arrow
        :border="false"
        @click-right="onClickRight"
        @click-left="back"
      />
    </div>
    <div class="cart-content">
      <div class="goods-list">
        <van-checkbox-group v-model="checkedArr">
          <div v-for="(item,index) in cartList" :key="index" class="goods-item">
            <van-checkbox :name="item.sku_id" checked-color="#ff6034" />
            <div class="good-info">
              <img v-lazy="item.images" alt="" width="100">
              <div class="good-info-right">
                <div class="good-name">{{ item.goods_info.name }}</div>
                <div class="good-sku">规格：<span v-for="sku in item.skus" :key="sku.k">{{ sku.v }} </span></div>
                <div class="good-price">
                  <span class="price">￥{{ item.current_price }}</span>
                  <span class="number">x{{ item.number }}</span>
                  <!-- <span v-else class="number">
                    <van-stepper v-model="item.number" input-width="30px" button-size="22px" />
                  </span> -->
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
      <div v-if="cartList.length==0" class="no-data">
        <no-data text="购物车无商品" icon="cart-no-data" :font-size="64" /></div>
    </div>
    <div class="cart-footer">
      <div v-if="!isEdit" class="footer-operation">
        <van-submit-bar :price="total*100" button-text="提交订单" @submit="onSubmit">
          <van-checkbox v-model="checked" checked-color="#ff6034">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <div v-else class="footer-operation">
        <van-row type="flex" class="operation-box">
          <van-col span="12">
            <van-checkbox v-model="checked" checked-color="#ff6034">全选</van-checkbox>
          </van-col>
          <van-col span="12" class="delete-operat">
            <van-button round hairline type="danger" @click.stop="deleteCart">删除({{ checkedArr.length }})</van-button>
          </van-col>
        </van-row>
      </div>
    </div>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { shopCart } from '@/utils/shopCart'
import NoData from '@/components/NoData'
import store from '@/store'
export default {
  components: {
    NoData
  },
  data() {
    return {
      checkedArr: [],
      checkedItem: [],
      checked: false,
      isEdit: false,
      cartList: []
    }
  },
  computed: {
    // 返回总价
    total() {
      return this.checkedItem.reduce((prev, cur) => {
        return cur.current_price * cur.number + prev
      }, 0)
    }
  },
  watch: {
    checked: {
      handler(newValue, oldValue) {
        if (newValue === true) {
          const arr = []
          const arrItem = []
          this.cartList.map(item => {
            arr.push(item.sku_id)
            arrItem.push(item)
          })
          this.checkedArr = arr
          this.checkedItem = arrItem
        } else {
          if (this.checkedArr.length === this.cartList.length) {
            this.checkedArr = []
            this.checkedItem = []
          }
        }
      }
    },
    checkedArr: {
      handler(newValue, oldValue) {
        const arr = []
        this.cartList.map(item => {
          newValue.map(i => {
            if (item.sku_id === i) {
              arr.push(item)
            }
          })
        })
        this.checkedItem = arr
        if (newValue.length === this.cartList.length) {
          this.checked = true
        } else {
          if (this.checked === true) {
            this.checked = false
          }
        }
      }
    }
  },
  created() {
    if (shopCart.getItem()) {
      this.cartList = JSON.parse(shopCart.getItem())
    } else {
      this.cartList = []
    }
  },
  methods: {
    onSubmit() {
      if (this.checkedItem.length === 0) {
        Toast('请选择商品')
      } else {
        const orderCartList = []
        this.checkedItem.map(item => {
          orderCartList.push({
            sku_id: item.sku_id,
            item_id: item.goods_info.id,
            buy_num: item.number
          })
        })
        store.dispatch('order/setCartList', JSON.stringify(orderCartList)).then(() => {
          this.$router.push({ path: '/orderConfirm?from=shop_cart' })
        })
      }
    },
    onClickRight() {
      this.isEdit = !this.isEdit
      if (this.isEdit === false) {
        shopCart.setItem(JSON.stringify(this.cartList))
      }
    },
    back() {
      this.$router.go(-1)
    },
    deleteCart() {
      if (this.checkedArr.length === 0) {
        Toast('您还没有选中商品')
      } else {
        Dialog.confirm({
          title: '',
          message: '确定删除选中的商品？'
        })
          .then(() => {
          // on confirm
            for (var i = this.cartList.length - 1; i >= 0; i--) {
              if (this.checkedArr.indexOf(this.cartList[i].sku_id) !== -1) {
                // 从checkedArr数组中也需要删除
                var index = this.checkedArr.indexOf(this.cartList[i].sku_id)
                this.checkedArr.splice(index, 1)
                this.cartList.splice(i, 1)
              }
            }
            shopCart.setItem(JSON.stringify(this.cartList))
          })
          .catch(() => {
          // on cancel
            console.log('你点击了取消')
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-header{
  position: sticky;
  top: 0;
  width: 100%;
  left: 0;
  background: #ffffff;
  z-index: 999;
}
.cart-content{
  .no-data{
    padding: 50px 0;
  }
  .goods-list{
    padding: 15px 15px 100px;
    padding-bottom: 100px;
    .goods-item{
      display: flex;
      padding: 15px 20px;
      font-size: 14px;
      box-shadow: 0px 0 20px #f0efef;
      border-radius: 10px;
      margin-bottom: 15px;
      .good-info{
        width: 90%;
        display: flex;
        img{
          width: 28%;
          height: 77px;
          margin-left: 10px;
          border-radius: 6px;
        }
        .good-info-right{
          width: 90%;
          padding-left: 10px;
          position: relative;
          .good-sku{
            margin-top: 5px;
            color: #666;
          }
          .good-price{
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 10px;
            span{
              width: 50%;
              display: inline-block;
              vertical-align: bottom;
            }
            .price{
              color: #ee0a24;
              font-size: 16px;
            }
            .number{
              color: #666;
              font-size: 14px;
              text-align: right;
            }
          }
        }
      }
    }
  }
}
.footer-operation{
  position: fixed;
  bottom: 50px;
  width: 100%;
  padding: 0 16px;
  height: 51px;
  line-height: 50px;
  background: #ffffff;
  box-sizing: border-box;
  border-top: 1px solid #f5f5f5;
  .van-submit-bar{
    border-top: 1px solid #f5f5f5;
    bottom: 50px;
    z-index: 999;
  }
  .operation-box{
    align-items: center;
    font-size: 14px;
    .delete-operat{
      text-align: right;
      button{
        width: 110px;
        height: 40px;
        font-weight: 500;
        line-height: 40px;
        border: none;
      }
    }
  }

}
</style>
