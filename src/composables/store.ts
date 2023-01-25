import type { Ref } from 'vue'
import type { Feature, LineString, Point, Polygon } from '@turf/turf'
import * as turf from '@turf/turf'
import type { PointFeature, PointFeatureProp, RawData, VideoData } from './types'

export const collapsed = ref(false)
export const isAnimation = ref(false)
export const stopNumber = ref(0)

watchDebounced(() => collapsed.value, () => {
  window.map.resize()
}, { debounce: 300, maxWait: 600 })
export const handleCollapsed = () => {
  collapsed.value = !collapsed.value
}
export const handleCollapsedFalse = () => {
  collapsed.value = false
}
export const currentProperties = ref() as Ref<PointFeatureProp>
export const currentFeature = ref() as Ref<PointFeature>

export const mapLoaded = ref(false)

export const mapDistanceStartPoint = ref<PointFeature>()
export const mapDistanceEndPoint = ref<PointFeature>()

export const mapDistanceStartInput = ref('')
export const mapDistanceEndInput = ref('')

export const handleSetStartPoint = () => {
  mapDistanceStartPoint.value = currentFeature.value
  mapDistanceStartInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const handleSetEndPoint = () => {
  mapDistanceEndPoint.value = currentFeature.value
  mapDistanceEndInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const activeTab = useStorage('map-activeTab', 'detail')

export const mapCenter = useStorage('map-center', [124.724, 40.881])
export const mapStyle = useStorage('map-style', 'streets')

export type MyFeature = Feature<Polygon | Point | LineString>

export const mapPlacePoints = ref<PointFeature[]>([])
const { data, onFetchResponse } = useFetch('/data/2212-2303-dongbei/data/all-points.geojson', { immediate: true }).get().json()
onFetchResponse(() => {
  const features: PointFeature[] = data.value.features
  mapPlacePoints.value = features
})

export const mapVideos = ref<VideoData[]>([])
const { data: videoData, onFetchResponse: videoOnFetchResponse } = useFetch('/data/2212-2303-dongbei/data/all-videos.json', { immediate: true }).get().json()
videoOnFetchResponse(() => {
  const features: VideoData[] = videoData.value.map((item: any) => ({
    ...item, expand: '',
  }))
  mapVideos.value = features
})

export const mapStartPlacePoint = ref<PointFeature>()
export const mapEndPlacePoint = ref<PointFeature>()
const { data: endData, onFetchResponse: endOnFetchResponse } = useFetch('/video.json', { immediate: true }).get().json()
endOnFetchResponse(() => {
  mapStartPlacePoint.value = endData.value.startEndPoints[0]
  mapEndPlacePoint.value = endData.value.startEndPoints[1]
})

export const lastestVideoInfo = ref<RawData>()
const { data: lastVideoData, onFetchResponse: lastVideoOnFetchResponse } = useFetch('/data/lastest.json', { immediate: true }).get().json()
lastVideoOnFetchResponse(() => {
  lastestVideoInfo.value = lastVideoData.value
})

export const mapPlaceFinishedLine = computed(() => {
  const linePointList = mapPlacePoints.value.map((item) => {
    return item.geometry.coordinates
  })
  return turf.lineString(linePointList)
})

export const mapPlaceUnfinishedLine = computed(() => {
  const linePointList = [mapPlacePoints.value[mapPlacePoints.value.length - 1].geometry.coordinates, mapEndPlacePoint.value!.geometry.coordinates]
  return turf.lineString(linePointList)
})

export const mapPlaceLineBbox = computed(() => {
  const bbox = turf.bbox(mapPlaceFinishedLine.value)
  return turf.bboxPolygon(bbox)
})

export const mapPlacePointsFeatures = computed(() => {
  // const finishedLineString = mapPlaceFinishedLine.value
  // finishedLineString.properties!.color = 'green'

  const finishedVideoLines: Feature<LineString>[] = []
  mapVideos.value.forEach((videoItem, idx) => {
    if (videoItem.vLine) {
      const colorArray = ['#be185d', '#be123c', '#b91c1c', '#c2410c', '#b45309', '#b45309', '#4d7c0f',
        '#047857', '#0f766e', '#0e7490', '#0369a1', '#1d4ed8', '#4338ca', '#6d28d9', '#6d28d9', '#a21caf']
      const rand = idx % colorArray.length
      const rValue = colorArray[rand]
      const line = videoItem.vLine
      line.properties!.color = rValue
      finishedVideoLines.push(line)
    }
  })

  const unfinishedLineString = mapPlaceUnfinishedLine.value
  unfinishedLineString.properties!.color = 'gray'
  const all: MyFeature[] = [...mapPlacePoints.value, ...finishedVideoLines, unfinishedLineString]
  return turf.featureCollection(all)
})

export const toggleAnimation = () => {
  isAnimation.value = !isAnimation.value
  drawLine()
  drawPoint()
  // const currentLine = mapVideos.value.find(item => item.vid)?.vLine
  // console.log(currentLine)
  // if (currentLine) {
  //   const map = window.map
  //   const animationDuration = 80000
  //   const cameraAltitude = 10000
  //   // get the overall distance of each route so we can interpolate along them
  //   const routeDistance = turf.lineDistance(currentLine)
  //   console.log('routeDistance:', routeDistance)

  //   let start = 0

  //   function frame(time: number) {
  //     if (!start)
  //       start = time
  //     // phase determines how far through the animation we are
  //     const phase = (time - start) / animationDuration

  //     // phase is normalized between 0 and 1
  //     // when the animation is finished, reset start to loop the animation
  //     if (phase > 1) {
  //     // wait 1.5 seconds before looping
  //       setTimeout(() => {
  //         start = 0.0
  //       }, 1500)
  //     }
  //     // use the phase to get a point that is the appropriate distance along the route
  //     // this approach syncs the camera and route positions ensuring they move
  //     // at roughly equal rates even if they don't contain the same number of points
  //     const alongRoute = turf.along(
  //       currentLine!,
  //       routeDistance * phase + 100,
  //     ).geometry.coordinates

  //     const alongCamera = turf.along(
  //       currentLine!,
  //       routeDistance * phase,
  //     ).geometry.coordinates

  //     const camera = map.getFreeCameraOptions()

  //     // set the position and altitude of the camera
  //     camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
  //       {
  //         lng: alongCamera[0],
  //         lat: alongCamera[1],
  //       },
  //       cameraAltitude,
  //     )

  //     // tell the camera to look at a point along the route
  //     camera.lookAtPoint({
  //       lng: alongRoute[0],
  //       lat: alongRoute[1],
  //     })

  //     map.setFreeCameraOptions(camera)

  //     window.requestAnimationFrame(frame)
  //   }

  //   window.requestAnimationFrame(frame)
  // }
}
