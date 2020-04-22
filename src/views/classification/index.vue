<template>
  <div>
    <div class="index-search">
      <van-search
        shape="round"
        disabled
        background="#fff"
        placeholder="搜索分类商品"
      />
    </div>
    <div class="classify-content">
      <van-tree-select height="89vh" :items="items" :main-active-index.sync="active" @click-nav="onNavClick">
        <template #content>
          <div class="right-content">
            <a :href="`/goodsList?category_id=${currentId}`">
              <img src="https://img.yzcdn.cn/vant/apple-1.jpg" alt="" width="100%">
            </a>
            <div v-for="(item,index) in subCategary" :key="index" class="sub-categary">
              <div class="sub-name">{{ item.name }}</div>
              <div class="sub-child">
                <ul>
                  <li v-for="(child,i) in item.children" :key="i">
                    <a :href="`/goodsList?category_id=${child.id}`">
                      <img :src="child.img" alt="">
                      <p>{{ child.name }}</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </van-tree-select>
    </div>
  </div>
</template>

<script>
import { categaryApi } from '@/api/goods'
export default {
  data() {
    return {
      active: 0,
      currentId: '',
      items: [{ text: '分类1' }, { text: '分类2' }],
      subCategary: [
        {
          id: 1,
          name: '手机',
          children: [{
            id: 11,
            name: '华为',
            img: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2206804437,2518103967&fm=26&gp=0.jpg'
          }, {
            id: 12,
            name: '小米',
            img: 'http://e.hiphotos.baidu.com/image/h%3D300/sign=62e28ebfa26eddc439e7b2fb09dbb6a2/377adab44aed2e73e7c226768801a18b87d6fa45.jpg'
          }, {
            id: 13,
            name: '苹果',
            img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2783732542,1835682322&fm=26&gp=0.jpg'
          }]
        }, {
          id: 2,
          name: '衣服',
          children: [{
            id: 21,
            name: '衬衫',
            img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1346332653,3963595222&fm=26&gp=0.jpg'
          }, {
            id: 22,
            name: '棉袄',
            img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3981203056,1220791395&fm=26&gp=0.jpg'
          }, {
            id: 23,
            name: '羽绒服',
            img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1474690431,1367848502&fm=26&gp=0.jpg'
          }]
        }
      ]
    }
  },
  created() {
    this.active = this.$route.query.category_id
  },
  methods: {
    onNavClick(e) {
      console.log(e)
      this.currentId = e
    },
    // 获取分类列表
    getCategoryList() {
      categaryApi.getCategory({

      }).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.classify-content{
 .right-content{
   padding: 0 10px;
    img{
      width: 100%;
      height: 120px;
    }
    .sub-categary{
      padding: 5px 0;
      margin-top: 10px;
      .sub-name{
        padding: 10px 0;
        color: #333;
        font-size: 14px;
      }
      .sub-child{
        ul{
          display: flex;
          justify-content: space-between;
          align-items: center;
          li{
            width: 28%;
            a{
              color: #333;
            }
            img{
              width: 100%;
              height: 70px;
            }
            p{
              margin: 0;
              font-size: 12px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}

</style>
