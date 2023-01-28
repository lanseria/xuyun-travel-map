<script setup lang="ts">
// import type { Ref } from 'vue'
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

import 'mapbox-gl/dist/mapbox-gl.css'
import { LayerStyleList, MapboxAccessToken, handleCollapsed, mapLoaded, mapStyle } from '~/composables'

mapboxgl.accessToken
  = MapboxAccessToken

let map: mapboxgl.Map | null = null
const mapContainer = shallowRef()

const updateMap = () => {
  //
}
onMounted(() => {
  const styleValue = LayerStyleList.find(item => item.value === mapStyle.value)
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: styleValue?.style,
    // style: 'mapbox://styles/mapbox/outdoors-v12',
    center: mapCenter.value as LngLatLike,
    zoom: 4,
    preserveDrawingBuffer: true,
    hash: true,
  })
  window.map = map

  map.addControl(new mapboxgl.NavigationControl())
  map.addControl(new mapboxgl.FullscreenControl())
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))

  // map.addControl(new MyCustomControl(map))
  mapLoaded.value = false
  map.on('load', () => {
    map!.resize()
    mapLoad()
    updateMap()
    mapLoaded.value = true
  })
})
</script>

<template>
  <div
    ref="mapContainer"
    class="h-full w-full top-0 bottom-0 left-0 right-0 relative"
  >
    <div class="absolute top-2 left-2 z-10 flex flex-col items-start">
      <!-- <MapDistance class="bg-white" /> -->
    </div>
    <div
      class="absolute top-0 left-1/2 z-10 flex flex-col items-start"
      :style="{
        transform: 'translate(-50%, 0)',
      }"
    >
      <MapRoute
        class="bg-white mt-2"
      />
      <!-- <MapData
        v-if="currentRouteValue === '2212-2303-dongbei'"
        class="bg-white"
      /> -->
      <MapNotice class="mt-2" />
    </div>
    <div class="absolute bottom-2 left-2 z-10">
      <!-- <MapOperation /> -->
    </div>
    <div class="sidebar-handle absolute right-0 bottom-9 z-10 px-4 py-1 bg-light dark:bg-dark cursor-pointer hidden md:block" @click="handleCollapsed()">
      <div v-if="collapsed" class="i-carbon:caret-right" />
      <div v-else class="i-carbon:caret-left" />
    </div>
  </div>
</template>
