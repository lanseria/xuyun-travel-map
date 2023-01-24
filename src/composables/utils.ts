const WIDTH = 992 // https://arco.design/vue/component/grid#responsivevalue

export function queryDevice() {
  const { width } = useWindowSize()
  // const rect = document.body.getBoundingClientRect()
  return width.value - 1 < WIDTH
}

export const useMobile = () => {
  const { width } = useWindowSize()
  const isMobile = computed(() => {
    // const rect = document.body.getBoundingClientRect()
    return width.value - 1 < WIDTH
  })
  return {
    isMobile,
  }
}