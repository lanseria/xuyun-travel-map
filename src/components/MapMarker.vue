<script lang="ts" setup>
import type { PropType } from 'vue'
import mapboxgl from 'mapbox-gl'

const props = defineProps({
  color: {
    type: String,
    default: '#e7e7e7',
  },
  scale: {
    type: Number,
    default: 1,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  lngLat: {
    type: Object as PropType<any>,
    required: true,
  },
  properties: {
    type: Object as PropType<any>,
    required: true,
  },
})
let marker: any = null
const loadMarker = () => {
  const map = window.map
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h2>${props.properties.name}</h2>
    <p>时间: ${props.properties.date}</p>
    <p>是否扎营: ${props.properties.isCamp || false}</p>
    `,
  )
  // Set marker options.
  marker = new mapboxgl.Marker({
    color: props.properties['marker-color'] || props.color,
    draggable: props.draggable,
  }).setLngLat(props.lngLat)
    .setPopup(popup) // sets a popup on this marker
    .addTo(map)
}

onMounted(() => {
  loadMarker()
})
onUnmounted(() => {
  marker.remove()
})
</script>

<template>
  开发中
</template>
