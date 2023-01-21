import mapboxgl from 'mapbox-gl'

export class MyCustomControl {
  map: mapboxgl.Map
  container: HTMLElement

  constructor(map: mapboxgl.Map) {
    this.map = map
    this.container = document.createElement('div')
  }

  onAdd(map: mapboxgl.Map) {
    this.map = map
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group text-black'
    this.container.textContent = 'Dark'
    this.container.onclick = () => {
      toggleDark()
    }
    return this.container
  }

  onRemove() {
    this.container.parentNode!.removeChild(this.container)
    this.map = new mapboxgl.Map()
  }
}
