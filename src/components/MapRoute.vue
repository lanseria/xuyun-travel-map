<script lang="ts" setup>
import type { RouteVideoJsonItem } from '~/composables'
import { allRouteList, currentRouteValue } from '~/composables'

function handleCheck(item: RouteVideoJsonItem) {
  // currentRouteValue.value = item.value
}
</script>

<template>
  <ASpace class="py-2 px-4 mb-2">
    <a-tag v-for="item in allRouteList" :key="item.sid" :checked="item.value === currentRouteValue" checkable color="arcoblue" @check="handleCheck(item)">
      {{ item.name }}
    </a-tag>
  </ASpace>
</template>
