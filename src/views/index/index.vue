<template>
  <div class="index-view">
    <div class="index-search">
      <van-search
        v-model="value"
        shape="round"
        background="#fff"
        :placeholder="`${$t('搜索商品')}`"
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
    <ver-scroll :data="indexData.category" :title="`${$t('定制推荐')}`" />
    <!-- 推荐种类 -->
    <ver-scroll :data="indexData.design_category" :props-map="propsMap" :title="`${$t('花样种类推荐')}`" />
    <!-- 花样 -->
    <div class="sample-box">
      <div v-for="(item,index) in indexData.hot_design" :key="index+item.prev_png_path" class="sample-box-item">
        <img :src="item.prev_png_path" alt="" @click="patternDialog(item)">
        <span v-if="item.is_presell==1" class="corner-mark">{{ $t('预售') }}</span>
      </div>
    </div>
    <!-- 热销商品 -->
    <hot-goods :data="indexData.hot_goods" :title="`${$t('热销商品')}`" />
    <!-- 预售商品 -->
    <hot-goods :data="indexData.presell_goods" :is-presell="true" :props-map="presellMap" :title="`${$t('预售商品')}`" :description="`${$t('暂无预售商品')}`" />
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
      propsMap: {
        id: 'design_category_id',
        logo: 'image_path',
        category_name: 'design_category_name'
      },
      presellMap: {
        is_show: 'is_presell'
      },
      presellGoodsPropMap: {

      },
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
      position: relative;
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
</style>
