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
      <van-tree-select height="89vh" :items="items" :active-id.sync="items.activeId" :main-active-index.sync="active" @click-nav="onNavClick">
        <template #content>
          <div class="right-content">
            <img :src="currentImg" alt="" width="100%" @click="toGoodsList(currentId)">
            <div v-for="(item,index) in subCategary" :key="index" class="sub-categary" @click="toGoodsList(item.id)">
              <div class="sub-name">{{ item.category_name }}</div>
              <div class="sub-child">
                <ul>
                  <li v-for="(child,i) in item.children" :key="i">
                    <img :src="child.image_path" alt="">
                    <p>{{ child.category_name }}</p>
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
import { categoryApi } from '@/api/goods'
export default {
  data() {
    return {
      active: 0,
      currentId: 0,
      currentImg: '',
      items: [],
      categories: [],
      subCategary: []
    }
  },
  created() {
    this.currentId = this.$route.query.category_id
    this.getCategoryList()
  },
  methods: {
    onNavClick(e) {
      this.currentId = this.items[e].activeId
      this.currentImg = this.items[e].image_path
      this.subCategary = this.categories[e].children
    },
    // 获取分类列表
    getCategoryList() {
      categoryApi.getCategory().then(res => {
        // 渲染左侧列表
        res.data.map(item => {
          this.items.push({
            activeId: item.id,
            text: item.category_name,
            image_path: item.image_path
          })
        })
        if (this.currentId) {
          res.data.forEach((element, i) => {
            if (element.id === parseInt(this.currentId)) {
              this.active = i
              this.currentImg = res.data[i].image_path
              this.subCategary = res.data[i].children
            }
          })
        } else {
          this.currentId = res.data[0].id
          this.currentImg = res.data[0].image_path
          this.subCategary = res.data[0].children
        }
        this.categories = res.data
      })
    },
    toGoodsList(id) {
      this.$router.push({ path: `/goodsList?category_id=${id}` })
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
          align-items: center;
          li{
            width: 28%;
            margin-right: 8%;
            img{
              width: 100%;
              height: 70px;
            }
            p{
              margin: 0;
              font-size: 12px;
              text-align: center;
            }
            &:last-child{
              margin: 0;
            }
          }
        }
      }
    }
  }
}

</style>
