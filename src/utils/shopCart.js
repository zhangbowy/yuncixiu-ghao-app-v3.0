const CartKey = 'cart_list'
export const shopCart = {
  getItem() {
    return localStorage.getItem(CartKey)
  },
  setItem(data) {
    return localStorage.setItem(CartKey, data)
  },
  removeItem() {
    return localStorage.removeItem(CartKey)
  }
}
