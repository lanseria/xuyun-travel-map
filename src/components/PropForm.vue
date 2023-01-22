<script lang="ts" setup>
import { currentProperties } from '~/composables/store'
const isShowForm = computed(() => {
  return currentProperties.value !== null
})
const handleUpdate = () => {
}

const handleDelete = () => {
  //
}
</script>

<template>
  <div class="p-5">
    <a-form v-if="isShowForm" :model="currentProperties" layout="vertical">
      <!-- <a-form-item field="type" label="要素类型">
        <a-input disabled :model-value="TypeEnumMap[currentProperties.type as TypeEnum]" />
      </a-form-item> -->
      <a-form-item field="name" label="描述">
        <a-textarea
          v-model="currentProperties.name" :auto-size="{
            minRows: 2,
            maxRows: 5,
          }"
        />
      </a-form-item>

      <a-form-item field="icon" label="图标类型">
        <a-radio-group v-model="currentProperties.icon">
          <a-radio value="campsite">
            驻扎
          </a-radio>
          <a-radio value="bicycle">
            行走
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="date" label="日期">
        <a-date-picker v-model="currentProperties.date" value-format="YYYY-MM-DD" />
      </a-form-item>

      <a-form-item field="date" label="时间">
        <a-time-picker v-model="currentProperties.time" format="HH:mm:ss" />
      </a-form-item>
      <a-form-item field="url" label="视频">
        <div class="flex flex-col w-full">
          <iframe class="w-full h-250px" :src="`//player.bilibili.com/player.html?bvid=${currentProperties.vid}&t=${currentProperties.vt}`" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" />
          <div>
            B站链接：
            <a-link :href="`https://www.bilibili.com/video/${currentProperties.vid}/?t=${currentProperties.vt}`">
              {{ currentProperties.vid }}
            </a-link>
          </div>
        </div>
      </a-form-item>

      <a-form-item>
        <ASpace>
          <a-button type="primary" @click="handleUpdate()">
            编辑数据
          </a-button>
          <a-button status="danger" @click="handleDelete()">
            移除
          </a-button>
        </ASpace>
      </a-form-item>
    </a-form>
    <div v-else>
      请选择元素
    </div>
  </div>
</template>
