<template>
  <div class="index-view">
    <div class="index-search">
      <van-search
        v-model="value"
        shape="round"
        background="#fff"
        placeholder="请输入搜索关键词"
      />
    </div>
    <!-- 轮播 -->
    <div class="index-banner">
      <van-swipe class="my-swipe" :autoplay="3000" :indicator-color="indicatorColor">
        <van-swipe-item v-for="(image, index) in indexData.slider" :key="index">
          <img v-lazy="image.image_path">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="roll-ad">
      <van-notice-bar
        color="#1989fa"
        background="#ecf9ff"
        left-icon="volume-o"
        :scrollable="true"
      >
        欢迎访问云刺绣商城！
      </van-notice-bar>
    </div>
    <!-- 推荐种类 -->
    <ver-scroll :data="indexData.category" title="种类推荐" />
    <!-- 样本 -->
    <div class="sample-box">
      <div v-for="(item,index) in samples" :key="index+item.src" class="sample-box-item">
        <img :src="item.src" alt="">
      </div>
    </div>
    <!-- 热销商品 -->
    <hot-goods :data="goodsList" title="热销商品" />
  </div>
</template>

<script>

import HotGoods from '@/components/Home/HotGoods'
import VerScroll from '@/components/Home/VerScroll'
import { indexApi } from '@/api/home'
export default {
  components: {
    HotGoods,
    VerScroll
  },
  data() {
    return {
      value: '',
      indexData: {},
      samples: [
        {
          id: 1,
          src: 'http://cos-cx-n1-1257124629.cos.ap-guangzhou.myqcloud.com/gallary/15/2020-05-11/a3ed98a4-cd24-4fce-975a-757cdc485a53.png'
        }, {
          id: 2,
          src: 'http://cos-cx-n1-1257124629.cos.ap-guangzhou.myqcloud.com/gallary/15/2020-05-11/073606a2-397f-4f24-a6ad-c3e18ba98003.png'
        }, {
          id: 3,
          src: 'http://cos-cx-n1-1257124629.cos.ap-guangzhou.myqcloud.com/gallary/15/2020-05-11/f6431e37-76b9-4caf-ac83-118beda838a9.png'
        }, {
          id: 4,
          src: 'https://s1.ax1x.com/2020/04/13/GjhCMd.gif'
        }, {
          id: 5,
          src: 'https://s1.ax1x.com/2020/04/13/GjhPsA.gif'
        }, {
          id: 6,
          src: 'https://s1.ax1x.com/2020/04/13/GjhEIf.gif'
        }
      ],
      goodsList: [
        {
          id: 88,
          src: 'http://img10.360buyimg.com/n1/jfs/t1144/221/780030540/153183/9cbd453e/5548385fN1fc13cc9.jpg',
          name: '印花拎包',
          price: 45
        }, {
          id: 2,
          src: 'http://img4.imgtn.bdimg.com/it/u=3555418247,60757103&fm=26&gp=0.jpg',
          name: '笔记本双肩包',
          price: 69
        }, {
          id: 3,
          src: 'http://img3.imgtn.bdimg.com/it/u=1918815643,3089648412&fm=26&gp=0.jpg',
          name: '14寸笔记本电脑包',
          price: 78
        }, {
          id: 4,
          src: 'http://ec4.images-amazon.com/images/I/71gfm0gcb0L._UL1500_.jpg',
          name: '黑色鸭舌帽',
          price: 34
        }
      ],
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
      img{
        width: 100%;
        max-height: 100px;
        min-height: 100px;
        border-radius: 6px;
      }
    }
  }
}
</style>
