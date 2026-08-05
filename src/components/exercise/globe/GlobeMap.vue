<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// MapLibre 6 worker를 Vite 정적 자산으로 출력해 배포 환경에서도 올바른 MIME 타입으로 로드한다.
maplibregl.setWorkerUrl(maplibreWorkerUrl)

const emit = defineEmits(['select-location'])

const mapContainer = ref(null)
let map = null
let selectedMarker = null

const selectPoint = ({ lngLat }) => {
  const latitude = Number(lngLat?.lat)
  const longitude = Number(lngLat?.lng)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

  selectedMarker ??= new maplibregl.Marker({ color: '#38bdf8' })
  selectedMarker.setLngLat([longitude, latitude]).addTo(map)
  emit('select-location', { latitude, longitude })
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://demotiles.maplibre.org/globe.json',
    center: [127.5, 36.2],
    zoom: 1.55,
    minZoom: 0.75,
    maxZoom: 10,
    attributionControl: true,
  })

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
  map.on('click', selectPoint)
})

onBeforeUnmount(() => {
  map?.off('click', selectPoint)
  selectedMarker?.remove()
  map?.remove()
})
</script>

<template>
  <div class="globe-shell">
    <div ref="mapContainer" class="globe-map" aria-label="위치를 선택할 수 있는 3D 지구본"></div>
    <div class="globe-guide">
      <span class="globe-guide__dot"></span>
      지구본을 드래그해 회전하고 원하는 지점을 클릭하세요
    </div>
  </div>
</template>

<style scoped>
.globe-shell {
  position: relative;
  min-height: 610px;
  overflow: hidden;
  border: 1px solid #1e3a5f;
  border-radius: 24px;
  background: #061526;
  box-shadow: 0 24px 60px rgb(2 12 27 / 28%);
}

.globe-map {
  position: absolute;
  inset: 0;
}

.globe-guide {
  position: absolute;
  z-index: 1;
  bottom: 18px;
  left: 50%;
  display: flex;
  align-items: center;
  width: max-content;
  max-width: calc(100% - 32px);
  padding: 10px 14px;
  border: 1px solid rgb(148 210 255 / 25%);
  border-radius: 999px;
  background: rgb(3 16 31 / 80%);
  color: #d9efff;
  font-size: 12px;
  backdrop-filter: blur(12px);
  transform: translateX(-50%);
}

.globe-guide__dot {
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 0 5px rgb(56 189 248 / 15%);
}

:deep(.maplibregl-ctrl-group) {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 12px;
}

@media (max-width: 900px) {
  .globe-shell {
    min-height: 480px;
  }
}
</style>
