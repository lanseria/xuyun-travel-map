<script lang="ts" setup>
import type { PointFeature, VideoData } from '~/composables'
import { collapsed, isEditSide, mapContainerWidth } from '~/composables'

const mapContainer = ref()

const { width } = useElementBounding(mapContainer)

watchDebounced(() => width.value, () => {
  mapContainerWidth.value = width.value
}, { debounce: 300, maxWait: 600 })

// 所有路线对应的数据
const { data, onFetchResponse } = useFetch('/data/routes.json', { immediate: true }).get().json()

const fetchRouteData = () => {
  const currentRoute = allRouteList.value.find(item => item.value === currentRouteValue.value)
  if (currentRoute) {
    const { data, onFetchResponse } = useFetch(`/data/${currentRouteValue.value}/data/all-points.geojson`, { immediate: true }).get().json()
    onFetchResponse(() => {
      const features: PointFeature[] = data.value.features
      mapPlacePoints.value = features
    })

    const { data: videoData, onFetchResponse: videoOnFetchResponse } = useFetch(`/data/${currentRouteValue.value}/data/all-videos.json`, { immediate: true }).get().json()
    videoOnFetchResponse(() => {
      const features: VideoData[] = videoData.value.map((item: any) => ({
        ...item, expand: '',
      }))
      mapVideos.value = features
    })
    const { data: endData, onFetchResponse: endOnFetchResponse } = useFetch(`/data/${currentRouteValue.value}/video.json`, { immediate: true }).get().json()
    endOnFetchResponse(() => {
      mapStartPlacePoint.value = endData.value.startEndPoints[0]
      mapEndPlacePoint.value = endData.value.startEndPoints[1]
    })

    const { data: lastVideoData, onFetchResponse: lastVideoOnFetchResponse } = useFetch('/data/lastest.json', { immediate: true }).get().json()
    lastVideoOnFetchResponse(() => {
      lastestVideoInfo.value = lastVideoData.value
    })
  }
}

onFetchResponse(() => {
  allRouteList.value = data.value
  fetchRouteData()
})

watchDebounced(() => currentRouteValue.value, () => {
  fetchRouteData()
}, { debounce: 300, maxWait: 600 })

onMounted(() => {
  const route = useRoute()
  // console.log(route.matched[0].name)
  currentRouteValue.value = route.matched[0].name as string
})
</script>

<template>
  <div class="ui-container grow flex-shrink-0 flex flex-col md:flex-row w-full relative overflow-x-hidden h-full">
    <MapComp ref="mapContainer" class="map grow shrink-0 top-0 bottom-0 left-0 basis-0 transition-all duration-300 mapboxgl-map mode-simple_select mouse-drag" :class="{ 'basis-0': collapsed, 'basis-full': !collapsed }" />
    <Side v-if="!isEditSide" class="flex flex-col overflow-x-hidden bottom-0 top-0 right-0 box-border relative grow-0 shrink-0 w-full md:w-2/5 md:max-w-md h-2/5 md:h-auto" />
    <EditSide v-else class="flex flex-col overflow-x-hidden bottom-0 top-0 left-0 box-border relative grow-0 shrink-0 w-full md:w-2/5 md:max-w-md h-2/5 md:h-auto" />
  </div>
</template>

<style lang="css" scoped>
.mapboxgl-map {
  font: 12px/20px Helvetica Neue,Arial,Helvetica,sans-serif;
  overflow: hidden;
  position: relative;
  -webkit-tap-highlight-color: rgb(0 0 0/0);
}
</style>
