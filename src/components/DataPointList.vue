<script lang="ts" setup>
// import type { LngLatLike } from 'mapbox-gl'
import type { PointFeature } from '~/composables'

const props = defineProps({
  vid: {
    type: String,
    required: true,
  },
})
const pointList = computed(() => {
  return []
  // return mapPlacePoints.value.filter((p) => {
  //   return p.properties.vid === props.vid
  // })
})

const handleZoomClick = (record: PointFeature, openDetail = false) => {
  handleFeatureDetail(record, openDetail)
  // setTimeout(() => {
  //   window.map.flyTo({
  //     center: record.geometry.coordinates as LngLatLike,
  //     zoom: 12,
  //   })
  // })
}
</script>

<template>
  <a-list>
    <a-list-item v-for="item in pointList" :key="item.properties.id">
      <div :class="{ 'text-red sepia': item.properties.id === currentProperties!.id }">
        {{ item.properties.date }} {{ item.properties.time }} {{ item.properties.name }}
      </div>
      <div>
        视频切片 <span class="text-red-5">{{ item.properties.vt }}s</span>
      </div>
      <template #actions>
        <a-button size="mini" status="warning" shape="circle" @click="handleZoomClick(item, true)">
          <icon-edit />
        </a-button>
        <a-button size="mini" status="success" shape="circle" @click="handleZoomClick(item)">
          <icon-zoom-in />
        </a-button>
      </template>
    </a-list-item>
  </a-list>
</template>
