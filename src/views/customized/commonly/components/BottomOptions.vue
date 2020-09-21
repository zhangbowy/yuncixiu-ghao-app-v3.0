<template>
  <div class="bottomOptions">
    <div class="operate-btn">
      <div class="uoload-btn" @click="showTemplate">
        <svg-icon icon-class="template-icon" />
        <!-- <p>{{ $t(`选择模板`) }}</p> -->
        <p>{{ currentTemplate.template_name?currentTemplate.template_name:'选择模板' }}</p>
      </div>
      <div v-if="currentTemplate.emb_template_id!=2" class="model-btn" @click="showInputMode">
        <svg-icon :class="`mode-${isZh ? 'zh' : 'en'}`" :icon-class="isZh ? 'text' : 'cx'" />
        <p>{{ isZh ? $t('中文字体') : $t('刺绣字体') }}</p>
      </div>
      <div v-if="currentTemplate.emb_template_id!=1" class="uoload-btn" @click="showUpload">
        <svg-icon icon-class="upload-img" />
        <p>{{ $t(`上传图片`) }}</p>
      </div>
      <div v-if="currentTemplate.emb_template_id!=1" class="picture-library" @click="showImgList">
        <svg-icon icon-class="picture-lib" />
        <p>{{ $t(`花样库`) }}</p>
      </div>
    </div>
    <div class="footer-btn">
      <van-button icon="eye" color="#333" plain size="small" type="primary" @click="preview">{{ $t(`预览`) }}</van-button>
      <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="complete">{{ $t(`完成设计`) }}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTemplate: {
      type: Object,
      default: () => {}
    },
    isZh: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showInputMode() {
      this.$emit('change', 'showInputMode')
    },
    showTemplate() {
      this.$emit('change', 'showTemplate')
    },
    showUpload() {
      this.$emit('change', 'showUpload')
    },
    preview() {
      this.$emit('change', 'preview')
    },
    showImgList() {
      this.$emit('change', 'showImgList')
    },
    complete() {
      this.$emit('change', 'complete')
    }
  }
}
</script>

<style lang="scss">
  // 底部选项
  .bottomOptions{
    height: 125px;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    .operate-btn{
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 26px;
      border-top: 1px solid #f4f5f9;
      box-sizing: border-box;
      background: #ffffff;
      p{
        font-size: 12px;
        margin: 3px 0;
      }
      .model-btn {
        width: 50%;
        border-right: 1px solid #f5f5f5;
        .mode-zh {
          box-sizing: border-box;
          padding: 2px;
          width: 50px;
        }
      }
      .uoload-btn{
        width: 50%;
        border-right: 1px solid #f5f5f5;
      }
      .uoload-btn:first-child{
        border-left: 1px solid #f5f5f5;
      }
      .picture-library{
        width: 50%;
      }
    }
    .footer-btn{
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 60px;
      justify-content: space-between;
      button{
        width: 40%;
      }
    }
  }
</style>
