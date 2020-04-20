<template>
  <div>
    <div class="navbar">
      <top-bar :title="title" />
    </div>
    商品id: {{ id }}
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      title: this.$route.meta.title,
      id: this.$route.query.good_id
    }
  }
}
</script>

<style>

</style>

