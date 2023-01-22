<script setup lang="ts">
import { collapsed } from '~/composables'
</script>

<template>
  <div class="h-full grow flex-shrink-0 flex flex-row w-full relative overflow-x-hidden">
    <MapComp class="grow shrink-0 top-0 bottom-0 left-0 basis-0 transition-all duration-300" :class="{ 'basis-0': collapsed, 'basis-full': !collapsed }" />
    <Side class="right bottom-0 top-0 right-0 grow-0 shrink-0 w-2/5 max-w-md h-full" />
  </div>
</template>
