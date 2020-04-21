<template>
  <div class="cart-view">

    <div class="cart-header">
      <van-nav-bar
        title="购物车"
        right-text="管理"
        left-arrow
        @click-right="onClickRight"
        @click-left="back"
      />
    </div>
    <div class="cart-content" />
    <div class="cart-footer">
      <div v-if="!isEdit">
        <van-submit-bar :price="total" button-text="提交订单" @submit="onSubmit">
          <van-checkbox v-model="checked">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <!-- <div v-else class="footer-operation">
          <van-row>
            <van-col span="12"><van-checkbox v-model="checked">全选</van-checkbox></van-col>
            <van-col span="12"><van-button size="small" plain hairline type="warning">删除</van-button></van-col>
          </van-row>

        </div> -->
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 3050,
      checked: false,
      isEdit: false
    }
  },
  methods: {
    onSubmit() {

    },
    onClickRight() {

    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
