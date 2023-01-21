import { osmStyle } from './mapStyle'

const MapBoxStylePrefix = 'mapbox://styles/mapbox/'

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
    name: 'satellite streets',
    value: 'satellite',
    style: `${MapBoxStylePrefix}satellite-streets-v12`,
  },
  {
    name: 'light',
    value: 'light',
    style: `${MapBoxStylePrefix}light-v11`,
  },
  {
    name: 'dark',
    value: 'dark',
    style: `${MapBoxStylePrefix}dark-v11`,
  },
  {
    name: 'streets',
    value: 'streets',
    style: `${MapBoxStylePrefix}streets-v12`,
  },
  {
    name: 'outdoors',
    value: 'outdoors',
    style: `${MapBoxStylePrefix}outdoors-v12`,
  },
]
