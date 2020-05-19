<template>
  <van-popup :value="value" :style="{ width: '100%',height: '100vh' }" @input="val => this.$emit('input', val)">
    <div v-loading="loading" class="confirm-modal">
      <div class="confirm-content">
        <img :src="img" alt="" width="100%">
      </div>
      <div class="confirm-footer">
        <van-button size="small" color="#333" plain type="primary" @click="hidden">返回修改</van-button>
        <van-button size="small" color="linear-gradient(to right, #ffd01e,#ff8917)">加入购物车</van-button>
        <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="dobuy">立即购买</van-button>
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
    loading: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    }
  },
  methods: {
    dobuy() {
      this.$emit('dobuy')
    },
    hidden() {
      this.$emit('hidden')
    }
  }
}
</script>

<style lang="scss">
.confirm-modal{
    height: 100vh;
    position: relative;
    .confirm-content{
      padding: 12px;
      text-align: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .confirm-footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 7vh;
      box-sizing: border-box;
      justify-content: space-between;
      button{
        width: 30%;
      }
    }
  }
</style>
