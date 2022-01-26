<template>
  <div>
    <div class="plp-bg login">
      <!-- <w-loading
        ref="loading"
        :type="1"
        v-if="showLoading"
      /> -->
      <div
        class="content"
      >
        <div class="login-img">
          <img
            :src="obj"
            alt=""
          >
        </div>
        <!-- @click="changeType(0)" -->
        <div class="login-register">
          <ul class="register-sec">
            <!-- :class="{'active':isLogin == 0}" -->
            <li class="active"><a href="javascript:0;">立即登录</a></li>
            <!-- :class="{'active':isLogin == 1}" -->
            <!-- <li><a href="javascript:0;">免费注册</a></li> -->
            <!-- @click="changeType(1)" -->
          </ul>
          <!-- 登录 -->
          <div class="login-list">
            <div>
              <div class="login-item">
                <div class="label">
                  <text
                    class="iconfont icon-yonghuming1"
                    v-if="type"
                  ></text>
                  <text
                    class="iconfont  icon-shoujihao3"
                    v-else
                  ></text>
                </div>
                <div class="item-center">
                  <!-- start 这里解决在谷歌浏览器上自动填充问题 -->
                  <!-- <input style="opacity: 0;position: absolute;">
                  <input
                    type="text"
                    style="opacity: 0;position: absolute;"
                  > -->
                  <!--end 这里解决在谷歌浏览器上自动填充问题 -->
                  <input
                    type="text"
                    v-model="name"
                    placeholder="请输入您的手机号码"
                    class="input"
                  />
                </div>
              </div>
              <div
                class="login-item"
                v-if="type"
              >
                <div class="label">
                  <text class="iconfont icon-mima1"></text>
                </div>
                <div class="item-center">
                  <!-- start 这里解决在谷歌浏览器上自动填充问题 -->
                  <!-- <input style="opacity: 0;position: absolute;">
                  <input
                    type="password"
                    style="opacity: 0;position: absolute;"
                  > -->
                  <!--end 这里解决在谷歌浏览器上自动填充问题 -->
                  <input
                    v-if="title == 'password'"
                    type="password"
                    v-model="pass"
                    placeholder="请输入密码"
                    class="input"
                  />
                  <input
                    v-else
                    type="text"
                    v-model="pass"
                    placeholder="请输入密码"
                    class="input"
                  />
                </div>
                <!-- <div class="item-right typePassword">
                  <text
                    v-if="title == 'password'"
                    class="iconfont  icon-bukejian"
                    @click="onClick(1)"
                  ></text>
                  <text
                    v-if="title == 'text'"
                    class="iconfont  icon-kejian"
                    @click="onClick(0)"
                  ></text>
                </div> -->
              </div>
              <div
                class="login-item"
                v-if="isCode && type"
              >
                <div class="label">
                  <text class="iconfont icon-yanzhengma1"></text>
                </div>
                <div class="item-center">
                  <!-- start 这里解决在谷歌浏览器上自动填充问题 -->
                  <!-- <input style="opacity: 0;position: absolute;">
                  <input
                    type="text"
                    style="opacity: 0;position: absolute;"
                  > -->
                  <!--end 这里解决在谷歌浏览器上自动填充问题 -->
                  <input
                    type="text"
                    v-model="code"
                    placeholder="请输入图形验证码"
                    class="input"
                  />
                </div>
                <div
                  class="item-right item-right-getcode"
                  @click="onClick2"
                >
                  <img
                    :src="codeImg"
                    alt=""
                    class="form-img"
                    :lazy-load="true"
                  />
                </div>
              </div>
              <div
                class="login-item"
                v-if="!type"
              >
                <div class="label">
                  <text class="iconfont icon-duanxinyanzheng"></text>
                </div>
                <div class="item-center">
                  <!-- start 这里解决在谷歌浏览器上自动填充问题 -->
                  <input style="opacity: 0;position: absolute;">
                  <input
                    type="text"
                    style="opacity: 0;position: absolute;"
                  >
                  <!--end 这里解决在谷歌浏览器上自动填充问题 -->
                  <input
                    type="text"
                    v-model="code"
                    placeholder="请输入您的手机验证码"
                    class="input"
                  />
                </div>
                <div class="item-right item-right-getcode">
                  <div
                    class="getCode"
                    @click="sendCodeWithLogin"
                    v-show="timeout == '获取验证码'"
                  >
                    发送验证码
                  </div>
                  <div
                    class="getCode"
                    v-show="timeout != '获取验证码'"
                  >
                    {{timeout}}s
                  </div>
                </div>
              </div>
            </div>
            <div class="forget">
              <ul>
                <li></li>
                <li @click="changeType">
                  <a
                    href="javascript:0;"
                    v-if="type"
                  >短信验证码登录</a>
                  <a
                    v-else
                    href="javascript:0;"
                  >账号密码登录</a>
                </li>
              </ul>
            </div>
            <div
              class="sgin"
              @click="onClick1"
            >
              登 录
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {loginAccount} from '@/api/user'
  export default {
    name: "login",
    data() {
      return {
        showLoading: true,
        loading: false,
        title: 'password',
        obj: '',
        name: '',
        pass: '',
        text: 0,
        codeImg: '', // 验证码
        code: '',
        isCode: false,
        type: 1,
        timeout: "获取验证码",
        bgColor: "background:#f8f8f8;padding-left:10px;"
        // img:true
      };
    },
    created() {
      // this.MyNode();
      this.$nextTick(() => {
        // this.$refs.loading.open();
      });
      // this.CodeImg();
    },
    methods: {
      changeType() {
        this.type = !this.type;
        this.code = '';
      },
      receiveItem(e, type) {
        this[type] = e.detail;
      },
      sendCodeWithLogin() {
        this.$http.get(this.$api.sendCodeWithLogin, { mobile: this.name }).then(res => {
          if (res.status == 1) {
            this.timeout = "60";
            const it = setInterval(() => {
              this.timeout = (Number.parseInt(this.timeout) - 1).toString();
              if (this.timeout === "0") {
                clearInterval(it);
                this.timeout = "获取验证码";
              }
            }, 1000);
          } else {
            this.tooltip(res.msg);
          }
        });
      },
      MyNode() {
        this.$http.post(this.$api.MyNode, {}).then(res => {
          if (res.status == 1) {
            this.obj = res.data.logo;
            this.showLoading = false;
            // if(!res.data.logo){
            //     this.img=false
            // }
          } else {
            this.tooltip(res.msg);
          }
        });
      },
      Login() {
        let params;
        if (this.type) {
          params = {
            phone: Number(this.name),
            password: this.pass,
            code: this.code,
            login_type: 1, // 1 密码登录
          };
        } else {
          params = {
            phone: Number(this.name),
            password: "",
            code: this.code,
            login_type: 2, // 2 验证码登录
          };
        }
        loginAccount(params).then(res => {
          if (res.code === 0) {
            this.$toast.success('登陆成功')
            this.$router.push({
              path: '/'
            })
          } else {
            this.$toast.fail(res.msg[0])
            this.isCode = res.data.isCode;
            this.tooltip(res.msg);
            if (this.isCode == true) { // 控制验证码显示
              this.tooltip(res.msg[0]);
              // this.title = document.querySelector("#center-bottom")
              // this.title.style.display = "block"
              this.CodeImg(); // 调用验证码
            }
          }
        });
      },
      CodeImg() {
        this.codeImg = this.$http.baseURL + this.$api.CodeImg + '?' + new Date().getTime();
      },
      onClick(type) {
        if (type == 1) {
          this.title = "text";
        } else {
          this.title = "password";
        }
      },
      onClick1() { // 登陆
        this.Login();
      },
      onClick2() { // 更新验证码
        this.CodeImg();
      }
    }
  };
</script>
<style lang="scss">
  .plp-bg {
    position: fixed;
    height: 100%;
    top: 0;
    width: 100%;
  }
  .login {
    background: url("http://cos-cx-n1-1257124629.cos.ap-guangzhou.myqcloud.com/design/13/33/2021-03-15-21:52:31/43de060c-14a9-4588-aad9-a303d6d47e13.PNG")
      center center no-repeat;
    background-size: cover;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 315px;
    z-index: 9;
    .login-img {
      text-align: center;
      width: 82px;
      height: 82px;
      margin: 0 auto;
      margin-bottom: 30px;
      img {
        width: 100%;
        border-radius: 16px;
      }
    }
    .login-register {
      // background: #ffffff;
      background: url("http://img.wkdao.com/image/65/2020/12/21/81b2e2641132f63aa0afbaff8ac3451d.png")
        no-repeat;
      background-size: 100% 100%;
      border-radius: 30px;
      padding: 30px;
      .register-sec {
        display: flex;
        padding-bottom: 10px;
        li {
          text-align: center;
          flex: 1;
          a {
            color: #666666;
            font-size: 15px;
            font-weight: 400;
          }
        }
        .active {
          a {
            padding-bottom: 10px;
            border-bottom: 3px solid #ff1947;
            color: #333333;
          }
        }
      }
    }
    .login-list {
      .login-item {
        height: 44px;
        margin-top: 15px;
        border-radius: 2px;
        background: #f8f8f8;
        display: flex;
        align-items: center;
        .label {
          // width: 20px;
          // height: 20px;
          // background: #dddddd;
          text-align: center;
          // line-height: 40px;
          flex-shrink: 0;
          margin-right: 10px;
          text {
            font-size: 16px;
            color: #b1b1b1;
            margin-left: 18px;
          }
        }
        .item-center {
          z-index: 10;
          font-size: 15px;
        }
        .item-right {
          float: right;
          width: 60px;
          height: 44px;
          flex-shrink: 0;
          z-index: 100;
          .form-img {
            width: 100%;
            height: 100%;
            border-top-right-radius: 44px;
            border-bottom-right-radius: 44px;
          }
          .getCode {
            line-height: 44px;
            text-align: center;
            color: #ff8813;
            font-size: 14px;
          }
        }
        .item-right-getcode {
          width: 2.5rem;
        }
        .typePassword {
          display: flex;
          align-items: center;
          justify-items: flex-end;
          flex-direction: row-reverse;
          margin-right: 15px;
        }
      }
      .forget {
        margin-top: 7px;
        color: #666666;
        ul {
          display: flex;
          justify-content: space-between;
          a {
            color: #666666;
            font-size: 14px;
          }
        }
        .remarks {
          color: #ff6969;
          font-weight: 400;
        }
      }
      .sgin {
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
        background: #ff1947;
        margin-top: 12px;
        color: #ffffff;
        font-size: 15px;
        border-radius: 22px;
      }
    }
  }
</style>
<style scoped>
  .item-center .input{
    border: none;
    /* font-size: 16px; */
    background: #f8f8f8;
    padding: 0 10px;
  }
  .item-center >>> input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #f8f8f8 inset;
    /* background: #ffffff; */
  }
  .item-center .input {
    position: static;
    padding: 0;
    width: 100%;
  }

  .item-center >>> .uni-input-input:-webkit-autofill,
  .item-center >>> .uni-input-input:-webkit-autofill:hover,
  .item-center >>> .uni-input-input:-webkit-autofill:focus {
    box-shadow: 0 0 0px 1000px #f8f8f8 inset;
    border-radius: 0;
    appearance: none;
  }

  .item-center :-ms-input-placeholder {
    font-size: 15px;
    color: #999999;
  }
</style>



