<template>
  <van-popup :value="value" :style="{ width: '80%' }" round @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">{{ title }}</div>
      <div class="modal-content">
        <slot name="modalcontent" />
      </div>
      <div class="footer-button">
        <van-button color="#999" size="small" plain round @click="cancel">取消</van-button>
        <van-button color="linear-gradient(to right, #ff6034,#ee0a24)" size="small" round @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
// 弹框
  .modal{
    position: relative;
    z-index: 999;
    .modal-title{
      font-size: 16px;
      padding: 18px;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
    }
    .modal-content{
      padding: 12px;
    }
    .footer-button{
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0 15px;
      border-top: 1px solid #f5f5f5;
      button{
        width: 40%;
      }
    }
  }
</style>
