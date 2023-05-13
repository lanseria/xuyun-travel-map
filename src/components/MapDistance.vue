<script lang="ts" setup>
import type { SelectOptionData } from '@arco-design/web-vue'

const data = ref<SelectOptionData[]>([])
function handleSearch(value: string) {
  if (value) {
    data.value = mapPlacePoints.value.filter((item) => {
      return item.properties && item.properties.name.match(value)
    }).map((item) => {
      return {
        // TODO:
        value: item.geometry.coordinates.toString(),
        label: item.properties!.name,
      }
    })
  }
  else { data.value = [] }
}

function handleSelectStart() {
  //
}

function handleSelectEnd() {
  //
}
</script>

<template>
  <div class="pr-5 py-5">
    <div>
      <icon-location class="text-green text-lg w-40px" />
      <a-auto-complete :data="data" :style="{ width: '320px' }" placeholder="请选择起点" allow-clear @search="handleSearch" @select="handleSelectStart" />
    </div>
    <div>
      <icon-location class="text-red text-lg w-40px" />
      <a-auto-complete :data="data" :style="{ width: '320px' }" placeholder="请选择终点" allow-clear @search="handleSearch" @select="handleSelectEnd" />
    </div>
  </div>
</template>
