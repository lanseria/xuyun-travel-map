// import { osmStyle } from './mapStyle'

export const MAP_PLACE_SOURCE = 'MapPlaceSource'
export const MAP_PLACE_LAYER_POINT = 'MapPlaceLayerPoint'
export const MAP_PLACE_LAYER_LINESTRING_BG = 'MAP_PLACE_LAYER_LINESTRING_BG'
export const MAP_PLACE_LAYER_LINESTRING_DASHED = 'MAP_PLACE_LAYER_LINESTRING_DASHED'

export const MAP_PLACE_LAYER_BBOX = 'MapPlaceLayerBbox'

export const MapboxAccessToken = 'pk.eyJ1IjoibGFuc2VyaWEiLCJhIjoiY2tzNDE4MDI0MHg5ZjJvcndtZzF4YTB6aCJ9.5k-y1Bx3km5MAOp4KVpb9g'

export const LayerStyleList = [
  {
    name: 'streets',
    value: 'streets',
    style: 'mapbox://styles/lanseria/clhluh3n100kq01r87c9deet0',
  },
  {
    name: 'Satellite Streets',
    value: 'satellite_streets',
    style: 'mapbox://styles/lanseria/cldecwoux001t01pk90yx1jj3',
  },
  {
    name: 'Monochrome',
    value: 'monochrome',
    style: 'mapbox://styles/lanseria/cldwdod87000e01pcn2ezak1n',
  },
]

export function initEditFormData() {
  return {
    vid: '',
    vName: '',
    vDate: '',
    vDistanceKm: 0,
    vClips: [],
  }
}
