<template>
  <div class="hot-goods">
    <div class="recommend-goods">
      <div class="recommend-title">
        <span>{{ title }}</span>
      </div>
      <div class="goods-content">
        <div v-for="(item,index) in data" :key="item.id+index" class="goods-item" @click="toDetail(item.id)">
          <img v-lazy="item.src" alt="">
          <p class="goods-name">{{ item.name }}</p>
          <p class="goods-price"><span>￥{{ item.price }}</span> </p>
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
  .recommend-goods{
    padding: 10px;
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
      justify-content: space-around;
      .goods-item{
        width: 45%;
        border: 1px solid #f5f5f5;
        box-shadow: 0px 10px 20px #f3f3f3;
        margin-bottom: 15px;
        border-radius: 6px;
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
        }
      }
    }
  }
</style>

