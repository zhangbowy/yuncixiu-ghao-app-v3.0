<template>
  <div class="home">
    <div class="login-title">用户登录</div>
    <div class="form-item">
      <svg-icon icon-class="yonghu" />
      <input v-model="username" type="text" placeholder="请输入用户名">
    </div>
    <div class="form-item">
      <svg-icon icon-class="lock" />
      <input v-model="password" type="password" placeholder="请输入密码">
    </div>
    <button class="" @click="userLogin">立即登录</button>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'Home',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    userLogin() {
      login({
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="scss" >
  .home{
    padding: 100px 0;
    text-align: center;
    .login-title{
      margin-bottom: 20px;
      font-size: 24px;
    }
    .form-item{
      margin-bottom: 20px;
      input{
        background: #f5f5f5;
        outline: none;
        border: 1px solid #f3f4f3;
        margin-left: 10px;
        padding: 8px 10px;
        width: 180px;
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    button{
      display: block;
      margin: 0 auto;
      font-size: 18px;
      width: 60%;
      margin: 0 auto;
      background: #02b7ff;
      color: #fff;
      outline: none;
      border: 1px solid #02b7ff;
      border-radius: 12px;
      padding: 10px 0;
      box-shadow: 2px 10px 20px #cccccc;
    }
  }
</style>
