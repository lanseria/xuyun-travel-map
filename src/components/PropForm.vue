<script lang="ts" setup>
import type { LngLatLike } from 'mapbox-gl'
import type { PointFeature } from '~/composables'
import { currentProperties, mapDistanceEndInput, mapDistanceStartInput } from '~/composables/store'

const handleGeojsonUpdate = () => {
  if (currentFeature.value) {
    const data: PointFeature = {
      properties: currentFeature.value.properties,
      type: currentFeature.value.type,
      geometry: currentFeature.value.geometry,
    }
    const json = JSON.stringify(data)
    const url = `http://geojson.io/#data=data:application/json,${encodeURIComponent(json)}`
    open((url))
  }
}

const handleUpdate = () => {
  if (currentProperties.value) {
    const url = `https://github.com/lanseria/xuyun-map-data/blob/main/2212-2303-dongbei/raw/${currentProperties.value.vDate}.json`
    open(url)
  }
}

const handleCalcDistance = () => {
  if (mapDistanceStartInput.value && mapDistanceEndInput.value) {
    const startPosition = JSON.parse(mapDistanceStartInput.value).reverse().join(',')
    const endPosition = JSON.parse(mapDistanceEndInput.value).reverse().join(',')
    const startEndPos = `point=${encodeURIComponent(startPosition)}&point=${encodeURIComponent(endPosition)}&profile=mtb&layer=OpenStreetMap`
    // https://graphhopper.com/maps/?point=41.885208%2C126.709205&point=42.826936%2C125.940162&profile=mtb&layer=OpenStreetMap
    const url = `https://graphhopper.com/maps/?${startEndPos}`
    open(url)
  }
}
const visible = ref(false)

const handleVideoModalPlay = () => {
  visible.value = true
}

const pointIdx = computed(() => {
  if (currentProperties.value)
    return mapPlacePoints.value.findIndex(item => item.properties.id === currentProperties.value!.id)
  else
    return -1
})

const handlePosition = () => {
  if (currentFeature.value) {
    window.map.flyTo({
      center: currentFeature.value.geometry.coordinates as LngLatLike,
      zoom: 15,
      speed: 2,
      curve: 1,
    })
  }
}

const handlePreviousPosition = () => {
  //
  const nextId = pointIdx.value - 1
  if (nextId >= 0)
    handleFeatureDetail({ ...mapPlacePoints.value[nextId] })
}

const handleNextPosition = () => {
  //
  const nextId = pointIdx.value + 1
  if (nextId >= 0)
    handleFeatureDetail({ ...mapPlacePoints.value[nextId] })
}
</script>

<template>
  <div class="p-5">
    <a-form v-if="currentProperties" :model="currentProperties" layout="vertical">
      <!-- <a-form-item field="type" label="????????????">
        <a-input disabled :model-value="TypeEnumMap[currentProperties.type as TypeEnum]" />
      </a-form-item> -->
      <a-form-item field="name" label="??????">
        <a-textarea
          v-model="currentProperties.name" :auto-size="{
            minRows: 2,
            maxRows: 5,
          }"
        />
      </a-form-item>

      <a-form-item field="type" label="????????????">
        <a-radio-group v-model="currentProperties.type">
          <a-radio value="campsite">
            ??????
          </a-radio>
          <a-radio value="bicycle">
            ??????
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="date" label="??????">
        <a-date-picker v-model="currentProperties.date" value-format="YYYY-MM-DD" />
      </a-form-item>

      <a-form-item field="date" label="??????">
        <a-time-picker v-model="currentProperties.time" format="HH:mm:ss" />
      </a-form-item>
      <a-form-item field="url" label="??????">
        <div class="flex flex-col w-full">
          <!-- <iframe v-if="activeTab === 'detail' && collapsed" class="w-full h-250px" :src="`//player.bilibili.com/player.html?bvid=${currentProperties.vid}&t=${currentProperties.vt}&as_wide=1&high_quality=1`" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" /> -->
          <div>
            <div>
              <a-link :href="`https://www.bilibili.com/video/${currentProperties.vid}/?t=${currentProperties.vt}`" target="_blank">
                {{ currentProperties.vName }}
              </a-link>
            </div>
            <ASpace>
              <a-button :disabled="pointIdx - 1 === -1" @click="handlePreviousPosition">
                <template #icon>
                  <icon-skip-previous-fill />
                </template>
              </a-button>
              <a-button @click="handleVideoModalPlay">
                <template #icon>
                  <icon-play-arrow-fill />
                </template>
                ????????????
              </a-button>
              <a-button @click="handlePosition">
                <template #icon>
                  <icon-location />
                </template>
                ??????
              </a-button>
              <a-button @click="handleNextPosition">
                <template #icon>
                  <icon-skip-next-fill />
                </template>
              </a-button>
            </ASpace>
            <a-modal v-model:visible="visible" :width="720" draggable :footer="false">
              <template #title>
                ????????????
              </template>
              <iframe v-if="visible" class="w-full h-500px" :src="`//player.bilibili.com/player.html?bvid=${currentProperties.vid}&t=${currentProperties.vt}&as_wide=1&high_quality=1`" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" />
            </a-modal>
          </div>
        </div>
      </a-form-item>
      <ADivider />
      <a-form-item label="????????????">
        <ASpace>
          <a-button type="primary" @click="handleGeojsonUpdate()">
            geojson.io ???????????????
          </a-button>
          <a-button @click="handleUpdate()">
            Github ???????????????
          </a-button>
        </ASpace>
      </a-form-item>
      <a-form-item label="????????????">
        <ASpace direction="vertical">
          <ASpace>
            <ASpace direction="vertical">
              <a-button status="success" @click="handleSetStartPoint()">
                <template #icon>
                  <icon-location />
                </template>
                ????????????
              </a-button>
              <a-textarea v-model="mapDistanceStartInput" placeholder="?????????????????????????????????????????????" allow-clear />
            </ASpace>
            <ASpace direction="vertical">
              <a-button status="danger" @click="handleSetEndPoint()">
                <template #icon>
                  <icon-location />
                </template>
                ????????????
              </a-button>
              <a-textarea v-model="mapDistanceEndInput" placeholder="?????????????????????????????????????????????" allow-clear />
            </ASpace>
          </ASpace>
          <a-button type="primary" @click="handleCalcDistance()">
            ????????????
          </a-button>
        </ASpace>
      </a-form-item>
    </a-form>
    <div v-else>
      ???????????????
    </div>
  </div>
</template>
