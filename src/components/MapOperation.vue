<script lang="ts" setup>
import { reloadInitStatus } from '~/composables'
</script>

<template>
  <ASpace>
    <div class="bg-white rounded-1/2 w-50px h-50px flex justify-center items-center cursor-pointer" @click="reloadInitStatus">
      <icon-reply :size="40" />
    </div>
    <div class="bg-white rounded-1/2 w-50px h-50px flex justify-center items-center cursor-pointer" @click="toggleAnimation">
      <icon-play-arrow-fill v-if="!isAnimation" :size="40" />
      <icon-pause-circle-fill v-else :size="40" />
    </div>
  </ASpace>
</template>
