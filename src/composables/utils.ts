import { mapContainerWidth } from './store'

const WIDTH = 992 // https://arco.design/vue/component/grid#responsivevalue

export function queryDevice() {
  return mapContainerWidth.value - 1 < WIDTH
}

export const useMobile = () => {
  const isMobile = computed(() => {
    // const rect = document.body.getBoundingClientRect()
    return mapContainerWidth.value - 1 < WIDTH
  })
  return {
    isMobile,
  }
}
