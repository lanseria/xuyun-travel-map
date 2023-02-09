import { reloadPlace } from './mapLayer'
import { mapPlacePointsFeatures } from './store'

// const loadImg = (name: string, url: string, sdf = false) => {
//   const map = window.map
//   if (map.hasImage(name))
//     return

//   map.loadImage(url, (error, image) => {
//     if (error)
//       throw error
//     image && map.addImage(name, image, { sdf })
//   })
// }

// function createColorPoint(...color: number[]) {
//   const d = 48
//   const r = d / 2
//   const r2 = r ** 2
//   const bytesPerPixel = 4

//   const data = new Uint8Array(d * d * bytesPerPixel)

//   for (let x = 0; x < d; x++) {
//     for (let y = 0; y < d; y++) {
//       if ((x - r) ** 2 + (y - r) ** 2 >= r2)
//         continue

//       const offset = (y * d + x) * bytesPerPixel
//       for (let b = 0; b < bytesPerPixel; b++) data[offset + b] = color[b]
//     }
//   }
//   return { width: d, height: d, data }
// }

export const mapLoad = () => {
  // const map = window.map
  // map.addImage('#79c0ff', createColorPoint(121, 192, 255, 255))
  // map.addImage('#50C240', createColorPoint(80, 194, 64, 255))
  // map.addImage('#F3AE1A', createColorPoint(255, 193, 7, 255))
  // map.addImage('#ffb8b8', createColorPoint(255, 184, 184, 255))
  // map.addImage('#7e7e7e', createColorPoint(125, 125, 125, 255))
  window.map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14,
  })
  window.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 })
  watchDebounced(() => mapPlacePointsFeatures.value, () => {
    console.warn('mapPlaceFeatures changed')
    reloadPlace()
  }, { debounce: 300, maxWait: 600, immediate: true })

  setTimeout(() => {
    fitBbox(undefined)
  }, 1000)
}
