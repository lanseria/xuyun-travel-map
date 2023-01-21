// import * as turf from '@turf/turf'
import { MAP_PLACE_LAYER_LINESTRING_BG, MAP_PLACE_LAYER_LINESTRING_DASHED, MAP_PLACE_LAYER_POINT, MAP_PLACE_SOURCE } from './constants'
import { mapPlacePointsFeatures } from './store'

export const addPlaceSource = () => {
  const map = window.map
  const source: any = map.getSource(MAP_PLACE_SOURCE)
  if (source) {
    source.setData(
      mapPlacePointsFeatures.value,
    )
  }
  else {
    map.addSource(MAP_PLACE_SOURCE, {
      type: 'geojson',
      data: mapPlacePointsFeatures.value,
    })
  }
}

export const drawLine = () => {
  const map = window.map
  const source: any = map.getSource(MAP_PLACE_SOURCE)
  if (!source)
    return
  if (map.getLayer(MAP_PLACE_LAYER_LINESTRING_BG))
    map.removeLayer(MAP_PLACE_LAYER_LINESTRING_BG)
  if (map.getLayer(MAP_PLACE_LAYER_LINESTRING_DASHED))
    map.removeLayer(MAP_PLACE_LAYER_LINESTRING_DASHED)

  map.addLayer({
    id: MAP_PLACE_LAYER_LINESTRING_BG,
    type: 'line',
    source: MAP_PLACE_SOURCE,
    // layout: {
    //   'line-cap': ['coalesce', ['get', 'line-cap'], 'round'],
    //   'line-join': ['coalesce', ['get', 'line-cap'], 'round'],
    // },
    paint: {
      // 'line-color': ['coalesce', ['get', 'line-color'], '#000'],
      // 'line-width': ['coalesce', ['get', 'line-width'], 2],
      // 'line-opacity': ['coalesce', ['get', 'line-opacity'], 1],
      'line-color': 'green',
      'line-width': 6,
      'line-opacity': 0.4,
    },
    filter: ['==', ['geometry-type'], 'LineString'],
  })

  // add a line layer with line-dasharray set to the first value in dashArraySequence
  map.addLayer({
    id: MAP_PLACE_LAYER_LINESTRING_DASHED,
    type: 'line',
    source: MAP_PLACE_SOURCE,
    paint: {
      'line-color': 'green',
      'line-width': 6,
      'line-dasharray': [0, 4, 3],
    },
    filter: ['==', ['geometry-type'], 'LineString'],
  })
  // technique based on https://jsfiddle.net/2mws8y3q/
  // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
  const dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
  ]

  let step = 0

  function animateDashArray(timestamp: number) {
  // Update line-dasharray using the next value in dashArraySequence. The
  // divisor in the expression `timestamp / 50` controls the animation speed.
    const newStep = +parseInt(
      ((timestamp / 50) % dashArraySequence.length).toString(),
    )

    if (newStep !== step) {
      map.setPaintProperty(
        MAP_PLACE_LAYER_LINESTRING_DASHED,
        'line-dasharray',
        dashArraySequence[step],
      )
      step = newStep
    }

    // Request the next frame of the animation.
    requestAnimationFrame(animateDashArray)
  }

  // start the animation
  animateDashArray(0)
}

export const drawPoint = () => {
  const map = window.map
  const source: any = map.getSource(MAP_PLACE_SOURCE)
  if (!source)
    return
  if (map.getLayer(MAP_PLACE_LAYER_POINT))
    map.removeLayer(MAP_PLACE_LAYER_POINT)
  map.addLayer({
    id: MAP_PLACE_LAYER_POINT,
    type: 'symbol',
    source: MAP_PLACE_SOURCE,
    layout: {
      'text-field': ['get', 'name'],
      'icon-size': 0.25,
      'icon-image': ['get', 'marker-color'],
      'text-size': 12,
      'text-offset': [0, 0.5],
      'text-anchor': 'top',
      'icon-allow-overlap': true,
    },
    paint: {
      'text-color': isDark.value ? '#bbb' : '#7e6c56',
      'text-halo-color': isDark.value ? '#000' : '#fff',
      'text-halo-width': 1,
      'text-halo-blur': 0,
    },
    filter: ['==', ['geometry-type'], 'Point'],
  })
}

export const reloadPlace = () => {
  addPlaceSource()
  drawLine()
  drawPoint()
}
