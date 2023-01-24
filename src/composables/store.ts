import type { Ref } from 'vue'
import type { Feature, LineString, Point, Polygon } from '@turf/turf'
import * as turf from '@turf/turf'
import type { RawData } from './types'

export const collapsed = ref(false)
export const isAnimation = ref(false)
export const stopNumber = ref(0)
export const toggleAnimation = () => {
  isAnimation.value = !isAnimation.value
  drawLine()
  drawPoint()
}
watchDebounced(() => collapsed.value, () => {
  window.map.resize()
}, { debounce: 300, maxWait: 600 })
export const handleCollapsed = () => {
  collapsed.value = !collapsed.value
}
export const handleCollapsedFalse = () => {
  collapsed.value = false
}

export const currentProperties = ref(null) as Ref<any>
export const currentFeature = ref() as Ref<Feature<Point>>

export const mapLoaded = ref(false)

export const mapDistanceStartPoint = ref<Feature<Point>>()
export const mapDistanceEndPoint = ref<Feature<Point>>()

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

export const mapPlacePoints = useStorage<Feature<Point>[]>('map-place-point-features', [])
const { data, onFetchResponse } = useFetch('/data/2212-2303-dongbei/data/all-points.geojson', { immediate: true }).get().json()
onFetchResponse(() => {
  const features: Feature<Point>[] = data.value.features
  mapPlacePoints.value = features
})

export const mapStartPlacePoint = ref<Feature<Point>>()
export const mapEndPlacePoint = ref<Feature<Point>>()
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
  const finishedLineString = mapPlaceFinishedLine.value
  finishedLineString.properties!.color = 'green'

  const unfinishedLineString = mapPlaceUnfinishedLine.value
  unfinishedLineString.properties!.color = 'gray'
  const all: MyFeature[] = [...mapPlacePoints.value, finishedLineString, unfinishedLineString]
  return turf.featureCollection(all)
})
