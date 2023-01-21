<script setup lang="ts">
// import type { Ref } from 'vue'
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
// import * as MapboxDirections from '@mapbox/mapbox-gl-directions'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

import 'mapbox-gl/dist/mapbox-gl.css'
// import type { Feature, FeatureCollection, Point } from '@turf/turf'
import { LayerStyleList, MapboxAccessToken, MyCustomControl, mapPlacePoints, mapStyle } from '~/composables'

mapboxgl.accessToken
  = MapboxAccessToken

let map: mapboxgl.Map | null = null
const mapContainer = shallowRef()

const updateMap = () => {
  //
}
const { execute, isFetching, error, data: fetchData, abort, canAbort, onFetchResponse, onFetchError } = useFetch('/202212-202301.geojson', { immediate: true }).get().json()

onFetchResponse(() => {
  mapPlacePoints.value = fetchData.value.features
})

onMounted(() => {
  const styleValue = LayerStyleList.find(item => item.value === mapStyle.value)
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: styleValue?.style,
    // style: 'mapbox://styles/mapbox/outdoors-v12',
    center: mapCenter.value as LngLatLike,
    zoom: 7.53,
    preserveDrawingBuffer: true,
    hash: true,
  })
  window.map = map

  map.addControl(new mapboxgl.NavigationControl())
  map.addControl(new mapboxgl.FullscreenControl())
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))

  map.addControl(new MyCustomControl(map))

  map.on('load', () => {
    map!.resize()
    mapLoad()
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
