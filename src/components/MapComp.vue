<script setup lang="ts">
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

import 'mapbox-gl/dist/mapbox-gl.css'
import { LayerStyleList, MapboxAccessToken, mapStyle } from '~/composables'

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
    zoom: 15,
    preserveDrawingBuffer: true,
    hash: true,
  })
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))
  window.map = map

  map.addControl(new mapboxgl.NavigationControl())

  map.on('load', () => {
    map!.resize()
    // mapLoad()
    updateMap()
  })
})
</script>

<template>
  <div
    ref="mapContainer"
    class="h-full w-full top-0 bottom-0 left-0 right-0 relative"
  >
    <div />
  </div>
</template>
