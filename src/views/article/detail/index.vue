<template>
  <div class="article-detail">
    <div v-html="content" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style>

</style>
