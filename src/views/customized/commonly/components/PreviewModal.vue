<template>
  <!-- 预览设计 -->
  <!-- <van-popup :value="value" :style="{ width: '80%' }" round closeable @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">{{ $t(`预览`) }}</div>
      <div v-loading="loading" class="modal-content preview-content">
        <img :src="img" alt="" width="100%">
      </div>
      <div class="footer-button">
        <van-button size="small" style="width: 50%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onComplete">{{ $t(`完成设计`) }}</van-button>
      </div>
    </div>
  </van-popup> -->
  <div class="preview-modal">
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
    <div v-if="operate">
      <div v-if="showImagePreview" :class="['preview-btns', showBtns && 'preview-btns--active' ]">
        <van-button size="small" style="width: 30%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onComplete">{{ $t(`完成设计`) }}</van-button>
        <van-button size="small" style="width: 30%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="onShareBtnClick">{{ $t(`定制分享`) }}</van-button>
      </div>
      <van-dialog v-model="showShare" title="" :show-cancel-button="false" :show-confirm-button="false" :close-on-click-overlay="true" @closed="onShareSheetCancel">
        <span>
          快去点击右上角分享好友吧 ~
        </span>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Dialog } from 'vant'
import wechatInterface from '@/utils/wxUtils'
import { wxSdkApi } from '@/api/common'
export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Dialog.Component.name]: Dialog.Component
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
    },
    goodsInfo: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Boolean,
      default: true
    },
    isBeta: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showShare: false,
      showBtns: false,
      showImagePreview: false
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.showBtns = newValue
        this.showImagePreview = newValue
      }
    },
    loading: {
      handler(newValue, oldValue) {
        if (!newValue) {
          this.wxShare()
        }
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
          break
        case 'link':
          this.copyLink()
          break
        default:
          break
      }
      this.showShare = false
      this.showBtns = true
    },
    // 微信分享
    wxShare() {
      wxSdkApi.getJsConfig({
        url: window.location.origin
      }).then(res => {
        // this.doshare(res.data, 0)
        const { design_id, goods_id } = this.$route.query || {}
        const desc = localStorage.getItem('desc')
        const shareInfo = {}
        shareInfo.data = res.data
        shareInfo.shareInfo = {
          thumb_image_path: this.img,
          id: goods_id,
          design_id: design_id,
          desc,
          name: this.goodsInfo?.item.name,
          has_preview: true
        }
        wechatInterface(shareInfo, 'share', success => {
          // Toast(`${this.$t('请点击右上角分享定制')}!`)
        }, fail => {
        })
      })
    },
    onShareSheetClickOverlay() {
      // this.showShare = !this.showShare;
      this.showBtns = !this.showBtns
    },
    onShareBtnClick() {
      this.showShare = true
      this.showBtns = false
      // this.wxShare()
    },
    onShareSheetCancel() {
      this.showShare = false
      this.showBtns = true
    },
    onImagePreviewClick(e) {
      if (e.target.classList.contains('van-icon-clear')) {
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
  .van-dialog__content {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
