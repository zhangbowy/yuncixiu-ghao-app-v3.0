<template>
  <div v-show="visible" class="loading-wrap">
    <div class="loading-box">
      <van-loading type="spinner" />
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-wrap {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.5);
}
.loading-box {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100px;
	transform: translate(-50%, -50%);
  font-size: 14px;
  text-align: center;
}
</style>
