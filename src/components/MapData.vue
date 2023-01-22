<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { mapStartPlacePoint } from '~/composables'
dayjs.extend(relativeTime)

const alreadyKm = 341 + 79 + 62 + 27 + 136 + 120 + 186 + 110
const restKm = 1480

const alreadyDayCount = computed(() => {
  const date = dayjs(mapStartPlacePoint.value?.properties!.date)
  return dayjs().diff(date, 'day') // 7
})
const avgKm = computed(() => {
  return alreadyKm / alreadyDayCount.value
})
const restDayCount = computed(() => {
  return restKm / avgKm.value
})

const arriveDate = computed(() => {
  return dayjs().add(restDayCount.value, 'day').toDate()
})
</script>

<template>
  <div class="px-4 py-2">
    <a-space size="large">
      <a-statistic title="已骑行" :value="alreadyDayCount" show-group-separator>
        <template #suffix>
          天
        </template>
      </a-statistic>
      <a-statistic extra="已骑行距离" :value="alreadyKm" :precision="2">
        <template #suffix>
          Km
        </template>
      </a-statistic>
      <a-statistic extra="平均每日骑行" :value="avgKm" :precision="2">
        <template #suffix>
          Km
        </template>
      </a-statistic>

      <a-statistic extra="预计剩余" :value="restKm" :precision="2">
        <template #suffix>
          Km
        </template>
      </a-statistic>

      <a-statistic title="预计剩余" :value="restDayCount">
        <template #suffix>
          天
        </template>
      </a-statistic>

      <a-statistic title="预计到达日期" :value="arriveDate" format="YYYY-MM-DD">
        <template #suffix />
      </a-statistic>
    </a-space>
  </div>
</template>
