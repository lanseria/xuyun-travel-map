<script lang="ts" setup>
import type { TableExpandable, TableSortable } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { IconCheck, IconRefresh } from '@arco-design/web-vue/es/icon'
// import type { VideoData } from '~/composables'
import * as turf from '@turf/turf'
import type { VideoData } from '~/composables'
import { mapVideos } from '~/composables'

const columns = [
  {
    title: '发布时间',
    dataIndex: 'vDate',
    width: 115,
    sortable: {
      sortDirections: ['ascend', 'descend'],
    } satisfies TableSortable,
  },
  {
    title: '视频名称',
    slotName: 'vName',
  },
  {
    title: '路程',
    slotName: 'vDistanceKm',
    width: 80,
  },
]
const expandable = reactive<TableExpandable>({
  title: '点',
  width: 30,
})
const { isMobile } = useMobile()
const scroll = computed(() => {
  return {
    x: '100%',
    y: isMobile.value ? '300px' : 'calc(100vh - 50px)',
  }
})
const rowClass = (record: any) => {
  if (currentProperties.value) {
    // console.log(record.key === currentProperties.value.vid)
    return record.key === currentProperties.value.vid ? 'sepia' : ''
  }
  else { return '' }
}

const handleViewLine = (record: VideoData) => {
  // if (record.vLine)
  //   console.log(record.vLine)

  const vPoints = mapPlacePoints.value.filter(item => item.properties.vid === record.vid)
  if (vPoints.length)
    handleFeatureDetail(vPoints[0], false, false)

  if (record.vLine) {
    const b = turf.bbox(record.vLine)
    // console.log(b)
    fitBbox(b as any)
  }
}

const handleCopy = (record: VideoData) => {
  //
  // console.log(record.vDate)
  const { data, onFetchResponse } = useFetch(`https://raw.githubusercontent.com/lanseria/xuyun-map-data/main/${currentRouteValue.value}/raw/${record.vDate}.json`, { immediate: true }).get().json()
  const messageIns = Message.info({
    content: '加载中',
    icon: () => h(IconRefresh, { spin: true }),
  })
  onFetchResponse(() => {
    // console.log(data.value)
    editForm.value = data.value
    handleNewVideo()
    messageIns.close()
    Message.success({
      content: '加载成功',
      icon: () => h(IconCheck),
    })
    if (record.vLine) {
      const b = turf.bbox(record.vLine)
      // console.log(b)
      fitBbox(b as any)
    }
  })
  //
}
</script>

<template>
  <div>
    <a-table :columns="columns" :data="mapVideos" row-key="vid" :pagination="false" :scroll="scroll" :expandable="expandable" :row-class="rowClass">
      <template #vName="{ record }">
        <a-link :href="`https://www.bilibili.com/video/${record.vid}`" target="_blank">
          <template #icon>
            <icon-live-broadcast />
          </template>
          {{ record.vName }}
        </a-link>
      </template>
      <template #vDistanceKm="{ record }">
        <div class="cursor-pointer text-cyan-5 underline" @click="handleViewLine(record)">
          {{ record.vDistanceKm }}Km
        </div>
        <a-button type="text" status="success" size="mini" @click="handleCopy(record)">
          <template #icon>
            <icon-copy />
          </template>
        </a-button>
      </template>
      <template #expand-row="{ record }">
        <DataPointList :vid="record.vid" />
      </template>
    </a-table>
  </div>
</template>
