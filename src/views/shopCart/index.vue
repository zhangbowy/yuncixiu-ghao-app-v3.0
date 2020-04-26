<template>
  <div class="cart-view">

    <div class="cart-header">
      <van-nav-bar
        title="购物车"
        :right-text="isEdit==true?'编辑':'管理'"
        left-arrow
        @click-right="onClickRight"
        @click-left="back"
      />
    </div>
    <div class="cart-content">
      <div class="goods-list">
        <van-checkbox-group v-model="checkedArr">
          <div v-for="(item,index) in cartList" :key="index" class="goods-item">
            <van-checkbox :name="item.id" checked-color="#ff6034" />
            <div class="good-info">
              <img :src="item.images" alt="" width="100">
              <div class="good-info-right">
                <div class="good-name">{{ item.goods_name }}</div>
                <div class="good-sku">规格：<span v-for="sku in item.skus" :key="sku.k">{{ sku.v }} </span></div>
                <div class="good-price">
                  <span class="price">￥{{ item.current_price }}</span>
                  <span class="number">x{{ item.number }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
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
            <van-button size="small" round hairline type="danger" @click.stop="deleteCart">删除({{ checkedArr.length }})</van-button>
          </van-col>
        </van-row>
      </div>
    </div>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      checkedArr: [],
      checkedItem: [],
      checked: false,
      isEdit: false

    }
  },
  computed: {
    // 返回总价
    total() {
      return this.checkedItem.reduce((prev, cur) => {
        return cur.current_price * cur.number + prev
      }, 0)
    },
    ...mapGetters([
      'cartList'
    ])
  },
  watch: {
    checked: {
      handler(newValue, oldValue) {
        if (newValue === true) {
          const arr = []
          const arrItem = []
          this.cartList.map(item => {
            arr.push(item.id)
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
            if (item.id === i) {
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
  methods: {
    onSubmit() {

    },
    onClickRight() {
      this.isEdit = !this.isEdit
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
            console.log('你点击了确认')
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
.cart-content{
  .goods-list{
    .goods-item{
      display: flex;
      padding: 10px 20px;
      margin-bottom: 10px;
      font-size: 14px;
      box-shadow: 0px 5px 20px #f3f3f3;
      .good-info{
        width: 90%;
        display: flex;
        img{
          width: 20%;
          height: 60px;
          margin-left: 10px;
        }
        .good-info-right{
          width: 90%;
          padding-left: 10px;
          position: relative;
          .good-sku{
            padding: 5px 0;
            color: #666;
            font-size: 14px;
          }
          .good-price{
            width: 100%;
            padding-top: 5px;
            position: absolute;
            bottom: 0;
            left: 10px;
            span{
              width: 50%;
              display: inline-block;
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
  bottom: 0;
  left: 0;
  height: 51px;
  width: 100%;
  border-top: 1px solid #f5f5f5;
  padding: 0 16px;
  box-sizing: border-box;
  .operation-box{
    align-items: center;
    font-size: 14px;
    height: 50px;
    .delete-operat{
      text-align: right;
    }
  }

}
</style>
