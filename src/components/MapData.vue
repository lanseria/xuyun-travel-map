<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { mapStartPlacePoint, useMobile } from '~/composables'

dayjs.extend(relativeTime)

const alreadyKm = computed(() => {
  return mapVideos.value.map(item => item.vDistanceKm).reduce((x, y) => x + y, 0)
})

const allKm = computed(() => {
  return 1050 + 1448.60 + 54.7 + 3.1
})

const restKm = computed(() => {
  return allKm.value - alreadyKm.value
})

const startDay = computed(() => {
  return dayjs(mapStartPlacePoint.value?.properties!.date)
})

const alreadyDayCount = computed(() => {
  // return dayjs().diff(startDay.value, 'day') // 7
  return 84
})
const avgKm = computed(() => {
  return alreadyKm.value / alreadyDayCount.value
})
const restDayCount = computed(() => {
  return restKm.value / avgKm.value
})

const arriveDate = computed(() => {
  // return dayjs().add(restDayCount.value, 'day').toDate()
  return '2023-03-03'
})
const { isMobile } = useMobile()
</script>

<template>
  <div>
    <a-space v-if="!isMobile" size="large" class="px-4 py-2">
      <a-statistic title="开始日期" :value="startDay.toDate()" format="YYYY-MM-DD">
        <template #suffix />
      </a-statistic>

      <a-statistic title="共骑行" :value="alreadyDayCount" show-group-separator>
        <template #suffix>
          天
        </template>
      </a-statistic>
      <a-statistic extra="已骑行距离" :value="alreadyKm" :precision="2" :value-style="{ color: '#0fbf60' }">
        <template #prefix>
          <icon-arrow-rise />
        </template>
        <template #suffix>
          Km
        </template>
      </a-statistic>
      <a-statistic extra="平均每日骑行" :value="avgKm" :precision="2">
        <template #suffix>
          Km
        </template>
      </a-statistic>

      <a-statistic extra="剩余" :value="restKm" :precision="2">
        <template #suffix>
          Km
        </template>
      </a-statistic>

      <a-statistic title="剩余" :value="restDayCount">
        <template #suffix>
          天
        </template>
      </a-statistic>

      <a-statistic title="到达日期" :value="arriveDate" format="YYYY-MM-DD">
        <template #suffix />
      </a-statistic>
    </a-space>
    <div v-else class="px-4 py-2">
      <ASpace>
        <div>已骑行距离 <span class="text-blue">{{ alreadyDayCount }}</span> 天</div>
        <div>已骑行 <span class="text-green">{{ alreadyKm.toFixed(2) }}</span> Km</div>
        <div>平均每日骑行 <span class="text-green">{{ avgKm.toFixed(2) }}</span> Km</div>
      </ASpace>
      <ASpace>
        <div>预计剩余 <span class="text-red">{{ restKm.toFixed(2) }}</span> Km</div>
        <div>预计剩余 <span class="text-red">{{ restDayCount.toFixed(0) }}</span> 天</div>
        <div>预计到达日期 {{ dayjs(arriveDate).format('YYYY-MM-DD') }}</div>
      </ASpace>
    </div>
  </div>
</template>
