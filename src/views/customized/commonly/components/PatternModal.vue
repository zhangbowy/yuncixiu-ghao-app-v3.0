<template>
  <van-popup :value="value" :style="{ width: '80%', height: '60vh' }" round closeable @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">花样库</div>
      <div class="modal-content figure-content">
        <div class="figure-list">
          <div v-for="(item,index) in figureList" :key="index" class="figure-item" :class="{checked: form.middleImg.design_id == item.design_id}">
            <img v-lazy="item.prev_png_path" alt="" @click="checkFigureItem(item)">
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {}
    },
    figureList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    checkFigureItem(item) {
      this.$emit('change', item)
    }
  }

}
</script>

<style lang="scss">

  .figure-list{
    display: flex;
    flex-flow: wrap;
    .figure-item{
      width: 30%;
      margin-right: 3.5%;
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 0px 0px 20px #f5f5f5;
      border: 1px solid #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 100%;
        // height: 70px;
        border-radius: 10px 10px 0 0;
      }
      .temp-name{
        font-size: 12px;
        margin: 0 0 5px;
      }
    }
    .figure-item.checked{
      border: 1px solid #1296db;
    }
    .figure-item:nth-child(3n){
      margin-right: 0;
    }
  }
  .figure-content{
    height: calc(60vh - 120px);
    margin: 10px;
    overflow: auto;
  }
</style>
