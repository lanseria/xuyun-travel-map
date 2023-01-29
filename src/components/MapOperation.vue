<script lang="ts" setup>
import type { LngLatLike } from 'mapbox-gl'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import type { Feature, LineString, Point } from '@turf/turf'
import type { PointFeature } from '~/composables'
import { customPopupStyleOpt, descHtml, reloadInitStatus } from '~/composables'

// let savedBearing = 0

const get点与线段最近的点 = (line: Feature<LineString>, pt: PointFeature) => {
  return turf.nearestPointOnLine(line, pt)
}

const get指定点到终点的线段 = (line: Feature<LineString>, pt: Feature<Point>) => {
  const len = turf.length(line, { units: 'meters' })
  const endPointOfLine = turf.along(line, len, { units: 'meters' })
  return turf.lineSlice(pt, endPointOfLine, line)
}

const stopNumber = ref(0)
// 开始计为0
let start = 0
let popupInstance: mapboxgl.Popup[] = []

const clearPopup = () => {
  popupInstance.forEach((popup) => {
    popup.remove()
  })
}

const clearAnimation = () => {
  start = 0.0
  cancelAnimationFrame(stopNumber.value)
  stopNumber.value = 0
  clearPopup()
}

const cameraStart = () => {
  const vid = currentProperties.value?.vid
  const vIdx = mapVideos.value.findIndex(item => item.vid === vid)
  const vLine = mapVideos.value[vIdx].vLine
  if (vLine && currentFeature.value) {
    const pointOfLine = get点与线段最近的点(vLine, currentFeature.value)
    // console.log('pointOfLine: ', pointOfLine)
    const restLine = get指定点到终点的线段(vLine, pointOfLine)
    // console.log('restLine: ', restLine)
    // const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
    const currentPoint = currentFeature.value
    // const vLine = mapPlaceFinishedLine.value
    // if (vLine) {
    const map = window.map
    // 这段总长度
    const routeDistance = turf.lineDistance(restLine, { units: 'meters' })
    // console.log('restLen: ', routeDistance)
    const RADIO = 0.5
    // 摄像机与观察点距离1w米
    const distance = 3000
    const cameraHEIGHT = 1000
    function frame(time: number) {
      if (!start)
        start = time
        // 划分单位
      const phase = (time - start) / routeDistance * RADIO
      if (phase > 1) {
        // wait 1.5 seconds before looping
        setTimeout(() => {
          clearAnimation()
        }, 1500)
      }
      // 初始前方目标距离，默认为0
      // 10 20
      // 10000 10 20000
      // 100000 100 200000
      const targetAlong = (time - start) * RADIO
      // console.log('targetAlong: ', targetAlong)
      // 这是摄像头
      const cameraPointCoord = (function () {
        if (targetAlong >= distance) {
          const cameraAlong = targetAlong - distance
          // console.log('cameraAlong: ', cameraAlong)
          return turf.along(restLine, cameraAlong, { units: 'meters' }).geometry.coordinates
        }
        else {
          return currentPoint.geometry.coordinates
        }
      })() as LngLatLike
      const camera = map.getFreeCameraOptions()
      const cameraAltitude = cameraHEIGHT

      const targetPoint = turf.along(restLine, targetAlong, { units: 'meters' })

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        cameraPointCoord as LngLatLike,
        cameraAltitude,
      )

      // tell the camera to look at a point along the route
      camera.lookAtPoint(targetPoint.geometry.coordinates as LngLatLike)

      map.setFreeCameraOptions(camera)

      stopNumber.value = window.requestAnimationFrame(frame)
    }
    if (stopNumber.value)
      clearAnimation()

    else window.requestAnimationFrame(frame)
  }
}

const showLinePopup = () => {
  const vid = currentProperties.value?.vid
  const currentVideoPoints = mapPlacePoints.value.filter(item => item.properties.vid === vid)
  popupInstance = currentVideoPoints.map((item) => {
    const description = descHtml(item)
    const popup = new mapboxgl.Popup(customPopupStyleOpt)
    return popup.setLngLat(item.geometry.coordinates as LngLatLike).setHTML(description).addTo(window.map)
  })
}

const handle3DStart = () => {
  showLinePopup()
  cameraStart()
  // if (currentProperties.value) {
  //   const map = window.map
  //   const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
  //   const currentPoint = mapPlacePoints.value[currentIdx]
  //   const nextPoint = mapPlacePoints.value[currentIdx + 1]
  //   if (nextPoint) {
  //     const bearing = turf.bearing(currentPoint.geometry.coordinates, nextPoint.geometry.coordinates)
  //     savedBearing = bearing || savedBearing
  //     map.flyTo({
  //       center: currentPoint.geometry.coordinates as LngLatLike,
  //       bearing: savedBearing,
  //       pitch: 70,
  //       zoom: 14,
  //       offset: [0, 500],
  //     })
  //   }
  // }
}

const handle3DNext = () => {
  const vid = currentProperties.value?.vid
  const vIdx = mapVideos.value.findIndex(item => item.vid === vid)
  const recordVideo = mapVideos.value[vIdx + 1]
  if (recordVideo) {
    const vPoints = mapPlacePoints.value.filter(item => item.properties.vid === recordVideo.vid)
    if (vPoints.length)
      handleFeatureDetail(vPoints[0], false)
  }
  // const map = window.map
  // const currentIdx = mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
  // const nextIdx = currentIdx
  // const currentPoint = mapPlacePoints.value[nextIdx]
  // const nextPoint = mapPlacePoints.value[nextIdx + 1]
  // if (nextPoint) {
  //   const camera = map.getFreeCameraOptions()
  //   const position = currentPoint.geometry.coordinates as LngLatLike
  //   const altitude = 3000

  //   camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude)
  //   camera.lookAtPoint(nextPoint.geometry.coordinates as LngLatLike)

  //   map.setFreeCameraOptions(camera)
  //   handleFeatureDetail(nextPoint)
  // }
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
      <icon-skip-previous-fill :size="40" @click="handle3DNext()" />
    </div>
    <div class="custom-btn" @click="handle3DStart()">
      <icon-play-arrow-fill v-if="stopNumber === 0" :size="40" />
      <icon-pause v-else :size="40" />
    </div>
    <div class="custom-btn" @click="handle3DNext()">
      <icon-skip-next-fill :size="40" />
    </div>
    <div class="custom-btn" @click="handleToggleMapStyle()">
      <icon-camera :size="40" />
    </div>
    <div class="custom-btn" @click="handleToggleMapPoints()">
      <icon-location :size="40" />
    </div>
  </ASpace>
</template>

<style lang="css" scoped>
.custom-btn {
  @apply bg-white rounded-1/2 w-50px h-50px flex justify-center items-center cursor-pointer hover:text-blue-5;
}
</style>
