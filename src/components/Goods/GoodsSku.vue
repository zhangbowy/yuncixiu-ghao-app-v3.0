<template>
  <div class="goods-sku">
    <div class="sku-box">
      <van-action-sheet v-model="showSku" title="选择规格">
        <div class="content">
          <div v-if="skuItem" class="sku-info">
            <img :src="skuItem.images?skuItem.images:goodsDetail.thumb_image_path" width="96" height="96" alt="">
            <div class="right-info">
              <p class="price">￥{{ skuItem.current_price }}</p>
              <p>剩余{{ skuItem.num }}</p>
              <p>已选：<span v-for="item in skuItem.skus" :key="item.k+item.v">{{ item.k }}:{{ item.v }}  </span>{{ skuItem.checked }}</p>
            </div>
          </div>
          <div class="goods-number">
            <van-cell title="选择数量">
              <!-- 使用 right-icon 插槽来自定义右侧图标 -->
              <template>
                <van-stepper v-model="goodsNumber" :min="1" :max="skuItem.num" input-width="30px" button-size="22px" />
              </template>
            </van-cell>
          </div>
          <div class="sku-list">
            <div v-for="(item,index) in skudata" :key="item.id + '_id'" class="sku-item">
              <span class="sku-item-name">{{ item.value }}:</span>
              <div v-if="showSku" class="sku-item-attr">
                <span v-for="attr in item.leaf" :key="attr.id" :class="{'active':activeSku[index].option&&activeSku[index].option.id === attr.id}" class="attr-name" @click="selectSku(index, attr)">{{ attr.value }}</span>
              </div>
            </div>
          </div>
          <div class="goods-adction">
            <van-goods-action>
              <van-goods-action-button
                type="warning"
                text="加入购物车"
                @click="skuAddCart"
              />
              <van-goods-action-button
                type="danger"
                text="立即购买"
                @click="skuBuy"
              />
            </van-goods-action>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsDetail: {
      type: Object,
      default: () => {}
    },
    showSku: {
      type: Boolean,
      default: false
    },
    skuItem: {
      type: Object,
      default: () => {}
    },
    skudata: {
      type: Object,
      default: () => {}
    },
    skuList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 选择skuitem
    selectSku(index, option) {
      if (this.activeSku[index].option && this.activeSku[index].option.id === option.id) {
        this.activeSku[index].option = {}
        return
      }
      this.activeSku[index].option = option
    }
  }
}
</script>

<style lang="scss" scoped>
.sku-box{
  .content{
    padding: 20px;
    padding-bottom: 60px;
    .sku-info{
      .right-info{
        display: inline-block;
        font-size: 14px;
        padding-left: 10px;
        vertical-align: top;
        padding-top: 20px;
        p{
          margin: 0;
          padding-bottom: 5px;
        }
        p.price{
          color: #ee0a24;
        }
      }
    }
    .goods-number{
      font-size: 14px;
    }
    .sku-list{
      margin-top: 10px;
      font-size: 14px;
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
            font-size: 12px;
          }
          .attr-name.active{
            background: rgba(255, 0, 0, 0.164);
            color: #fc1d1d;
          }
        }
      }
    }
  }
}
</style>
