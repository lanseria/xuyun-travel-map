// import type { Ref } from 'vue'
import type { Feature, LineString, Point, Polygon } from '@turf/turf'
import * as turf from '@turf/turf'

export const collapsed = ref(false)

export const mapCenter = useStorage('map-center', [124.724, 40.881])
export const mapStyle = useStorage('map-style', 'streets')

export type MyFeature = Feature<Polygon | Point | LineString>

export const mapPlacePoints = useStorage<Feature<Point>[]>('map-place-point-features', [])

export const mapPlaceLine = computed(() => {
  const linePointList = mapPlacePoints.value.map((item) => {
    return item.geometry.coordinates
  })
  return turf.lineString(linePointList)
})

export const mapPlacePointsFeatures = computed(() => {
  const all: MyFeature[] = [...mapPlacePoints.value, mapPlaceLine.value]
  return turf.featureCollection(all)
})
