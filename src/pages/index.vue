<script setup lang="ts">
import { collapsed, mapContainerWidth } from '~/composables'

const mapContainer = ref()

const { width } = useElementBounding(mapContainer)

watchDebounced(() => width.value, () => {
  mapContainerWidth.value = width.value
}, { debounce: 300, maxWait: 600 })
</script>

<template>
  <div class="ui-container grow flex-shrink-0 flex flex-col md:flex-row w-full relative overflow-x-hidden h-full">
    <MapComp ref="mapContainer" class="map grow shrink-0 top-0 bottom-0 left-0 basis-0 transition-all duration-300 mapboxgl-map mode-simple_select mouse-drag" :class="{ 'basis-0': collapsed, 'basis-full': !collapsed }" />
    <Side class="right flex flex-col overflow-x-hidden bottom-0 top-0 right-0 box-border relative grow-0 shrink-0 w-full md:w-2/5 md:max-w-md h-2/5 md:h-auto" />
  </div>
</template>

<style lang="css" scoped>
.mapboxgl-map {
  font: 12px/20px Helvetica Neue,Arial,Helvetica,sans-serif;
  overflow: hidden;
  position: relative;
  -webkit-tap-highlight-color: rgb(0 0 0/0);
}
</style>
