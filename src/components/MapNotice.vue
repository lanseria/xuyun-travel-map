<script lang="ts" setup>
import { lastestVideoInfo, useMobile } from '~/composables'

const { isMobile } = useMobile()
</script>

<template>
  <div class="bg-white">
    <ASpace v-if="!isMobile" class="p-2">
      <a-tag color="red">
        New
      </a-tag>
      <a-tag color="blue">
        {{ lastestVideoInfo?.vDate }}视频更新
      </a-tag>
      <a-tag color="green">
        增加{{ lastestVideoInfo?.vDistanceKm }}公里
      </a-tag>
      <a-link :href="`https://www.bilibili.com/video/${lastestVideoInfo?.vid}`" target="_blank">
        <template #icon>
          <icon-live-broadcast />
        </template>
        {{ lastestVideoInfo?.vName }}
      </a-link>
    </ASpace>

    <ASpace v-else>
      <div class="w-screen">
        <ASpace class="p-2" direction="vertical">
          <ASpace>
            <a-tag color="red">
              New
            </a-tag>
            <a-tag color="blue">
              {{ lastestVideoInfo?.vDate }}视频更新
            </a-tag>
            <a-tag color="green">
              增加{{ lastestVideoInfo?.vDistanceKm }}公里
            </a-tag>
          </ASpace>
          <a-link :href="`https://www.bilibili.com/video/${lastestVideoInfo?.vid}`" target="_blank">
            <template #icon>
              <icon-live-broadcast />
            </template>
            {{ lastestVideoInfo?.vName }}
          </a-link>
        </ASpace>
      </div>
    </ASpace>
  </div>
</template>
