<script lang="ts" setup>
import type { TableExpandable } from '@arco-design/web-vue'
// import type { VideoData } from '~/composables'
import { mapVideos } from '~/composables'

const columns = [
  {
    title: '发布时间',
    dataIndex: 'vDate',
    width: 115,
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
        {{ record.vDistanceKm }}Km
      </template>
      <template #expand-row="{ record }">
        <DataPointList :vid="record.vid" />
      </template>
    </a-table>
  </div>
</template>
