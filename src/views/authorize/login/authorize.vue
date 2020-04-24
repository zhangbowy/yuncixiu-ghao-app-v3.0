<template>
  <div />
</template>

<script>
import { login } from '@/api/user'
import { getUrlParam } from '@/utils'
export default {
  name: 'Accredit',
  data() {
    return {
    }
  },
  mounted() {
    const code = this.$route.query.code || getUrlParam('code')
    const state = this.$route.query.state || getUrlParam('state')
    login({ code }).then(res => {
      const role = res.data.role
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('role', role)
      this.$router.replace(state)
    })
  },
  methods: {
  }
}
</script>
