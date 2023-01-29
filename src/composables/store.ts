import type { Feature, LineString, Point, Polygon } from '@turf/turf'
import * as turf from '@turf/turf'
import type { PointFeature, PointFeatureProp, RawData, RouteVideoJsonItem, VideoData } from './types'

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

export const mapDistanceStartPoint = ref<PointFeature>()
export const mapDistanceEndPoint = ref<PointFeature>()

export const mapDistanceStartInput = ref('')
export const mapDistanceEndInput = ref('')

export const handleSetStartPoint = () => {
  mapDistanceStartPoint.value = currentFeature.value
  if (currentFeature.value)
    mapDistanceStartInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const handleSetEndPoint = () => {
  mapDistanceEndPoint.value = currentFeature.value
  if (currentFeature.value)
    mapDistanceEndInput.value = JSON.stringify(currentFeature.value.geometry.coordinates)
}

export const activeTab = useStorage('map-activeTab', 'detail')

export const mapCenter = useStorage('map-center', [124.724, 40.881])
export const mapStyle = useStorage('map-style', 'streets')

export const handleToggleMapStyle = () => {
  mapStyle.value = mapStyle.value === 'satellite_streets' ? 'streets' : 'satellite_streets'
  location.reload()
}

export type MyFeature = Feature<Polygon | Point | LineString>

export const mapPlacePoints = ref<PointFeature[]>([])
export const mapVideos = ref<VideoData[]>([])

export const mapStartPlacePoint = ref<PointFeature>()
export const mapEndPlacePoint = ref<PointFeature>()

export const lastestVideoInfo = ref<RawData>()

export const currentRouteValue = ref('2212-2303-dongbei')
export const allRouteList = ref<RouteVideoJsonItem[]>([])
const { data, onFetchResponse } = useFetch('/data/routes.json', { immediate: true }).get().json()

export const fetchRouteData = () => {
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

watchDebounced(() => currentRouteValue.value, () => {
  fetchRouteData()
}, { debounce: 300, maxWait: 600 })

onFetchResponse(() => {
  allRouteList.value = data.value
  fetchRouteData()
})

export const mapPlaceFinishedLine = computed(() => {
  const linePointList = mapPlacePoints.value.map((item) => {
    return item.geometry.coordinates
  })
  return turf.lineString(linePointList)
})

export const mapPlaceUnfinishedLine = computed(() => {
  // console.log(mapPlacePoints.value)
  const linePointList = [mapPlacePoints.value[mapPlacePoints.value.length - 1].geometry.coordinates, mapEndPlacePoint.value!.geometry.coordinates]
  return turf.lineString(linePointList)
})

export const mapPlaceLineBbox = computed(() => {
  if (currentProperties.value) {
    const vid = currentProperties.value.vid
    const video = mapVideos.value.find(item => item.vid === vid)
    if (video && video.vLine) {
      const bbox = turf.bbox(video.vLine)
      return turf.bboxPolygon(bbox)
    }
  }
  const bbox = turf.bbox(mapPlaceFinishedLine.value)
  return turf.bboxPolygon(bbox)
})

export const mapPlacePointsFeatures = computed(() => {
  // filter Points
  // const filterPoints
  // = currentProperties.value
  //   ? mapPlacePoints.value.filter(item =>
  //     item.properties.vid === currentProperties.value!.vid)
  //   : [...mapPlacePoints.value]

  const filterPoints = [...mapPlacePoints.value]

  mapStartPlacePoint.value && filterPoints.push(mapStartPlacePoint.value)
  mapEndPlacePoint.value && filterPoints.push(mapEndPlacePoint.value)
  // 已完成的所有线路数组
  const finishedVideoLines: Feature<LineString>[] = []

  // if (currentProperties.value) {
  //   const video = mapVideos.value.find(item => item.vid === currentProperties.value!.vid)
  //   if (video?.vLine)
  //     finishedVideoLines.push(video.vLine)
  // }
  // else {
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
  // }

  // 未完成的直线对象
  const unfinishedLineString = mapPlaceUnfinishedLine.value
  unfinishedLineString.properties!.color = 'gray'
  // 组合所有 Features
  const all: MyFeature[] = [
    ...filterPoints,
    ...finishedVideoLines, unfinishedLineString,
    mapPlaceLineBbox.value,
  ]
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

export const reloadInitStatus = () => {
  currentFeature.value = undefined
  currentProperties.value = undefined
  reloadPlace()
  fitBbox()
}
