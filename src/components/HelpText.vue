<script lang="ts" setup></script>

<template>
  <a-typography class="p-5" :style="{ marginTop: '-40px' }">
    <a-typography-title>
      Help
    </a-typography-title>
    <a-typography-paragraph>
      <a-typography-text mark>
        《徐云流浪中国地图》
      </a-typography-text>是一款可视化 B 站 Up主 徐云行走轨迹的网页地图应用，帮助广大网友或粉丝回忆瞬间。
    </a-typography-paragraph>
    <a-typography-paragraph>
      <a-typography-text>
        本网站应用采用 <a-typography-text mark>
          Mapbox
        </a-typography-text> 技术且个人开发，如果出现 bug 或者其他问题，可以到 github 上提出问题。
      </a-typography-text>
    </a-typography-paragraph>
    <a-typography-title :heading="2">
      资源
    </a-typography-title>
    <a-typography-paragraph>
      如果你也有空闲时间，同时了解这些开源数据，很感谢能在下面网站中提供这些数据
    </a-typography-paragraph>

    <a-typography-paragraph>
      <ul>
        <li>
          <a-link href="https://github.com/lanseria/xuyun-map-data" target="_blank">
            数据来源 lanseria/xuyun-map-data
          </a-link>
        </li>
        <li>
          <a-link href="https://github.com/lanseria/xuyun-travel-map" target="_blank">
            网站开源自 lanseria/xuyun-travel-map
          </a-link>
        </li>
      </ul>
    </a-typography-paragraph>
  </a-typography>
</template>
