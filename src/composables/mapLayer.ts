// import * as turf from '@turf/turf'
// import type { BBox } from '@turf/turf'
import type { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import { MAP_PLACE_LAYER_BBOX, MAP_PLACE_LAYER_LINESTRING_BG, MAP_PLACE_LAYER_LINESTRING_DASHED, MAP_PLACE_LAYER_POINT, MAP_PLACE_SOURCE } from './constants'
import { activeTab, currentFeature, currentProperties, editForm, isAnimation, isEditSide, isGetCoord, mapPlaceLineBbox, mapPlacePointsFeatures, vClipIdx } from './store'
import type { PointFeature } from './types'
import { queryDevice } from './utils'

let stopNumber = 0

export function fitBbox(b: [number, number, number, number] | undefined) {
  const box = b || mapPlaceLineBbox.value.bbox!
  const map = window.map
  const bbox: LngLatBoundsLike = [[box[0], box[1]], [box[2], box[3]]]
  const isMobile = queryDevice()
  if (isMobile) {
    map.fitBounds(bbox, {
      padding: { top: 200, bottom: 10, left: 20, right: 20 },
      duration: 1000,
    })
  }
  else {
    map.fitBounds(bbox, {
      padding: { top: 200, bottom: 20, left: 200, right: 200 },
      duration: 1000,
    })
  }
}

export function addPlaceSource() {
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

export const customPopupStyleOpt: mapboxgl.PopupOptions = {
  offset: [-10, -20],
  anchor: 'bottom-right',
  closeButton: false,
  closeOnClick: true,
  className: 'LayerPopup',
}

export function descHtml(props: PointFeature) {
  return `
  <div>${props.properties.name}</div>
  <iframe style="height:120px; width:100%;" src="//player.bilibili.com/player.html?bvid=${props.properties.vid}&t=${props.properties.vt}&as_wide=1&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" />`
}

const popup = new mapboxgl.Popup(customPopupStyleOpt)

export function handleFeatureDetail(props: PointFeature, isTabDetail = true, isFly = true) {
  console.warn('feature-click', isGetCoord.value)
  if (isGetCoord.value) {
    const item = editForm.value.vClips[vClipIdx.value]
    if (item)
      item.coordinates = props.geometry.coordinates as [number, number]
      // isGetCoord.value = false
  }
  else {
    const description = descHtml(props)
    popup.remove()
    const coordinates = props.geometry.coordinates.slice() as LngLatLike
    popup.setLngLat(coordinates).setHTML(description).addTo(window.map)

    // 设置完立即显示其当前要素属性
    isTabDetail && (activeTab.value = 'detail')
    currentProperties.value = {
      ...props.properties,
    }
    // console.log(props)
    currentFeature.value = { ...props }
    collapsed.value = true
    isEditSide.value = false
    // isFly && window.map.flyTo({
    //   center: currentFeature.value.geometry.coordinates as LngLatLike,
    //   zoom: 15,
    //   speed: 2,
    //   curve: 1,
    // })
  }
}

function handleFeatureClick(e: any) {
  const props: PointFeature = e.features[0]
  if (props.properties.id) {
    const currentFeature = mapPlacePoints.value.find(item => item.properties.id === props.properties.id)
    // console.log(currentFeature)
    if (currentFeature) {
      // const isZoomFit = !currentProperties.value
      handleFeatureDetail(currentFeature)
      // if (isZoomFit)
      //   fitBbox()
      // else
    }
  }
}

function drawAnimateLine() {
  const map = window.map
  const source: any = map.getSource(MAP_PLACE_SOURCE)
  const LayerNameBg = `${MAP_PLACE_LAYER_LINESTRING_BG}`
  const LayerNameDashed = `${MAP_PLACE_LAYER_LINESTRING_DASHED}`
  if (!source)
    return
  if (map.getLayer(LayerNameBg))
    map.removeLayer(LayerNameBg)
  if (map.getLayer(LayerNameDashed))
    map.removeLayer(LayerNameDashed)

  map.addLayer({
    id: LayerNameBg,
    type: 'line',
    source: MAP_PLACE_SOURCE,
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 6,
      'line-opacity': 0.4,
    },
    filter: ['==', ['geometry-type'], 'LineString'],
  })

  // add a line layer with line-dasharray set to the first value in dashArraySequence
  map.addLayer({
    id: LayerNameDashed,
    type: 'line',
    source: MAP_PLACE_SOURCE,
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 6,
      // 'line-dasharray': [0, 4, 3],
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
        LayerNameDashed,
        'line-dasharray',
        dashArraySequence[step],
      )
      step = newStep
    }

    // Request the next frame of the animation.
    stopNumber = requestAnimationFrame(animateDashArray)
  }

  // start the animation
  cancelAnimationFrame(stopNumber)
  isAnimation.value && animateDashArray(0)
}

export function drawLine() {
  drawAnimateLine()
}

export function drawPoint() {
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
      'icon-size': 0.15,
      'icon-image': ['get', 'icon'],
      'text-size': 12,
      // 'text-font': ['HarmonyOS Sans SC Regular'],
      'text-offset': [0, 0.55],
      'text-anchor': 'top',
      'icon-allow-overlap': true,
    },
    paint: {
      'text-color': '#333',
      'text-halo-color': '#fff',
      'text-halo-width': 1,
      'text-halo-blur': 0,
    },
    filter: ['==', ['geometry-type'], 'Point'],
  })

  map.on('click', MAP_PLACE_LAYER_POINT, handleFeatureClick)
  map.on('touchend', MAP_PLACE_LAYER_POINT, handleFeatureClick)
}

export function drawBboxPolygon() {
  const map = window.map
  const source: any = map.getSource(MAP_PLACE_SOURCE)
  if (!source)
    return
  if (map.getLayer(MAP_PLACE_LAYER_BBOX))
    map.removeLayer(MAP_PLACE_LAYER_BBOX)

  // Add a black outline around the polygon.
  map.addLayer({
    id: MAP_PLACE_LAYER_BBOX,
    type: 'line',
    source: MAP_PLACE_SOURCE,
    layout: {},
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], '#aaa'],
      'line-width': ['coalesce', ['get', 'line-width'], 5],
      'line-opacity': ['coalesce', ['get', 'line-opacity'], 1],
      'line-dasharray': [0, 4, 3],
    },
    filter: ['==', ['geometry-type'], 'Polygon'],
  })
}

export function reloadPlace() {
  addPlaceSource()
  drawLine()
  if (!clearMode.value) {
    drawPoint()
    drawBboxPolygon()
  }
}
