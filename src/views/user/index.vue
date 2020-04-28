<template>
  <div class="user-view">
    <div class="top-info">
      <img class="user-avator" :src="avatar" alt="">
      <div class="accout-info">
        <p class="user-name">{{ name }}</p>
        <p v-if="userInfo.phone " class="user-phone">账号：{{ userInfo.phone }}</p>
      </div>
    </div>
    <div class="content-view">
      <div class="order-cell">
        <div class="order-cell-title">
          <div class="left-text">我的订单</div>
          <div class="right-text" @click="toOrderList(0)">
            <span>查看全部订单</span>
            <svg-icon icon-class="right-arrow" />
          </div>
        </div>
        <div class="cell-item-box">
          <div class="cell-item" @click="toOrderList(1)">
            <svg-icon icon-class="wait-confirm" />
            <p>待支付</p>
          </div>
          <div class="cell-item" @click="toOrderList(4)">
            <svg-icon icon-class="wait-defray" />
            <p>待发货</p>
          </div>
          <div class="cell-item" @click="toOrderList(5)">
            <svg-icon icon-class="wait-receive" />
            <p>待收货</p>
          </div>
          <div class="cell-item" @click="toOrderList(6)">
            <svg-icon icon-class="isok" />
            <p>已完成</p>
          </div>
        </div>
      </div>

      <div class="cell-box">
        <cell-item icon-name="site-icon" left-text="地址管理" path="/addressList" />
        <cell-item icon-name="about" left-text="关于我们" path="/about" />
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import CellItem from '@/components/Cell/CellItem'
import { mapGetters } from 'vuex'
export default {
  components: {
    SvgIcon,
    CellItem
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'userInfo'
    ])
    // name() {
    //   return this.data
    // }
  },
  created() {

  },
  methods: {
    toOrderList(type) {
      if (type) {
        this.$router.push({ path: `/orderList?current_type=${type}` })
      } else {
        this.$router.push({ path: '/orderList' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-view{
  .top-info{
    background: #fff;
    padding: 10px 20px;
    border-bottom: 10px solid #f5f5f5;
    img.user-avator{
      width: 60px;
      height: 60px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 50%;
    }
    .accout-info{
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      width: 70%;
      padding-left: 20px;
      p{
        margin: 0;
        padding: 5px 0;
      }
      p.user-phone{
        color: #999;
        font-size: 12px;
      }
    }
  }
  .content-view{
    padding: 10px;
    .order-cell{
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 0px 5px 20px #f3f3f3;
      &-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding: 10px 0;
        .left-text{
          color: #333;
          font-size: 16px;
        }
        .right-text{
          color: #666;
          font-size: 14px;
          text-align: right;
        }
      }
      .cell-item-box{
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px 0;
        .cell-item{
          width: 25%;
          text-align: center;
          font-size: 24px;
          p{
            font-size: 12px;
            margin: 5px;
          }
        }
      }
    }
  }
  .cell-box{
    padding: 10px;
    box-shadow: 0px 10px 20px #f3f4f3;
    border-radius: 10px;
    margin-top: 20px;
    background: #fff;
    .cell-item:last-child{
      border: none;
    }
  }
}
</style>
