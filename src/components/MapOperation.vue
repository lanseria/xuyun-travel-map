<script lang="ts" setup>
import type { LngLatLike } from 'mapbox-gl'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import type { NumericLiteral } from '@babel/types'
import { reloadInitStatus } from '~/composables'

let savedBearing = 0

const handle3DStart = () => {
  if (currentProperties.value) {
    const map = window.map
    const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
    const currentPoint = mapPlacePoints.value[currentIdx]
    const nextPoint = mapPlacePoints.value[currentIdx + 1]
    if (nextPoint) {
      const bearing = turf.bearing(currentPoint.geometry.coordinates, nextPoint.geometry.coordinates)
      savedBearing = bearing || savedBearing
      map.flyTo({
        center: currentPoint.geometry.coordinates as LngLatLike,
        bearing: savedBearing,
        pitch: 70,
        zoom: 14,
        offset: [0, 500],
      })
    }
  }
}

let stopNumber = 0

const cameraStart = () => {
  const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
  const currentPoint = mapPlacePoints.value[currentIdx]
  const vLine = mapPlaceFinishedLine.value
  if (vLine) {
    const map = window.map
    const routeDistance = turf.lineDistance(vLine, { units: 'meters' })
    let start = 0
    const animationDuration = 800000
    const distance = 10000
    function frame(time: number) {
      if (!start)
        start = time
      const phase = (time - start) / animationDuration
      if (phase > 1) {
        // wait 1.5 seconds before looping
        setTimeout(() => {
          start = 0.0
        }, 1500)
      }
      // 前方目标
      const targetAlong = routeDistance * phase
      // console.log('targetAlong: ', targetAlong)
      // 这是摄像头
      const cameraPointCood = (function () {
        if (targetAlong >= distance) {
          const cameraAlong = targetAlong - distance
          // console.log('cameraAlong: ', cameraAlong)
          return turf.along(vLine!, cameraAlong, { units: 'meters' }).geometry.coordinates
        }
        else {
          return currentPoint.geometry.coordinates
        }
      })() as LngLatLike
      const camera = map.getFreeCameraOptions()
      const cameraAltitude = 3000

      const targetPoint = turf.along(vLine, targetAlong, { units: 'meters' })

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        cameraPointCood as LngLatLike,
        cameraAltitude,
      )

      // tell the camera to look at a point along the route
      camera.lookAtPoint(targetPoint.geometry.coordinates as LngLatLike)

      map.setFreeCameraOptions(camera)

      stopNumber = window.requestAnimationFrame(frame)
    }
    console.log(stopNumber)
    if (stopNumber)
      cancelAnimationFrame(stopNumber)
    else
      window.requestAnimationFrame(frame)
  }
}

const handle3DNext = () => {
  const map = window.map
  const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
  const nextIdx = currentIdx
  const currentPoint = mapPlacePoints.value[nextIdx]
  const nextPoint = mapPlacePoints.value[nextIdx + 1]
  if (nextPoint) {
    const camera = map.getFreeCameraOptions()
    const position = currentPoint.geometry.coordinates as LngLatLike
    const altitude = 3000

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude)
    camera.lookAtPoint(nextPoint.geometry.coordinates as LngLatLike)

    map.setFreeCameraOptions(camera)
    handleFeatureDetail(nextPoint)
  }
}
</script>

<template>
  <ASpace>
    <div class="custom-btn" @click="reloadInitStatus">
      <icon-reply :size="40" />
    </div>
    <div class="custom-btn" @click="toggleAnimation">
      <icon-play-circle-fill v-if="!isAnimation" :size="40" />
      <icon-pause-circle-fill v-else :size="40" />
    </div>

    <div class="custom-btn">
      <icon-skip-previous-fill :size="40" />
    </div>
    <div class="custom-btn" @click="handle3DStart()">
      <icon-play-arrow-fill :size="40" />
    </div>
    <div class="custom-btn" @click="cameraStart()">
      <icon-skip-next-fill :size="40" />
    </div>
  </ASpace>
</template>

<style lang="css" scoped>
.custom-btn {
  @apply bg-white rounded-1/2 w-50px h-50px flex justify-center items-center cursor-pointer hover:text-blue-5;
}
</style>
