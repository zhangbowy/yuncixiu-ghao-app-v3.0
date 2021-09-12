<template>
  <van-popup :value="value" :style="{ width: '80%' }" round closeable @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">{{ $t(`选择模板`) }}</div>
      <div class="modal-content ">
        <div class="figure-list">
          <div v-for="(item,index) in dataList" :key="index" class="figure-item" :class="{checked:currentTemplate.emb_template_id == item.emb_template_id}">
            <img :src="item.cover_image" alt="" @click="checkTeplateItem(item)">
            <p class="temp-name">{{ item.template_name }}</p>
          </div>
        </div>
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
    currentTemplate: {
      type: Object,
      default: () => {}
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    checkTeplateItem(item) {
      this.$emit('change', item)
    }
  }
}
</script>

<style>

</style>
