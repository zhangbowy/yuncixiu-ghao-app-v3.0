<template>
  <!--<van-popup :value="value" :style="{ width: '100%',height: '100vh' }" @input="val => this.$emit('input', val)">
    <div v-loading="loading" class="confirm-modal">
      <div class="confirm-content">
        <img :src="img" alt="" width="100%">
      </div>
      <div class="confirm-footer">
        <van-button size="small" color="#333" plain type="primary" @click="hidden">{{ $t(`返回修改`) }}</van-button>
        <van-button size="small" color="linear-gradient(to right, #ffd01e,#ff8917)">{{ $t(`加入购物车`) }}</van-button>
        <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="dobuy">{{ $t(`立即购买`) }}</van-button>
      </div>
    </div>
  </van-popup> -->
  <div v-if="value" class="preview-modal">
    <van-image-preview
      ref="imagePreview"
      v-model="value"
      v-loading="loading"
      :images="[img]"
      :closeable="true"
      :async-close="true"
      :show-index="false"
      @click.native="onImagePreviewClick"
    />
    <div class="confirm-footer">
      <van-button size="small" color="#333" plain type="primary" @click="hidden">{{ $t(`返回修改`) }}</van-button>
      <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="dobuy">{{ $t(`立即购买`) }}</van-button>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'

export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component
  },
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
      width: 100%;
      box-sizing: border-box;
    }
  }
  .confirm-footer{
    position: fixed;
    z-index: 9999;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    bottom: 20px;
    button{
      width: 30%;
    }
  }
</style>
