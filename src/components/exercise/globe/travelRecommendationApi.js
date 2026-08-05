import axios from 'axios'

export async function requestTravelRecommendations(locationContext, signal) {
  const { data } = await axios.post('/api/generate-travel-recommendations', locationContext, {
    signal,
  })

  if (!data?.recommendation) throw new Error('생성된 여행 추천이 없습니다.')

  return data.recommendation
}
