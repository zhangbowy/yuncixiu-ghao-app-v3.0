<template>
  <div class="bottomOptions">
    <div class="operate-btn">
      <div class="uoload-btn" @click="showTemplate">
        <svg-icon icon-class="template-icon" />
        <p>选择模板</p>
      </div>
      <div v-if="currentTemplate.emb_template_id!=1" class="uoload-btn" @click="showUpload">
        <svg-icon icon-class="upload-img" />
        <p>上传花样</p>
      </div>
      <div class="picture-library" @click="showImgList">
        <svg-icon icon-class="picture-lib" />
        <p>花样库</p>
      </div>
    </div>
    <div class="footer-btn">
      <van-button icon="eye" color="#333" plain size="small" type="primary" @click="preview">预览</van-button>
      <van-button size="small" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="complete">完成设计</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTemplate: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
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
    height: 15vh;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    .operate-btn{
      height: 8vh;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      font-size: 26px;
      border-top: 1px solid #f4f5f9;
      box-sizing: border-box;
      background: #ffffff;
      p{
        font-size: 12px;
        margin: 3px 0;
      }
      .uoload-btn{
        width: 50%;
        border-right: 1px solid #f5f5f5;
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
      height: 7vh;
      justify-content: space-between;
      button{
        width: 40%;
      }
    }
  }
</style>
