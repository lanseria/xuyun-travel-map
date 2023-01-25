<script lang="ts" setup>
import type { LngLatLike } from 'mapbox-gl'
import type { PointFeature } from '~/composables'

const props = defineProps({
  vid: {
    type: String,
    required: true,
  },
})
const pointList = computed(() => {
  return mapPlacePoints.value.filter((p) => {
    return p.properties.vid === props.vid
  })
})

const handleZoomClick = (record: PointFeature, detail = false) => {
  handleFeatureDetail(record, detail)
  setTimeout(() => {
    window.map.flyTo({
      center: record.geometry.coordinates as LngLatLike,
      zoom: 12,
    })
  })
}
</script>

<template>
  <a-list>
    <a-list-item v-for="item in pointList" :key="item.properties.id">
      <div :class="{ 'text-red sepia': item.properties.id === currentProperties.id }">
        {{ item.properties.date }} {{ item.properties.time }} {{ item.properties.name }}
      </div>
      <div>
        视频切片 {{ item.properties.vt }}
      </div>
      <template #actions>
        <icon-edit @click="handleZoomClick(item, true)" />
        <icon-zoom-in @click="handleZoomClick(item)" />
      </template>
    </a-list-item>
  </a-list>
</template>
