<template>
  <div class="address-list">
    <div v-for="(item,index) in list" :key="`${index}-${item.address_id}`" class="address-list-item" @click="checkAddress(item.address_id)">
      <div class="address-left-box">
        <div class="user-info">
          <span class="user-name">{{ item.name }}</span>
          <span class="user-phone">{{ item.phone }}</span>
          <span v-if="item.is_default==1" class="is-default">{{ defaultTagText }}</span>
        </div>
        <div class="address-info">
          {{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}
        </div>
        <svg-icon class="edit-icon" icon-class="address-edit" @click.stop="editAddress(item)" />
      </div>
    </div>
    <div v-if="list.length==0" class="no-address">
      <span><svg-icon icon-class="add-address" /></span>
      <p>您还没有创建收货地址</p>
    </div>

    <div class="address-add">
      <div class="add-btn" @click="addAddress">
        新增地址
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    defaultTagText: {
      type: String,
      default: '默认'
    }
  },
  methods: {
    addAddress() {
      this.$emit('add')
    },
    editAddress(item) {
      this.$emit('edit', item)
    },
    checkAddress(id) {
      if (this.$route.query.redirect === '/orderConfirm') {
        this.$router.replace({ path: `/orderConfirm?address_id=${id}` })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.address-list{
  box-sizing: border-box;
  height: 100%;
  padding: 12px 12px 40px;
  .address-list-item:not(:last-child){
    margin-bottom: 12px;
  }
  .address-list-item{
    padding: 12px;
    background-color: #fff;
    border-radius: 0.21333rem;
    box-shadow: 0px 0 20px #f0efef;
    .address-left-box{
      position: relative;
      overflow: hidden;
      text-align: left;
      vertical-align: middle;
      word-wrap: break-word;
      color: #000;
      font-size: 14px;
      padding-right: 1.17333rem;
      .user-info{
        padding-bottom: 10px;
        span{
          display: inline-block;
          vertical-align: bottom;
        }
        .user-name{
          font-size: 16px;
          margin-right: 10px;
        }
        .user-phone{
          color: #999;
          font-size: 12px;
        }
        .is-default {
          margin-left: 10px;
          background: crimson;
          border-radius: 20px;
          padding: 2px 5px 0;
          color: #fff;
          font-size: 10px;
          display: inline-block;
          vertical-align: top;
        }
      }
      .address-info{
        font-size: 12px;
        line-height: 18px;
      }
      .edit-icon{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

  }
  .no-address{
    font-size: 14px;
    padding-top: 30%;
    text-align: center;
    color: #B1B8C8;
    span{
      font-size: 42px
    }
  }
  .address-add{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    padding: 5px 16px;
    background-color: #fff;
    .add-btn{
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 14px;
      background: #ee0a24;
      border-radius: 20px;
      text-align: center;
    }
  }
}
</style>
