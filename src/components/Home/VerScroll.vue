<template>
  <div class="index-kind">
    <div class="kind-title"><span>{{ title }}</span></div>
    <div ref="wrapper" class="wrapper">
      <ul ref="cont" class="content">
        <li v-for="(item,index) in data" :key="item.category_name+index" class="cont-item">
          <a :href="`/classify?category_id=${item.id}`">
            <img :src="item.logo" class="cont-img" alt="">
            <p>{{ item.category_name }}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll' // 导入better-scroll
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      const timer = setTimeout(() => { // 其实我也不想写这个定时器的，这相当于又嵌套了一层$nextTick，但是不这么写会失败
        if (timer) {
          clearTimeout(timer)
          this.verScroll()
        }
      }, 1000)
    })
  },
  methods: {
    // 种类拖动
    verScroll() {
      const width = this.data.length * 78 // 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      this.$refs.cont.style.width = width + 'px' // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: 'vertical'
          })
        } else {
          this.scroll.refresh() // 如果dom结构发生改变调用该方法
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.index-kind{
    background: #fff;
    overflow: hidden;
    padding: 10px;
    .kind-title{
      font-size: 18px;
      color: #000;
      padding: 10px 0 20px;
      span{
        padding-left: 10px;
        border-left: 5px solid #000;
      }
    }
    .content {
      list-style: none;
      // overflow-x: scroll;
      white-space: nowrap;
      font-size: 12px;
      padding-right: 15px;
      .cont-item {
        position: relative;
        display: inline-block;
        width: 60px;
        margin: 0 10px;
        font-size: 12px;
        text-align: center;
        a{
          color: #333;
        }
        .cont-img {
          overflow: hidden;
          width: 60px;
          height: 60px;
        }
        p{
          margin: 5px 0;
        }
      }
    }
  }
</style>
