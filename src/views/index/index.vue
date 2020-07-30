<template>
  <div class="index-view">
    <div class="index-search">
      <van-search
        v-model="value"
        shape="round"
        background="#fff"
        placeholder="搜索商品"
        disabled
        @click="toSearch"
      />
    </div>
    <!-- 轮播 -->
    <div class="index-banner">
      <van-swipe class="my-swipe" :autoplay="3000" :indicator-color="indicatorColor">
        <van-swipe-item v-for="(image, index) in indexData.slider" :key="index">
          <a :href="image.link" target="_blank">
            <img v-lazy="image.image_path" @click="linkJump(image.link)">
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div v-if="indexData.notice" class="roll-ad">
      <!-- <van-notice-bar
        color="#1989fa"
        background="#ecf9ff"
        left-icon="volume-o"
        :scrollable="true"
      >
        {{ indexData.notice }}
      </van-notice-bar> -->
      <van-notice-bar
        color="#1989fa"
        background="#ecf9ff"
        :text="indexData.notice"
        left-icon="volume-o"
      />
    </div>
    <!-- 推荐种类 -->
    <ver-scroll :data="indexData.category" title="种类推荐" />
    <!-- 样本 -->
    <div class="sample-box">
      <div v-for="(item,index) in indexData.hot_design" :key="index+item.prev_png_path" class="sample-box-item">
        <img :src="item.prev_png_path" alt="" @click="patternDialog(item)">
      </div>
    </div>
    <!-- 热销商品 -->
    <hot-goods :data="indexData.hot_goods" title="热销商品" />
  </div>
</template>

<script>

import HotGoods from '@/components/Home/HotGoods'
import VerScroll from '@/components/Home/VerScroll'
import { indexApi } from '@/api/home'
import { Dialog } from 'vant'
export default {
  components: {
    HotGoods,
    VerScroll
  },
  data() {
    return {
      value: '',
      indexData: {},
      indicatorColor: '#000'
    }
  },
  created() {
    this.getIndex()
  },
  methods: {
    getIndex() {
      indexApi.getIndex().then(res => {
        this.indexData = res.data
      })
    },
    toSearch() {
      this.$router.push({ path: `/goodsList` })
    },
    linkJump(url) {
    },
    patternDialog(item) {
      Dialog.confirm({
        title: '提示',
        message: '请先选择定制商品，再选择定制花样。',
        confirmButtonText: '选择商品',
        confirmButtonColor: '#df2525'
      }).then(() => {
        this.$router.push({ path: '/goodsList', query: { design_id: item.design_id }})
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-view{
  background: #f5f5f5;
  padding-bottom: 50px;
  .index-banner{
    .my-swipe{
      background: #f7f7f7;
      height: 220px;
      .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 10px;
        text-align: center;
        height: 220px;
        img{
          width: 100%;
          height: 220px;
        }
      }
    }
  }
  .sample-box{
    display: flex;
    flex-flow: wrap;
    align-items: center;
    justify-content: space-around;
    background: #fff;
    padding-top: 10px;
    border-bottom: 10px solid #f5f5f5;
    &-item{
      width: 28%;
      border: 1px solid #f5f5f5;
      box-shadow: 0px 10px 20px #f3f3f3;
      margin-bottom: 15px;
      border-radius: 6px;
      // width: 100px;
      // height: 100px;
      box-sizing: border-box;
      padding: 10px;
      img{
        width: 90%;
        // max-height: 100px;
        // min-height: 100px;
        border-radius: 6px;
        display: block;
      }
    }
  }
}
</style>
