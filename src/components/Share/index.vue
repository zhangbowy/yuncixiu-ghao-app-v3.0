<template>
  <div>
    <van-share-sheet
      v-model="show"
      :title="`${$t('立即分享给好友')}`"
      :options="options"
      @select="onSelect"
    />
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        { name: `${this.$t('微信')}`, icon: 'wechat' }
        // { name: `${this.$t('微博')}`, icon: 'weibo' },
        // { name: `${this.$t('复制链接')}`, icon: 'link' },
        // { name: `${this.$t('分享海报')}`, icon: 'poster' },
        // { name: `${this.$t('二维码')}`, icon: 'qrcode' }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 分享按钮选中
    onSelect(option) {
      this.$emit('showShare', false)
      switch (option.name) {
        case `${this.$t('微信')}`:
          this.bindShareTimeLine()
          break
        case `${this.$t('朋友圈')}`:
          this.bindShareAppMessage()
          break
        case 'QQ':
          this.bindShareQQ()
          break
        case 'QQ空间':
          this.bindShareQzone()
          break
      }
    }

  }
}
</script>

<style>

</style>
