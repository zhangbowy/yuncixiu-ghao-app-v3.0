<template>
  <div class="goods-detail">
    <div class="navbar">
      <top-bar :title="goodDetail.good_name" />
    </div>
    <div class="good-content">
      <div class="good-images">
        <van-swipe @change="onChange">
          <van-swipe-item v-for="(item, index) in goodDetail.imageList" :key="index">
            <img :src="item" alt="" @click="preview(index)">
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/{{ goodDetail.imageList.length }}
            </div>
          </template>
        </van-swipe>
      </div>
      <div class="good-info">
        <div class="good-name">
          <p>{{ goodDetail.good_name }}</p>
          <span>{{ goodDetail.real_sale }}人付款</span>
        </div>
        <div class="good-price">
          ￥ <span class="current-price">{{ goodDetail.currentPrice }}</span>
          <span class="old-price">￥{{ goodDetail.price }}</span>
        </div>
      </div>
      <!-- 商品规格选择 -->
      <div class="good-cell">
        <div class="cell-item" @click="changeSkuShow">
          <span class="cell-title">已选</span>
          <span class="cell-content">{{ checkedSku }}</span>
          <span class="right-arrow"><svg-icon icon-class="right-arrow" /></span>
        </div>
      </div>
      <div class="sku-box">
        <van-action-sheet v-model="showSku">
          <div class="content">
            <div v-if="skuItem" class="sku-info">
              <img :src="skuItem.images[0]?skuItem.images[0]:goodDetail.img" width="96" height="96" alt="">
              <div class="right-info">
                <p>￥{{ skuItem.current_price }}</p>
                <p>剩余{{ skuItem.num }}</p>
                <p>已选：{{ skuItem.checked }}</p>
              </div>
            </div>
            <div class="sku-list">
              <div v-for="(item,index) in skudata" :key="item.id + '_id'" class="sku-item">
                <span class="sku-item-name">{{ item.value }}:</span>
                <div class="sku-item-attr">
                  <span v-for="attr in item.leaf" :key="attr.id" :class="{'active':activeSku[index].option.id === attr.id}" class="attr-name" @click="selectSku(index, attr)">{{ attr.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-action-sheet>
      </div>
      <!-- 商品id: {{ id }} -->
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { ImagePreview } from 'vant'
import { sku_list } from './skulist'
import { skudata } from './skudata'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      current: 0,
      checkedSku: '请选择规格',
      showSku: false,
      goodDetail: {
        id: 1,
        real_sale: 0,
        img: 'https://ftp.bmp.ovh/imgs/2020/04/a4688e477c7d0d1f.jpg',
        imageList: [
          'https://ftp.bmp.ovh/imgs/2020/04/a4688e477c7d0d1f.jpg',
          'https://ftp.bmp.ovh/imgs/2020/04/9718b5327cadf643.jpg'
        ],
        good_name: '测试商品',
        currentPrice: 0.1,
        price: 1,
        content: ''
      },
      skuItem: {
        images: ['https://ftp.bmp.ovh/imgs/2020/04/a4688e477c7d0d1f.jpg'],
        num: 100,
        current_price: 0.1
      },
      skuList: [],
      skudata: [],
      activeSku: [],
      checkedSkuIds: '',
      title: this.$route.meta.title,
      id: this.$route.query.good_id
    }
  },
  watch: {
    skudata: {
      deep: true,
      immediate: true,
      handler(val) {
        this.activeSku = val.map(item => ({
          spec: { value: item.value, id: item.id },
          option: {}
        }))
      }
    }
  },
  created() {
    this.skuList = sku_list
    this.skudata = skudata
    this.activeSku = skudata.map(item => ({
      spec: { value: item.value, id: item.id },
      option: {}
    }))
  },

  methods: {
    onChange(index) {
      this.current = index
    },
    // 预览图片
    preview(i) {
      ImagePreview(
        {
          images: this.goodDetail.imageList,
          startPosition: i
        }
      )
    },
    changeSkuShow() {
      this.showSku = !this.showSku
    },
    selectSku(index, option) {
      if (this.activeSku[index].option && this.activeSku[index].option.id === option.id) return this.activeSku[index].option = {}
      this.activeSku[index].option = option
    }
  }
}
</script>

<style lang="scss" scoped>
.good-content{
  .good-images{
    img{
      width: 100%;
      height: 260px;
    }
  }
  .good-info{
    padding: 5px 10px;
    border-bottom: 10px solid #f5f5f5;
    .good-name{
      color: #333;
      font-weight: bold;
      font-size: 22px;
      position: relative;
      p{
        width: 65%;
        margin: 0;
        overflow: hidden;
      }
      span{
        position: absolute;
        right: 5px;
        top: 5px;
        color: #999;
        font-size: 14px;
      }
    }
    .good-price{
      margin-top: 10px;
      color: #ff0a0a;
      font-size: 12px;
      span.current-price{
        font-size: 18px;
        font-weight: bold;
      }
      span.old-price{
        padding-left: 10px;
        text-decoration: line-through;
        color: #999;
      }
    }
  }
  // sku部分样式
  .good-cell{
    border-bottom: 10px solid #f5f5f5;
    .cell-item{
      font-size: 16px;
      padding: 10px;
      span{
        display: inline-block;
        vertical-align: middle;
      }
      span.cell-title{
        width: 20%;
      }
      span.cell-content{
      width: 60%;
      }
      span.right-arrow{
        width: 20%;
        text-align: right;
      }
    }
  }
  .sku-box{
    .content{
      padding: 20px;
      .sku-info{
        .right-info{
          display: inline-block;
          font-size: 18px;
          padding-left: 10px;
          vertical-align: top;
          p{
            margin: 0;
            padding-bottom: 10px;
          }
        }
      }
      .sku-list{
        margin-top: 10px;
        font-size: 16px;
        .sku-item{
          margin-bottom: 20px;
          .sku-item-name{
            display: block;
            padding-bottom: 10px;
          }
          .sku-item-attr{
            .attr-name{
              background: #f5f5f5;
              color: #333;
              border-radius: 10px;
              padding: 5px 10px;
              margin-right: 10px;
              font-size: 14px;
            }
            .attr-name.active{
              background: rgba(255, 0, 0, 0.164);
              color: rgb(252, 29, 29);
            }
          }
        }
      }
    }
  }
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 15px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  border-radius: 20px;
}
</style>

