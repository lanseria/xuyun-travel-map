import type { Feature, LineString, Point, Polygon } from '@turf/turf'
import * as turf from '@turf/turf'
import type { AllFeature, LineFeature, PointFeature, PointFeatureProp, RawData, RouteVideoItem, StartEndPointFeature, VideoData } from './types'

export const mapContainerWidth = ref(0)

export const collapsed = ref(false)
export const isAnimation = ref(false)

watchDebounced(() => collapsed.value, () => {
  window.map.resize()
}, { debounce: 300, maxWait: 600 })
export const handleCollapsed = () => {
  collapsed.value = !collapsed.value
}
export const handleCollapsedFalse = () => {
  collapsed.value = false
}
export const currentProperties = ref<PointFeatureProp>()
export const currentFeature = ref<PointFeature>()

export const mapLoaded = ref(false)

export const mapDistanceStartInput = ref('')
export const mapDistanceEndInput = ref('')

export const handleSetStartPoint = () => {
  if (currentFeature.value)
    mapDistanceStartInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const handleSetEndPoint = () => {
  if (currentFeature.value)
    mapDistanceEndInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const activeTab = useStorage('map-activeTab', 'detail')

export const mapCenter = useStorage('map-center', [109, 35])
export const mapStyle = useStorage('map-style', 'streets')

export type MyFeature = Feature<Polygon | Point | LineString>

export const mapPlaceFeatures = ref<Array<LineFeature | PointFeature | StartEndPointFeature>>([])
export const mapVideos = ref<VideoData[]>([])

export const lastestVideoInfo = ref<RawData>()
// 当前路线
export const currentRouteValue = ref('')
// 所有路线
export const allRouteList = ref<RouteVideoItem[]>([])

const { data, onFetchResponse } = useFetch('/data/routes.json', { immediate: true }).get().json()
// 获取最新视频信息
const { data: lastVideoData, onFetchResponse: lastVideoOnFetchResponse } = useFetch('/data/lastest.json', { immediate: true }).get().json()
lastVideoOnFetchResponse(() => {
  lastestVideoInfo.value = lastVideoData.value
})

watchDebounced(() => currentRouteValue.value, () => {
  // fetchRouteData()
}, { debounce: 300, maxWait: 600 })

onFetchResponse(() => {
  allRouteList.value = data.value
  allRouteList.value.forEach((item) => {
    mapPlaceFeatures.value.push(...item.featureList)
  })
  // console.log(mapPlaceFeatures.value)
  // console.log(mapPlaceFeatures.value)
  // fetchAllRouteLines()
  // fetchRouteData()
})

export const mapPlaceFeatureCollection = computed(() => {
  const mapFeatureList: AllFeature[] = [...mapPlaceFeatures.value]
  // if (currentRouteValue.value) {
  //   mapFeatureList = mapFeatureList.filter((item) => {
  //     // item.properties
  //   })
  // }
  return mapFeatureList
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

export const reloadInitStatus = () => {
  currentFeature.value = undefined
  currentProperties.value = undefined
  reloadPlace()
  // fitBbox()
}
