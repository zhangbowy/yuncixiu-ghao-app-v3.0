<template>
  <!-- 预览设计 -->
  <div>
    <van-image-preview
      ref="imagePreview"
      v-model="value"
      :images="[img]"
      :async-close="true"
      :show-index="false"
      @click.native="onImagePreviewClick"
    />
    <div class="preview-btns">
      <van-button size="small" style="width: 30%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onBtnClick">进入商城</van-button>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      value: true,
      img: '',
      goods_id: '',
      design_id: ''
    }
  },
  created() {
    const img = this.$route?.query.img_url || ''
    this.goods_id = this.$route?.query.goods_id || ''
    this.design_id = this.$route?.query.design_id || ''
    if (img) {
      this.img = img
    } else {
      this.$toast({
        message: '图片加载出错！'
      })
    }
  },
  methods: {
    onImagePreviewClick() {
      console.log('onImagePreviewClick')
    },
    onBtnClick() {
      this.$router.push({ path: '/goodsDetail', query: { goods_id: this.goods_id, design_id: this.design_id }})
    }
  }
}
</script>

<style lang='scss'>
  .preview-btns {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 60px;
    z-index: 10000;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-around;
    transition: bottom 0.3s linear;
    &--active {
      bottom: 24px;
    }
  }
</style>
