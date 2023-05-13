<script lang="ts" setup>
import { editForm, initEditFormData } from '~/composables'

const editFormStr = computed(() => {
  return JSON.stringify(editForm.value, null, 2)
})
function handleOk() {
  editForm.value = initEditFormData()
}
</script>

<template>
  <div>
    <div class="flex items-center">
      视频数据
      <a-popconfirm content="你确认初始化数据?" @ok="handleOk">
        <AButton>初始化数据</AButton>
      </a-popconfirm>
    </div>
    <ATextarea :model-value="editFormStr" auto-size />
  </div>
</template>
