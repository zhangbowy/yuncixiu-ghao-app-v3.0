<template>
  <div class="slide-figure">
    <div class="slide-figure-title"><span>{{ title }}</span></div>
    <div ref="wrapper" class="figure-list-wrapper">
      <div ref="cont" class="figure-list">
        <div v-for="(group,index) in listData" :key="index" ref="group" class="figure-list-group">
          <div v-for="(item,i) in group.list" :key="i+item.prev_png_path" class="figure-list-item">
            <img :src="item.prev_png_path" alt="" @click="patternDialog(item)">
            <span v-if="item.is_presell==1" class="corner-mark">{{ $t('预售') }}</span>
          </div>
        </div>
      </div>
      <div :class="['figure-list-loading', loading && 'figure-list-loading--active']"><van-icon name="replay" /></div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll' // 导入better-scroll
import { Dialog } from 'vant'
import { designApi } from '@/api/design'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      figureList: [],
      pageSize: 12,
      currentPage: 1,
      scroll: '',
      finished: false,
      loading: false,
      listData: [
        {
          width: 0,
          list: []
        },
        {
          width: 0,
          list: []
        },
        {
          width: 0,
          list: []
        }
      ]
    }
  },
  computed: {
    list() {
      const list = []
      let flag = 0
      let templateArr = []
      this.figureList.forEach(figure => {
        templateArr.push(figure)
        flag++
        if (flag > 2) {
          list.push(templateArr)
          templateArr = []
          flag = 0
        }
      })
      return list
    }
  },
  watch: {
    '$route': {
      handler(newValue) {
        if (newValue.name === 'Index') {
          this.verScroll()
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      return designApi.getFigure({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        is_presell: 1
      }).then(({ data }) => {
        if (this.currentPage === 1) {
          this.figureList = data.data
        } else {
          this.figureList = [...this.figureList, ...data.data]
        }
        this.listData = [
          {
            width: 0,
            list: []
          },
          {
            width: 0,
            list: []
          },
          {
            width: 0,
            list: []
          }
        ]
        this.figureList.forEach(item => {
          this.dealImg(item)
        })
        if (this.currentPage === data.totalPages) {
          this.finished = true
        } else {
          this.currentPage++
        }
        // this.loading = false
        this.verScroll()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 种类拖动
    verScroll() {
      let current = 0
      let currentWidth = this.listData[0].width
      this.listData.forEach((list, index) => {
        if (currentWidth < list.width) {
          currentWidth = list.width
          current = index
          return
        }
      })
      this.$refs.cont.style.width = this.listData[current].width + 'px'
      this.$nextTick(() => {
        this.loading = false
        const groupsList = this.$refs['group']
        if (groupsList && Array.isArray(groupsList)) {
          let maxHeight = 0
          groupsList.forEach(group => {
            maxHeight = Math.max(maxHeight, group.clientHeight)
          })

          groupsList.forEach(group => {
            group.style.height = maxHeight + 'px'
          })
        }
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            // scrollbar: true,
            // threshold: -20,
            eventPassthrough: 'vertical'
          })

          this.scroll.on('scrollEnd', () => {
            !this.loading && !this.finished && this.getData()
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    async dealImg(item) {
      const img = new Image()
      img.src = item.prev_png_path
      let current = 0
      let currentWidth = this.listData[0].width
      this.listData.forEach((list, index) => {
        if (currentWidth > list.width) {
          currentWidth = list.width
          current = index
          return
        }
      })
      this.listData[current].list.push(item)
      this.listData[current].width += img.width / img.height * 108 + 12
    },
    patternDialog(item) {
      Dialog.confirm({
        title: `${this.$t('提示')}`,
        message: item.is_presell ? `${this.$t('该花样正在预售中')}` : `${this.$t('请先选择定制商品')}${this.$t('，')}${this.$t('再选择定制花样')}${this.$t('。')}`,
        confirmButtonText: item.is_presell ? `${this.$t('确定')}` : `${this.$t('选择商品')}`,
        confirmButtonColor: '#df2525'
      }).then(() => {
        !item.is_presell && this.$router.push({ path: '/goodsList', query: { design_id: item.design_id }})
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scope>
.slide-figure {
  width: 100%;
  background: #fff;
  // box-sizing: border-box;
  border-bottom: 6px solid #f5f5f5;
  .slide-figure-title{
    font-size: 16px;
    color: #000;
    padding: 10px 0 15px 10px;
    span{
      padding-left: 10px;
      border-left: 5px solid #000;
    }
  }
  .figure-list-loading {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -35px;
      background: rgba(0, 0,0, 0.4);
      transition: right ease-in-out 0.2s;
      color: #fff;
      &--active {
        right: 10px;
      }
      i {
        animation: rotate 1.4s cubic-bezier(0.2, 0, 0, 1) infinite;
      }
    }
  .figure-list-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .figure-list{
    background: #fff;
    padding: 6px 10px;
    &-group {
      display: flex;
      margin: 4px 0;
      height: 120px;
    }
    &-item {
      position: relative;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #f5f5f5;
      box-shadow: 0px 10px 20px #f3f3f3;
      border-radius: 6px;
      box-sizing: border-box;
      padding: 10px;
      margin:0 6px;
      img{
        height: 90%;
        border-radius: 6px;
        display: block;
      }
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

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
