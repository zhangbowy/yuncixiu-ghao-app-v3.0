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
          <div class="left-text">{{ $t(`我的订单`) }}</div>
          <div class="right-text" @click="toOrderList(0)">
            <span>{{ $t(`查看全部订单`) }}</span>
            <svg-icon icon-class="right-arrow" />
          </div>
        </div>
        <div class="cell-item-box">
          <div class="cell-item" @click="toOrderList(1)">
            <svg-icon icon-class="wait-confirm" />
            <p>{{ $t(`待支付`) }}</p>
          </div>
          <div class="cell-item" @click="toOrderList(2)">
            <svg-icon icon-class="wait-defray" />
            <p>{{ $t(`待发货`) }}</p>
          </div>
          <div class="cell-item" @click="toOrderList(3)">
            <svg-icon icon-class="wait-receive" />
            <p>{{ $t(`待收货`) }}</p>
          </div>
          <div class="cell-item" @click="toOrderList(4)">
            <svg-icon icon-class="isok" />
            <p>{{ $t(`已完成`) }}</p>
          </div>
        </div>
      </div>

      <div class="cell-box">
        <cell-item icon-name="site-icon" :left-text="`${$t('地址管理')}`" path="/addressList" />
        <cell-item icon-name="language" :left-text="`${$t('语言')}`" @click.native="onLanguageBtnClick" />
        <cell-item icon-name="about" :left-text="`${$t('关于我们')}`" path="/about" />
      </div>
    </div>
    <van-dialog v-model="show" :title="`${$t('切换语言')}`" :show-confirm-button="false" :close-on-click-overlay="true">
      <van-list>
        <van-cell v-for="lang in langsType" :key="lang.name" :title="lang.title" center clickable @click="onLangClick(lang.name)" />
      </van-list>
    </van-dialog>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import CellItem from '@/components/Cell/CellItem'
import { mapGetters } from 'vuex'
import { Locale } from 'vant'
import zhCN from 'vant/lib/locale/lang/zh-CN'
import enUS from 'vant/lib/locale/lang/en-US'
export default {
  components: {
    SvgIcon,
    CellItem
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'userInfo',
      'langsType'
    ])
    // name() {
    //   return this.data
    // }
  },
  created() {

  },
  methods: {
    onLangClick(lang) {
      document.documentElement.dataset.lang = lang
      this.$i18n.locale = lang || 'zh'
      Locale.use(lang, lang === 'zh' ? zhCN : enUS)
      this.$store.dispatch('settings/changeSetting', { key: 'lang', value: lang })
      this.show = false
    },
    onLanguageBtnClick() {
      this.show = true
      console.log()
    },
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
    background: linear-gradient(to top,#ff6034,#ee0a24);
    padding: 30px 20px 70px;
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
        color: #fff;
      }
      p.user-phone{
        color: #999;
        font-size: 12px;
      }
    }
  }
  .content-view{
    padding: 10px;
    position: relative;
    padding-top: 60px;
    .order-cell{
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 0px 2px 15px #f3f3f3;
      position: absolute;
      width: 95%;
      box-sizing: border-box;
      top: -48px;
      background: #fff;
      &-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f5f5f5;
        padding: 10px 0;
        .left-text{
          color: #000;
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
    border-radius: 10px;
    margin-top: 20px;
    background: #fff;
    .cell-item{
      border: none;
    }
  }
  .van-cell__title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep .cell-item .left-box {
    width: 80%;
  }
}
</style>
