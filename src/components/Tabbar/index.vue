<template>
  <div class="tabberWarp">
    <div class="warp">
      <Item
        v-for="(item,index) in tabbarDes"
        :key="item+index"
        :sel="selected"
        :txt="item.txt"
        :page="item.page"
        @change="getVal"
      >
        <img slot="normalImg" :src="item.normalImg">
        <img slot="activeImg" :src="item.activeImg">
      </Item>
    </div>
  </div>
</template>
<script type="text/javascript">
import Item from './item.vue'
export default {
  components: {
    Item
  },
  props: {
    path: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      selected: '/',
      tabbarDes: [
        {
          txt: '首页',
          page: '/',
          normalImg: require('../../assets/tabbar/home.png'),
          activeImg: require('../../assets/tabbar/home-active.png')
        },
        {
          txt: '分类',
          page: '/classify',
          normalImg: require('../../assets/tabbar/fenlei.png'),
          activeImg: require('../../assets/tabbar/fenlei-active.png')
        },
        {
          txt: '购物车',
          page: '/cart',
          normalImg: require('../../assets/tabbar/cart.png'),
          activeImg: require('../../assets/tabbar/cart-active.png')
        },
        {
          txt: '我的',
          page: '/user',
          normalImg: require('../../assets/tabbar/user.png'),
          activeImg: require('../../assets/tabbar/user-active.png')
        }
      ]
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler(val, oldVal) {
        this.selected = val.path
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    if (this.path) {
      this.selected = this.path
    }
  },
  methods: {
    getVal(res) {
      this.selected = res
    }
  }
}
</script>
<style type="text/css">
.warp {
  width: 100%;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 0;
}
.warp img {
  width: 24px;
  height: 24px;
}
.tabberWarp img {
  margin-top: 5px;
}
.tabberWarp {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 5px;
  background: #fff;
}
</style>
