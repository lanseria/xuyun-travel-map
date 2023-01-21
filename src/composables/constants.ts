import { osmStyle } from './mapStyle'

const MapBoxStylePrefix = 'mapbox://styles'

export const MapboxAccessToken = 'pk.eyJ1IjoibGFuc2VyaWEiLCJhIjoiY2wxMGo5ZWk3MTF3dTNkcnRwcDMyMXowOSJ9.kxLDvTThtaU0uiBOXanNvA'

export const MAP_PLACE_SOURCE = 'MapPlaceSource'
export const MAP_PLACE_LAYER_POINT = 'MapPlaceLayerPoint'
export const MAP_PLACE_LAYER_LINESTRING_BG = 'MAP_PLACE_LAYER_LINESTRING_BG'
export const MAP_PLACE_LAYER_LINESTRING_DASHED = 'MAP_PLACE_LAYER_LINESTRING_DASHED'

export const LayerStyleList = [
  {
    name: 'osm',
    value: 'osm',
    style: osmStyle,
  },
  {
    name: 'streets',
    value: 'streets',
    style: `${MapBoxStylePrefix}/lanseria/cld5ur36v000301lngmbtq0qh`,
  },
]
