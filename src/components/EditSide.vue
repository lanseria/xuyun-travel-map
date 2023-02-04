<script lang="ts" setup>
interface TabItem {
  label: string
  icon: string
  value: string
}
const videoActiveTab = ref('detail')
const tabList: TabItem[] = [
  {
    label: '视频要素',
    icon: 'i-carbon:edit',
    value: 'detail',
  },
  {
    label: '视频数据',
    icon: 'i-carbon:data-table',
    value: 'data',
  },
]
const handleActive = (item: TabItem) => {
  videoActiveTab.value = item.value
}
</script>

<template>
  <div class="flex flex-col overflow-x-hidden box-border relative bg-white">
    <div class="top border-b border-solid border-light-6 dark:border-gray-6">
      <div class="buttons flex">
        <div class="shrink flex justify-center items-center cursor-pointer w-40px hover:bg-gray-2 border-dashed border-r" @click="handleCollapsedFalse()">
          <icon-close />
        </div>
        <div v-for="item in tabList" :key="item.value" class="grow flex justify-center items-center" :class="{ 'bg-sky-5 text-white': videoActiveTab === item.value, 'cursor-pointer hover:bg-gray-2': videoActiveTab !== item.value }" :title="item.label" @click="handleActive(item)">
          <div class="inline-block" :class="item.icon" /><span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div class="shrink-0 p-5">
      <VideoEdit v-show="videoActiveTab === 'detail'" />
      <VideoData v-show="videoActiveTab === 'data'" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.top .buttons button {
  padding: 10px 15px;
  font-weight: normal;
  height: 40px;
  border: 0;
  vertical-align: top;
}
.buttons{
  height: 40px;
}
</style>
