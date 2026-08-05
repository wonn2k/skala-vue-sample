<script setup>
/**
 * MapLibre GL의 globe 스타일을 Vue 생명주기에 맞춰 생성·정리하는 지도 UI 컴포넌트입니다.
 * 사용자가 지도를 클릭하면 마커를 이동하고 위도/경도를 select-location 이벤트로 부모에 전달합니다.
 * 날씨나 장소 조회는 수행하지 않아 지도 표현과 비즈니스 로직의 결합을 피합니다.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// MapLibre 6 worker를 Vite 정적 자산으로 출력해 배포 환경에서도 올바른 MIME 타입으로 로드한다.
maplibregl.setWorkerUrl(maplibreWorkerUrl)

const emit = defineEmits(['select-location'])

const mapContainer = ref(null)
// MapLibre 인스턴스는 DOM 기반 외부 객체이므로 Vue의 깊은 반응형 상태로 만들지 않습니다.
let map = null
let selectedMarker = null

// MapLibre 클릭 이벤트의 lngLat을 검증한 뒤 앱 공통 좌표 객체로 변환합니다.
const selectPoint = ({ lngLat }) => {
  const latitude = Number(lngLat?.lat)
  const longitude = Number(lngLat?.lng)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

  selectedMarker ??= new maplibregl.Marker({ color: '#38bdf8' })
  selectedMarker.setLngLat([longitude, latitude]).addTo(map)
  emit('select-location', { latitude, longitude })
}

// 실제 컨테이너 DOM이 준비된 뒤 지도와 확대/회전 컨트롤을 초기화합니다.
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

// 라우트 이동 시 이벤트, 마커, WebGL 지도 자원을 명시적으로 해제합니다.
onBeforeUnmount(() => {
  map?.off('click', selectPoint)
  selectedMarker?.remove()
  map?.remove()
})
</script>

<template>
  <!-- 지도 컨테이너 위에 조작 방법을 안내하는 고정 오버레이를 겹칩니다. -->
  <div class="globe-shell">
    <div ref="mapContainer" class="globe-map" aria-label="위치를 선택할 수 있는 3D 지구본"></div>
    <div class="globe-guide">
      <span class="globe-guide__dot"></span>
      지구본을 드래그해 회전하고 원하는 지점을 클릭하세요
    </div>
  </div>
</template>

<style scoped>
/* WebGL 지도가 채울 고정 높이의 어두운 지구본 프레임 */
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

/* 지도 이동을 방해하지 않으면서 하단 중앙에 떠 있는 사용 안내 */
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

/* MapLibre가 내부 생성한 컨트롤에도 페이지 디자인을 적용합니다. */
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
