<template>
  <div class="goods-lists">
    <div class="recommend-goods">
      <div class="goods-list-content">
        <div v-for="(item,index) in data" :key="`${index}-${item.id}`" class="goods-item" @click="toDetail(item.id)">
          <img v-lazy="item.thumb_image_path" alt="">
          <p class="goods-name">{{ item.name }}</p>
          <p class="goods-price"><span>￥{{ item.current_price.toFixed(2) }}</span> <span class="old-price">￥{{ item.old_price.toFixed(2) }}</span></p>
          <span v-if="item.is_custom==1" class="corner-mark">定制</span>
        </div>
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
.goods-lists{
  .recommend-goods{
    padding: 10px;
    background: #fff;
    .goods-list-content{
      display: flex;
      flex-flow: wrap;
      align-items: center;
      justify-content: space-between;
      .goods-item{
        width: 48%;
        border: 1px solid #f5f5f5;
        box-shadow: 0px 10px 20px #f3f3f3;
        margin-bottom: 10px;
        border-radius: 6px;
        position: relative;
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
          .old-price{
            color: #999;
            font-size: 12px;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}

</style>

