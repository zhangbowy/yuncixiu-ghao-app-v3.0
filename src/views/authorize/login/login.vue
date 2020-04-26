<template>
  <div />
</template>

<script>
import { isWeiXin } from '@/utils'
import store from '@/store'
export default {
  created() {
    this.userLogin()
  },
  methods: {
    userLogin() {
      if (isWeiXin()) {
        store.dispatch('user/login')
      } else {
        store.dispatch('user/loginDev')
      }
    }
  }
}
</script>

<style>

</style>
