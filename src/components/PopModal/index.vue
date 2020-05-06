<template>
  <van-popup v-model="show" :style="{ width: '80%', minheight: '30%' }" round closeable>
    <div class="upload-modal">
      <div class="modal-title">{{ title }}</div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>

</style>
