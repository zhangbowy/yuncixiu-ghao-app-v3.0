<template>
  <div class="hot-goods">
    <div class="recommend-goods">
      <div class="recommend-title">
        <span>{{ title }}</span>
      </div>
      <div :class="['goods-content', !data.length && 'empty']">
        <div v-for="(item,index) in data" :key="`${index}-${item[resultMap.id]}`" class="goods-item" @click="toDetail(item[resultMap.id])">
          <img v-lazy="item[resultMap.thumb_image_path]" alt="">
          <p class="goods-name">{{ item[resultMap.name] }}</p>
          <p class="goods-price"><span>{{ $t('￥') }}{{ item[resultMap.current_price] }}</span> </p>
          <span v-if="item[resultMap.is_show]==1" class="corner-mark">{{ !isPresell ? $t('定制') : $t('预售') }}</span>
        </div>
        <van-empty v-if="!data.length" :description="$t(description)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    propsMap: {
      type: Object,
      default: () => {}
    },
    description: {
      type: String,
      default: '暂无推荐商品'
    },
    isPresell: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resultMap: {
        id: 'id',
        thumb_image_path: 'thumb_image_path',
        name: 'name',
        current_price: 'current_price',
        is_show: 'is_custom'
      }
    }
  },
  watch: {
    propsMap: {
      handler(newValue, oldValue) {
        Object.assign(this.resultMap, newValue)
      },
      immediate: true
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push({ path: 'goodsDetail', query: { goods_id: id }})
    }
  }
}
</script>
<style lang="scss" scope>
  .recommend-goods{
    // padding: 10px;
    background: #fff;
    .recommend-title{
      font-size: 16px;
      color: #000;
      padding: 10px 0 20px;
      span{
        padding-left: 10px;
        border-left: 5px solid #000;
      }
    }
    .goods-content{
      display: flex;
      flex-flow: wrap;
      align-items: center;
      &.empty {
        justify-content: space-around;
      }
      .goods-item{
        width: 45%;
        border: 1px solid #f5f5f5;
        box-shadow: 0px 10px 20px #f3f3f3;
        border-radius: 6px;
        position: relative;
        box-sizing: border-box;
        &:nth-child(n) {
          margin: 0 1.5% 15px 3.5%;
        }
        &:nth-child(2n) {
          margin: 0 3.5% 15px 1.5%;
        }
        .corner-mark{
          position: absolute;
          left: 0;
          top: 0;
          background: #ff2828;
          padding: 3px;
          border-radius: 6px 0 6px 0 ;
          font-size: 10px;
          color: #fff;
          transform: scale(0.8);
          display: inline-block;
        }
        img{
          width: 100%;
          height: 159px;
          border-radius: 6px;
          display: block;
          object-fit: cover;
        }
        p{
          font-size: 14px;
          margin: 8px 0;
          overflow: hidden;
          padding: 0 10px;
        }
        p.goods-name{
          color: #000;
          overflow: hidden;
          -ms-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p.goods-price{
          color: #df2525;
        }
      }
    }
  }
</style>

