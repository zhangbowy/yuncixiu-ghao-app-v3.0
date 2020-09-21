<template>
  <div ref="customized" class="customized">
    <div class="navbar">
      <!-- tab标题栏 -->
      <van-nav-bar
        :title="`${$t('开始设计')}`"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
      >
        <template #right>
          <van-dropdown-menu style="height: 45px;border: none">
            <van-dropdown-item ref="item">
              <van-cell :title="`${$t('一般定制')}`" is-link :to="`/customized/commonly?goods_id=${goods_id}&sku_id=${sku_id}`" @click="onConfirm" />
              <van-cell :title="`${$t('特殊定制')}`" is-link :to="`/customized/special?goods_id=${goods_id}&sku_id=${sku_id}`" @click="onConfirm" />
              <van-cell :title="`${$t('手绘')}`" is-link :to="`/customized/handDrawn?goods_id=${goods_id}&sku_id=${sku_id}`" @click="onConfirm" />
            </van-dropdown-item>
          </van-dropdown-menu>
        </template>
      </van-nav-bar>
    </div>
    <div class="customized-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      value1: 0,
      goods_id: this.$route.query.goods_id,
      sku_id: this.$route.query.sku_id,
      option1: [
        { text: `${this.$t('一般定制')}`, value: 0 },
        { text: `${this.$t('特殊定制')}`, value: 1 },
        { text: `${this.$t('手绘')}`, value: 2 }
      ]
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onConfirm() {
      this.$refs.item.toggle()
    }
  }
}
</script>
<style lang="scss">
.customized{
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 9999;
    .van-nav-bar__right {
      padding-right: 0.6rem;
    }
    .van-dropdown-menu__bar {
      height: 100%;
      box-shadow: none;
    }
  }
  .customized-content{
    height: 100vh;
    box-sizing: border-box;
  }
  .van-hairline--top-bottom::after{
    border: 0;
  }
}
</style>
