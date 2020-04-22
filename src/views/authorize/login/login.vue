<template>
  <div class="user-login">
    <div class="login-navbar">
      <top-bar :title="title" />
    </div>
    <div class="user-login-content">
      <div class="form-panle">
        <van-tabs line-width="30px" type="line" :border="false" @click="onClick">
          <van-tab title="密码登录">
            <div class="form-tabal">
              <van-form label-width="60px" @submit="onSubmit" @resetValidation="resetForm">
                <van-field
                  v-model="username"
                  name="username"
                  label="账号"
                  placeholder="请输入账号"
                  :rules="[{ required: true, message: '请输入账号' }]"
                />
                <van-field
                  v-model="password"
                  type="password"
                  name="password"
                  label="密码"
                  placeholder="请输入密码"
                  :rules="[{ required: true, message: '请输入密码' }]"
                />
                <div class="empower">
                  <van-checkbox v-model="checked" checked-color="#07c160" icon-size="16px" :label-disabled="true">我已阅读并接受 <a href="">网站使用规则</a>、<a href="">隐私政策</a>。</van-checkbox>
                </div>
                <div class="submit-btn">
                  <van-button icon-size="16px" round block type="info" native-type="submit" color="linear-gradient(to right, #4bb0ff, #6149f6)">
                    提交
                  </van-button>
                </div>
              </van-form>
            </div>
          </van-tab>
          <van-tab title="快速登录">
            <div class="form-tabal">
              <van-form label-width="60px" @submit="onSubmit" @resetValidation="resetForm">
                <van-field
                  v-model="username"
                  name="手机号"
                  label="手机号"
                  placeholder="请输入手机号"
                  :rules="[{ required: true, message: '请输入手机号' }]"
                />
                <van-field
                  v-model="sms"
                  center
                  clearable
                  label="验证码"
                  placeholder="请输入短信验证码"
                >
                  <template #button>
                    <van-button size="small" round type="primary" :disabled="codeDisaled" @click="sendMessage">{{ smsText }}</van-button>
                  </template>
                </van-field>
                <div class="empower">
                  <van-checkbox v-model="checked" checked-color="#07c160" icon-size="16px" :label-disabled="true">我已阅读并接受 <a href="">网站使用规则</a>、<a href="">隐私政策</a>。</van-checkbox>
                </div>
                <div class="submit-btn">
                  <van-button round block type="info" native-type="submit" color="linear-gradient(to right, #4bb0ff, #6149f6)">
                    提交
                  </van-button>
                </div>
              </van-form>
            </div>
          </van-tab>
        </van-tabs>

        <div class="wx-login">
          <svg-icon icon-class="weixin" @click.native="wxLogin" />
          <p>微信登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import SvgIcon from '@/components/SvgIcon'
import TopBar from '@/components/TopBar'
export default {
  components: {
    TopBar,
    SvgIcon
  },
  data() {
    return {
      loginType: 1,
      username: '18895364554',
      password: '123456',
      sms: '',
      smsText: '发送验证码',
      checked: false,
      codeDisaled: false,
      title: this.$route.meta.title
    }
  },
  methods: {
    onClick(name, title) {
      this.loginType = title === '密码登录' ? 1 : 2
      // 重制表单
      this.resetForm()
    },
    resetForm() {
      this.username = ''
      this.password = ''
      this.sms = ''
    },
    // 表单提交
    onSubmit(values) {
      console.log('submit', values)
      // 提交登录
      this.$store.dispatch('user/login', values).then(() => {
        this.$router.push({ path: this.redirect || '/' })
      }).catch((error) => {
        console.log(error)
      })
    },
    // 发送验证码
    sendMessage() {
      let time = 10
      this.smsText = time + 's'
      this.codeDisaled = true
      const timer = setInterval(() => {
        time -= 1
        this.smsText = time + 's'
        if (time === 0) {
          clearInterval(timer)
          this.smsText = '发送验证码'
          this.codeDisaled = false
        }
      }, 1000)
    },
    wxLogin() {
      Toast.loading({
        message: '微信登录...',
        forbidClick: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-login{
  // background: #f5f5f5;
  height: 100vh;
  .user-login-content{
    padding: 20px;
    .form-panle{
      background: #fff;
      padding: 20px 10px 10px;
      border-radius: 10px;
      box-shadow: 0px 5px 10px #cccccc;
      .form-tabal{
        padding: 20px 0;
        border-top: 1px solid #f5f5f5;
      }
      .empower{
        font-size: 12px;
        text-align: center;
        padding: 15px;
      }
      .submit-btn{
        padding: 0 16px;
      }
      .wx-login{
        text-align: center;
        margin-top: 50px;
        margin-bottom: 20px;
        p{
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>
