// ─── AI Service ──────────────────────────────────────────────────────────
// 🤖 Este archivo es el punto de integración con tu microservicio de IA.
// Actualmente usa respuestas simuladas. Para conectar:
//
// 1. Cambia AI_SERVICE_URL a la URL de tu microservicio
// 2. Si usas Anthropic directamente, agrega tu API key via variable de entorno
// 3. Los métodos ya están definidos — solo cambia la implementación interna
//
// Ejemplo de microservicio Python (FastAPI):
//   POST /api/ai/suggest-itinerary  { destination, days, interests }
//   POST /api/ai/activity-ideas     { location, category, context }
//   POST /api/ai/travel-tips        { destination }
//   POST /api/ai/chat               { messages[], tripContext }

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || null
const USE_ANTHROPIC_DIRECT = import.meta.env.VITE_ANTHROPIC_API_KEY || false

export const aiService = {
  /**
   * Genera un itinerario sugerido para un destino
   * @param {Object} params - { destination, days, interests, budget }
   */
  async suggestItinerary(params) {
    if (AI_SERVICE_URL) {
      const res = await fetch(`${AI_SERVICE_URL}/suggest-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      return res.json()
    }

    // Mock response
    await delay(1200)
    return {
      days: Array.from({ length: params.days || 3 }, (_, i) => ({
        dayNumber: i + 1,
        title: `Día ${i + 1} en ${params.destination}`,
        activities: [
          { name: 'Exploración matutina', time: '09:00', duration: 120, category: 'sightseeing' },
          { name: 'Almuerzo local', time: '13:00', duration: 90, category: 'food' },
          { name: 'Actividad cultural', time: '15:30', duration: 120, category: 'culture' },
        ]
      })),
      tips: [`Visita ${params.destination} en temporada baja para mejores precios.`],
    }
  },

  /**
   * Sugiere actividades para una ubicación y categoría
   * @param {Object} params - { location, category, date }
   */
  async suggestActivities(params) {
    if (AI_SERVICE_URL) {
      const res = await fetch(`${AI_SERVICE_URL}/activity-ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      return res.json()
    }

    await delay(800)
    return {
      activities: [
        { name: 'Tour gastronómico local', category: 'food', estimatedCost: 25, duration: 180 },
        { name: 'Museo de historia', category: 'culture', estimatedCost: 12, duration: 120 },
        { name: 'Paseo por el mercado central', category: 'shopping', estimatedCost: 0, duration: 60 },
      ]
    }
  },

  /**
   * Chat con contexto del viaje — para un asistente conversacional
   * @param {Array} messages - historial de mensajes [{ role, content }]
   * @param {Object} tripContext - contexto del viaje activo
   */
  async chat(messages, tripContext = null) {
    if (AI_SERVICE_URL) {
      const res = await fetch(`${AI_SERVICE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, tripContext }),
      })
      return res.json()
    }

    await delay(1000)
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || ''
    let reply = '¡Hola! Soy tu asistente de viajes. Puedo ayudarte a planificar actividades, '
      + 'sugerir restaurantes, y darte consejos de viaje. ¿En qué te puedo ayudar?'

    if (lastMsg.includes('comer') || lastMsg.includes('restaurante')) {
      reply = 'En la zona hay excelentes opciones gastronómicas. Te recomiendo explorar los mercados locales y preguntar a los lugareños por sus favoritos.'
    } else if (lastMsg.includes('hotel') || lastMsg.includes('hostal')) {
      reply = 'Para alojamiento, considera la ubicación respecto a los principales atractivos. Las zonas céntricas suelen tener mejor conectividad de transporte.'
    } else if (lastMsg.includes('clima') || lastMsg.includes('tiempo')) {
      reply = 'Te sugiero revisar el clima de los últimos años para la época de tu visita y llevar ropa en capas para adaptarte a los cambios.'
    }

    return { content: reply, role: 'assistant' }
  },

  /**
   * Tips generales de viaje para un destino
   */
  async getTravelTips(destination) {
    if (AI_SERVICE_URL) {
      const res = await fetch(`${AI_SERVICE_URL}/travel-tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
      })
      return res.json()
    }

    await delay(600)
    return {
      tips: [
        'Lleva efectivo para mercados y vendedores locales',
        'Aprende algunas frases básicas del idioma local',
        'Reserva con anticipación en temporada alta',
        'Verifica los requisitos de visa con anticipación',
        'Contrata un seguro de viaje completo',
      ]
    }
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms))
