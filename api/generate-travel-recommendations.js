/* global process */

const GEMINI_API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models'
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10
const requestHistory = new Map()

export const config = { maxDuration: 30 }

const recommendationSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: '현재 날씨를 고려한 여행 추천 요약' },
    destinations: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '실제로 존재하는 관광지의 한국어 명칭' },
          reason: { type: 'string', description: '현재 날씨에 추천하는 이유' },
          type: { type: 'string', enum: ['실내', '실외', '실내·실외'] },
          weatherTip: { type: 'string', description: '방문 시 날씨 관련 주의사항' },
        },
        required: ['name', 'reason', 'type', 'weatherTip'],
        additionalProperties: false,
      },
    },
    outfit: {
      type: 'object',
      properties: {
        overview: { type: 'string', description: '추천 복장의 전체적인 방향' },
        items: {
          type: 'array',
          minItems: 3,
          maxItems: 6,
          items: { type: 'string' },
        },
        caution: { type: 'string', description: '기상 상황에 따른 복장 주의사항' },
      },
      required: ['overview', 'items', 'caution'],
      additionalProperties: false,
    },
  },
  required: ['summary', 'destinations', 'outfit'],
  additionalProperties: false,
}

const getClientAddress = (request) =>
  String(request.headers['x-forwarded-for'] ?? request.socket?.remoteAddress ?? 'unknown')
    .split(',')[0]
    .trim()

const isRateLimited = (clientAddress) => {
  const now = Date.now()
  const recentRequests = (requestHistory.get(clientAddress) ?? []).filter(
    (requestedAt) => now - requestedAt < RATE_LIMIT_WINDOW_MS,
  )

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) return true

  recentRequests.push(now)
  requestHistory.set(clientAddress, recentRequests)
  return false
}

const cleanText = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const parseBody = (body) => {
  if (typeof body !== 'string') return body ?? {}

  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

const sendRetryableError = (response, status, code, message, retryAfter) => {
  response.setHeader('Retry-After', String(retryAfter))
  return response.status(status).json({ code, message, retryAfter })
}

const formatNumber = (value, fallback = '정보 없음') =>
  Number.isFinite(value) ? String(Math.round(value * 10) / 10) : fallback

const buildPrompt = ({ country, location, weather, temperature, feelsLike, humidity, windSpeed }) =>
  [
    '당신은 현지 기상 상황을 고려하는 전문 여행 가이드입니다.',
    `선택 지역: ${location}, ${country}.`,
    `현재 날씨: ${weather}.`,
    `기온: ${formatNumber(temperature)}℃, 체감 온도: ${formatNumber(feelsLike)}℃, 습도: ${formatNumber(humidity)}%, 풍속: ${formatNumber(windSpeed)}m/s.`,
    '선택 지역 또는 접근 가능한 인근 지역에 실제로 존재하는 대표 관광지 3곳을 추천하세요.',
    '현재 날씨에 적합한 관광지를 우선하고 실내외 여부와 방문 시 날씨 팁을 포함하세요.',
    '관광객이 지금 입기 좋은 구체적인 복장과 준비물을 추천하세요.',
    '요약과 추천 이유는 각각 두 문장 이내, 날씨 팁과 복장 항목은 간결한 한 문장으로 작성하세요.',
    '확인할 수 없는 운영시간, 가격, 행사 일정은 만들어내지 마세요.',
    '모든 답변은 자연스러운 한국어로 작성하세요.',
  ].join(' ')

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ message: 'POST 요청만 지원합니다.' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(500).json({ message: '서버에 GEMINI_API_KEY가 설정되지 않았습니다.' })
  }

  if (isRateLimited(getClientAddress(request))) {
    return sendRetryableError(
      response,
      429,
      'REQUEST_LIMITED',
      '추천 요청 횟수가 많습니다. 잠시 후 다시 시도해 주세요.',
      600,
    )
  }

  const body = parseBody(request.body)
  const country = cleanText(body.country, 80)
  const location = cleanText(body.location, 120) || country
  const weather = cleanText(body.weather, 80) || '날씨 정보 없음'
  const temperature = Number(body.temperature)
  const feelsLike = Number(body.feelsLike)
  const humidity = Number(body.humidity)
  const windSpeed = Number(body.windSpeed)

  if (!country || !location || !Number.isFinite(temperature)) {
    return response.status(400).json({ message: '지역과 날씨 정보를 먼저 조회해 주세요.' })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

  try {
    const geminiResponse = await fetch(`${GEMINI_API_ROOT}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: buildPrompt({
                  country,
                  location,
                  weather,
                  temperature,
                  feelsLike,
                  humidity,
                  windSpeed,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: recommendationSchema,
          maxOutputTokens: 4096,
          thinkingConfig: {
            thinkingLevel: 'minimal',
          },
        },
      }),
    })

    const result = await geminiResponse.json()

    if (!geminiResponse.ok) {
      console.error('Gemini 추천 생성 실패:', result.error?.message ?? result)

      if (geminiResponse.status === 503) {
        return sendRetryableError(
          response,
          503,
          'GEMINI_OVERLOADED',
          '현재 Gemini 요청이 많습니다. 기존 결과는 유지되며 잠시 후 자동으로 다시 시도합니다.',
          30,
        )
      }

      if (geminiResponse.status === 429) {
        return sendRetryableError(
          response,
          429,
          'GEMINI_QUOTA_EXCEEDED',
          'Gemini 무료 사용 한도에 도달했습니다. 한도가 초기화된 후 다시 시도해 주세요.',
          60,
        )
      }

      if ([401, 403].includes(geminiResponse.status)) {
        return response.status(geminiResponse.status).json({
          code: 'GEMINI_AUTH_ERROR',
          message: 'Gemini API 키 또는 모델 사용 권한을 확인해 주세요.',
        })
      }

      return response.status(geminiResponse.status).json({
        code: 'GEMINI_REQUEST_FAILED',
        message: 'AI 여행 추천을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      })
    }

    const candidate = result.candidates?.[0]
    const responseText = candidate?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')

    if (candidate?.finishReason !== 'STOP') {
      console.error('Gemini 추천 응답 중단:', {
        finishReason: candidate?.finishReason,
        finishMessage: candidate?.finishMessage,
        usageMetadata: result.usageMetadata,
      })
      return response.status(502).json({
        message: 'AI 추천 응답이 완성되지 않았습니다. 다시 시도해 주세요.',
      })
    }

    if (!responseText) throw new Error('Gemini 응답에 추천 결과가 없습니다.')

    let recommendation

    try {
      recommendation = JSON.parse(responseText.trim().replace(/^```json\s*|\s*```$/g, ''))
    } catch (error) {
      console.error('Gemini 추천 JSON 파싱 실패:', {
        message: error.message,
        finishReason: candidate.finishReason,
        responseLength: responseText.length,
      })
      return response.status(502).json({
        message: 'AI 추천 형식을 처리하지 못했습니다. 다시 시도해 주세요.',
      })
    }

    return response.status(200).json({ recommendation })
  } catch (error) {
    console.error('AI 여행 추천 처리 실패:', error)
    return response.status(500).json({
      message: 'AI 여행 추천을 처리하는 중 오류가 발생했습니다.',
    })
  }
}
