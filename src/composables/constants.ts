// import { osmStyle } from './mapStyle'

const MapBoxStylePrefix = 'mapbox://styles'

export const MapboxAccessToken = 'pk.eyJ1IjoibGFuc2VyaWEiLCJhIjoiY2tzNDE4MDI0MHg5ZjJvcndtZzF4YTB6aCJ9.5k-y1Bx3km5MAOp4KVpb9g'

export const MAP_PLACE_SOURCE = 'MapPlaceSource'
export const MAP_PLACE_LAYER_POINT = 'MapPlaceLayerPoint'
export const MAP_PLACE_LAYER_LINESTRING_BG = 'MAP_PLACE_LAYER_LINESTRING_BG'
export const MAP_PLACE_LAYER_LINESTRING_DASHED = 'MAP_PLACE_LAYER_LINESTRING_DASHED'

export const MAP_PLACE_LAYER_BBOX = 'MapPlaceLayerBbox'

export const LayerStyleList = [
  // {
  //   name: 'osm',
  //   value: 'osm',
  //   style: osmStyle,
  // },
  {
    name: 'streets',
    value: 'streets',
    style: `${MapBoxStylePrefix}/lanseria/cld5ur36v000301lngmbtq0qh`,
  },
  {
    name: 'Satellite Streets',
    value: 'satellite_streets',
    style: `${MapBoxStylePrefix}/lanseria/cldecwoux001t01pk90yx1jj3`,
  },
  {
    name: 'Monochrome',
    value: 'monochrome',
    style: `${MapBoxStylePrefix}/lanseria/cldwdod87000e01pcn2ezak1n`,
  },
]

export const initEditFormData = () => {
  return {
    vid: '',
    vName: '',
    vDate: '',
    vDistanceKm: 0,
    vClips: [],
  }
}
