<script lang="ts" setup>
import { editForm } from '~/composables'

const editFormStr = computed(() => {
  return JSON.stringify(editForm.value, null, 2)
})
</script>

<template>
  <div>
    <div>视频数据</div>
    <ATextarea :model-value="editFormStr" auto-size />
  </div>
</template>
