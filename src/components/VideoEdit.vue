<script lang="ts" setup>
import dayjs from 'dayjs'
import queryString from 'query-string'
import { editForm, isGetCoord, vClipIdx } from '~/composables'
const handleAdd = () => {
  const center = window.map.getCenter()
  const coord: [number, number] = [center.lng, center.lat]
  if (editForm.value.vClips.length) {
    editForm.value.vClips.push({
      ...editForm.value.vClips[editForm.value.vClips.length - 1],
    })
  }
  else {
    editForm.value.vClips.push({
      coordinates: coord,
      name: '标题',
      type: 'bicycle',
      date: dayjs().format('YYYY-MM-DD'),
      time: dayjs().format('HH:mm:ss'),
      vTime: 0,
    })
  }
}
const handleDel = (item: any) => {
  editForm.value.vClips = editForm.value.vClips.filter(m => m.name !== item.name)
}
const handleGetCoord = (idx: number) => {
  vClipIdx.value = idx
  isGetCoord.value = true
}
const handleSearchRoute = () => {
  if (editForm.value.vClips.length > 1) {
    const point = editForm.value.vClips.map((it) => {
      const coord = [...it.coordinates]
      return coord.reverse().join()
    })
    const pointObj = {
      point,
    }
    const paramsStr = queryString.stringify(pointObj)
    // console.log(paramsStr)
    const url = `https://graphhopper.com/maps/?${paramsStr}&profile=mtb&layer=OpenStreetMap`
    open(url)
  }
}
const handleFly = (lnglat: any) => {
  window.map.flyTo({
    center: lnglat,
  })
}
const handleClearGetCoord = () => {
  isGetCoord.value = false
}
</script>

<template>
  <a-form :model="editForm" layout="vertical">
    <a-form-item field="vid" label="vid">
      <a-input
        v-model="editForm.vid"
      />
    </a-form-item>

    <a-form-item field="vName" label="vName">
      <ATextarea
        v-model="editForm.vName"
      />
    </a-form-item>

    <a-form-item field="vDate" label="vDate">
      <a-input
        v-model="editForm.vDate"
      />
    </a-form-item>

    <a-form-item field="vDistanceKm" label="vDistanceKm">
      <a-input-number
        v-model="editForm.vDistanceKm"
      />
    </a-form-item>
    <ASpace direction="horizontal">
      <a-button type="primary" @click="handleAdd">
        <template #icon>
          <icon-plus />
        </template>
        添加片段
      </a-button>

      <a-button type="primary" status="success" @click="handleSearchRoute">
        <template #icon>
          <icon-search />
        </template>
        查询路线与距离
      </a-button>
      <a-button type="primary" status="danger" @click="handleClearGetCoord">
        <template #icon>
          <IconClose />
        </template>
        清除点选状态
      </a-button>
    </ASpace>
    <a-card v-for="(item, idx) in editForm.vClips" :key="idx" class="mt-5" hoverable>
      <template #title>
        <AInput v-model="item.name" />
      </template>
      <template #extra>
        <a-button type="text" status="danger" @click="handleDel(item)">
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </template>
      <div class="div-form-item">
        类型：
        <a-switch v-model="item.type" checked-value="bicycle" unchecked-value="campsite">
          <template #checked>
            Bicycle
          </template>
          <template #unchecked>
            Campsite
          </template>
        </a-switch>
      </div>
      <div class="div-form-item">
        位置：
        <a-button size="mini" status="success" @click="handleFly(item.coordinates)">
          <template #icon>
            <icon-arrow-up />
          </template>
        </a-button>
        <a-button size="mini" status="success" :type="isGetCoord ? 'outline' : 'text'" @click="handleGetCoord(idx)">
          <template #icon>
            <icon-pushpin />
          </template>
        </a-button>
        {{ item.coordinates }}
      </div>
      <div class="div-form-item">
        日期：<a-date-picker v-model="item.date" value-format="YYYY-MM-DD" />
      </div>
      <div class="div-form-item">
        时间：<a-time-picker v-model="item.time" format="HH:mm:ss" />
      </div>
      <div class="div-form-item">
        切片：<a-input-number v-model="item.vTime" class="w-220px" />
      </div>
    </a-card>
  </a-form>
</template>

<style lang="css" scoped>
.div-form-item {
  @apply flex items-center mb-4;
}
</style>
