<template>
  <div class="home">
    <div class="title">刺绣花样库</div>
      <div class="first-page-show">
        <van-skeleton :row="6" :loading="loading">
          <div class="sample-box">
            <template v-for="(item,index) in figureList">
              <div :key="index+item.prev_png_path" class="sample-box-item">
                <img :src="item.prev_png_path" alt="" lazy-load @click="patternDialog(item)">
                <span v-if="item.is_presell==1" class="corner-mark">{{ '预售' }}</span>
              </div>
            </template>
          </div>
          <div v-if="figureList.length==0">
            <no-data :text="`${$t('暂无花样')}`" icon="no-data" :font-size="64" />
          </div>
        </van-skeleton>
      </div>
    <div class="div-content">
      <div style="display:flex; justify-content: space-between;">
          <van-popover
          :block="true"
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="top"
        >
          <template #reference>
            <van-button
            type="primary"
          >
            刺绣设计
          </van-button>
          </template>
        </van-popover>
        <van-button
          type="warning"
          @click="to_pencil"
        >
          手绘刺绣
        </van-button>
        <van-button
          type="danger"
          @click="to_letter"
        >文字刺绣
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { designApi } from '@/api/design'

export default {
  name: 'Home',
  components: {
  },
  props: {
    msg: String
  },
  data: function() {
    return {
      show_form: false,
      username: '',
      phone: '',
      error: false,
      req_num: 0,
      pngs: [],
      figureList: [],
      first: 0,
      loading: true,
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: '一般定制' }, { text: '特殊定制' }],
    }
  },

  created: function() {
    if (this.first == 0) {
      // window.location.reload()
     this.first = 1;
    }
    this.getFigure()
  },

  mounted: function() {
    // const me = this
    window.addEventListener('popState', this.go_back, false)
    // this.$refs.waterfall.waterfallOver(); // 取消下拉加载
    setTimeout(() => {
      this.loading = false
    }, 800)
  },
  destroyed() {
    window.removeEventListener('popState', this.go_back, false)
  },

  methods: {
    onSelect(action, index) {
      console.log(action, index)
      if (index === 0) {
        this.to_design()
      } else {
        this.to_special()
      }
    },
    patternDialog($item) {
      this.$router.push(`/customized/commonly-beta?goods_id=100&sku_id=qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id&design_id=${$item.design_id}&beta=1&template_id=2`)
    },
    getFigure() {
      designApi.getFigure({
        currentPage: 1,
        pageSize: 1000,
        design_category_id: this.category_id
      }).then(res => {
        this.figureList = res.data.data
      })
    },
    onclick_qrCode() {
    },
    to_special() {
      this.$router.push('/customized/special?goods_id=100&sku_id=qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id&design_id=&beta=1&template_id=2')
    },
    to_design: function() {
      this.$router.push('/customized/commonly?goods_id=100&sku_id=qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id&design_id=&beta=1&template_id=2')
    },
    to_letter: function() {
      this.$router.push('/customized/commonly?goods_id=100&sku_id=qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id&design_id=&beta=1&template_id=1')
    },
    to_img: function() {
      this.$router.push('/demo')
    },
    go_back: function() {
      console.log('hh')
      this.$router.push('/')
    },
    clickFn: function(event, { index, value }) {
      console.log('click事件')
      console.log('index', index)
      console.log('value', value)
      this.$router.push({
        path: '/demo',
        query: {
          img: value.src,
          file: value.file
        }
      })
      event.preventDefault()
    },

    to_pencil: function() {
      this.$router.push('/customized/handDrawn?goods_id=100&sku_id=qnlgkkmf9o00_id-peth0svajnc0_id_jcr3at6cmf40_id-lc3iko62alg0_id&beta=true')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  text-align: center;
  display: flex;
  flex-flow: column;
  min-height: 100vh;
}
.first-page-show {
  /* flex: 1; */
}
.div-content {
  margin: 10px;
}
.title {
  text-align: center;
  margin: 10px;
  font-size: 30px;
}
.van-button {
  margin: 0 10px;
}
.img-uploader {
  background: #f85;
  line-height: 44px;
  color: aliceblue;
}
.span-up {
  padding-right: 10px;
}
.van-uploader {
  display: block;
}

.modal-form .van-popup {
  width: 85%;
  overflow-x: hidden;
}
.commit-button {
  width: 95%;
  margin: 10px auto;
  text-align: center;
}
.first-page-show {
  /* height: 57vh; */
  overflow: auto;
}

.design-pngs {
  display: flex;
  flex-wrap: wrap;
}
.design-pngs div {
  width: 50%;
}
.design-pngs div img {
  object-fit: cover;
  width: 100%;
}

.sample-box{
  height: 74vh;
  overflow: auto;
  display: flex;
  flex-flow: wrap;
  align-items: center;
  background: #fff;
  padding-top: 10px;
  &-item{
    width:40%;
    border: 1px solid #f5f5f5;
    box-shadow: 0px 10px 20px #f3f3f3;
    margin: 0 5% 15px;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    img{
      width: 90%;
      border-radius: 6px;
      display: block;
    }
    .corner-mark{
      position: absolute;
      left: -3px;
      top: -1px;
      background: #ff2828;
      padding: 3px;
      border-radius: 6px 0 6px 0 ;
      font-size: 10px;
      color: #fff;
      transform: scale(0.8);
      display: inline-block;
    }
  }
}

.van-skeleton__content {
  display: flex;
  flex-wrap: wrap;
  .van-skeleton__row {
    width: 40% !important;;
    height: 170px;
    /* border: 1px solid #f5f5f5; */
    /* box-shadow: 0px 10px 20px #f3f3f3; */
    margin: 0 5% 15px;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 10px;
  }
}

</style>
