<script lang="ts" setup>
import { handleFeatureDetail } from '~/composables'

const columns = [
  {
    title: '描述',
    dataIndex: 'properties.name',
  },
  {
    title: '要素类型',
    dataIndex: 'properties.icon',
    width: 95,
  },
  {
    title: '日期',
    dataIndex: 'properties.date',
    width: 120,
  },
  {
    title: '时间',
    dataIndex: 'properties.time',
    width: 110,
  },
]
const data = computed(() => {
  if (mapPlacePoints.value.length === 0)
    return []
  return mapPlacePoints.value
})

const handleRowClick = (record: any) => {
  const map = window.map
  handleFeatureDetail(record, false)
  setTimeout(() => {
    map.flyTo({
      center: record.geometry.coordinates,
      zoom: 12,
    })
  })
}
</script>

<template>
  <div>
    <a-table :columns="columns" :data="data" :pagination="false" @row-click="handleRowClick" />
  </div>
</template>
