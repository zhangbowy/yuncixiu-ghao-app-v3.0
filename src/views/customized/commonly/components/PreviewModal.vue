<template>
  <!-- 预览设计 -->
  <!-- <van-popup :value="value" :style="{ width: '80%' }" round closeable @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">预览</div>
      <div v-loading="loading" class="modal-content preview-content">
        <img :src="img" alt="" width="100%">
      </div>
      <div class="footer-button">
        <van-button size="small" style="width: 50%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onComplete">完成设计</van-button>
      </div>
    </div>
  </van-popup> -->
  <div class="preview-modal">
    <van-image-preview 
      ref="imagePreview"
      v-loading="loading" 
      v-model="value" 
      :images="[img]" 
      :closeable='true'
      :async-close='true' 
      :show-index='false' 
      @click.native="onImagePreviewClick">
    </van-image-preview>
    <div :class="['preview-btns', showBtns && 'preview-btns--active' ]"  v-if="showImagePreview">
      <van-button size="small" style="width: 30%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onComplete">完成设计</van-button>
      <van-button size="small" style="width: 30%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onShareBtnClick">定制分享</van-button>
    </div>
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
      @cancel='onShareSheetCancel'
      @click-overlay='onShareSheetClickOverlay'
    />
    <input type="text" id="copyer" ref="copyer">
  </div>
</template>

<script>
import { ImagePreview, ShareSheet, Toast } from 'vant'
import wechatInterface from '@/utils/wxUtils'
import { wxSdkApi } from '@/api/common'
export default {
  model: {
    prop: 'value',
    event: 'onChange'
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      showShare: false,
      showBtns: false,
      showImagePreview: false,
      options: [
        { name: '微信', icon: 'wechat' },
        // { name: '微博', icon: 'weibo' },
        // { name: '复制链接', icon: 'link' },
        // { name: '分享海报', icon: 'poster' },
        // { name: '二维码', icon: 'qrcode' },
      ],
    }
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
  watch:{
    value: {
      handler (newValue, oldValue) {
        this.showBtns = newValue;
        this.showImagePreview = newValue;
      }
    }
  },
  methods: {
    onComplete() {
      this.$emit('complete')
    },
    onSelect(option) {
      // Toast(option.name);
      switch (option.icon) {
        case 'wechat': 
          this.wxShare()
          break;
        case 'link':
          this.copyLink()
          break;
        default: 
          break;
      }
      this.showShare = false;
      this.showBtns = true;
    },
    // 微信分享
    wxShare() {
      wxSdkApi.getJsConfig({
        url: window.location.origin
      }).then(res => {
        // this.doshare(res.data, 0)
        let {design_id, goods_id} = this.$route.query || {}
        const shareInfo = {}
        shareInfo.data = res.data
        shareInfo.shareInfo = {
          thumb_image_path: this.img,
          id: goods_id,
          design_id: design_id,
        }
        wechatInterface(shareInfo, 'share', success => {
          Toast('请点击右上角分享定制!');
        }, fail => {
        })
      })
    },
    copyLink () {
      const url = window.location.origin
      const copyer = this.$refs['copyer']
      copyer.value = url
      copyer.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
    },
    onShareSheetClickOverlay () {
      // this.showShare = !this.showShare;
      this.showBtns = !this.showBtns;
    },
    onShareBtnClick () {
      this.showShare = true
      this.showBtns = false;
    },
    onShareSheetCancel () {
      this.showShare = false;
       this.showBtns = true;
    },
    onImagePreviewClick (e) {
      if ( e.target.classList.contains('van-icon-clear') ) {
        this.$emit('change', false)
      }
    }
  }
}
</script>

<style lang="scss">
  .preview-content{
      position: relative;
      min-height: 120px;
    }
  .preview-btns {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -60px;
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
  #copyer {
    // display: none;
    width: 0;
    height: 0;
    position: absolute;
    top: -100;
    z-index: -100;
  }
</style>
