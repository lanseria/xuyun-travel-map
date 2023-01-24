const WIDTH = 992 // https://arco.design/vue/component/grid#responsivevalue

export function queryDevice() {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < WIDTH
}
