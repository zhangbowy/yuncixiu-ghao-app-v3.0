const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  isLogin: state => state.user.isLogin,
  cartList: state => state.shopCart.cartList
}
export default getters
