import axios from 'axios'

/**
 * 브라우저가 Gemini를 직접 호출하지 않고 같은 출처의 서버리스 API를 호출하는 경계 모듈입니다.
 * 실제 GEMINI_API_KEY는 서버에만 보관되며, signal을 받아 위치 변경/화면 이탈 시 요청을 취소합니다.
 * @returns 서버 응답에서 UI가 사용하는 recommendation 객체만 추출해 반환합니다.
 */
export async function requestTravelRecommendations(locationContext, signal) {
  const { data } = await axios.post('/api/generate-travel-recommendations', locationContext, {
    signal,
  })

  if (!data?.recommendation) throw new Error('생성된 여행 추천이 없습니다.')

  return data.recommendation
}
