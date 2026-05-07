<template>
  <AppLayout>
    <div v-if="!trip" class="p-6">
      <p class="text-stone-400">Viaje no encontrado</p>
    </div>

    <div v-else>
      <!-- Hero header -->
      <div class="bg-stone-900 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <circle cx="80%" cy="50%" r="200" fill="none" stroke="#ce8328" stroke-width="1"/>
            <circle cx="80%" cy="50%" r="120" fill="none" stroke="#ce8328" stroke-width="0.5"/>
            <line x1="0" y1="40%" x2="100%" y2="60%" stroke="#ce8328" stroke-width="0.5"/>
          </svg>
        </div>
        <div class="relative z-10 px-6 py-8">
          <div class="flex items-start justify-between max-w-7xl mx-auto">
            <div class="flex items-start gap-4">
              <button @click="$router.push('/planner')" class="text-stone-400 hover:text-stone-200 transition-colors mt-1">
                <ArrowLeftIcon class="w-5 h-5" />
              </button>
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-3xl">{{ trip.coverEmoji }}</span>
                  <span
                    class="text-xs font-mono px-2 py-0.5 rounded"
                    :class="statusClass"
                  >{{ statusLabel }}</span>
                </div>
                <h1 class="font-display text-3xl font-semibold text-white mb-1">{{ trip.title }}</h1>
                <div class="flex items-center gap-4 text-stone-400 text-sm">
                  <span v-if="trip.destination" class="flex items-center gap-1">
                    <MapPinIcon class="w-3.5 h-3.5" />
                    {{ trip.destination }}
                  </span>
                  <span v-if="trip.startDate" class="flex items-center gap-1">
                    <CalendarIcon class="w-3.5 h-3.5" />
                    {{ formatDate(trip.startDate) }} → {{ formatDate(trip.endDate) }}
                  </span>
                  <span class="font-mono text-xs text-stone-600">{{ tripDays }} días</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="showAI = !showAI"
                class="flex items-center gap-2 px-4 py-2 bg-sand-500 hover:bg-sand-400 text-white rounded-lg text-sm font-medium transition-colors">
                <SparklesIcon class="w-4 h-4" />
                Asistente IA
              </button>
              <button @click="showAddDay = true"
                class="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-sm font-medium transition-colors">
                <PlusIcon class="w-4 h-4" />
                Día
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="flex h-[calc(100vh-13rem)] overflow-hidden">
        <!-- Itinerary panel -->
        <div class="flex-1 overflow-y-auto p-6 max-w-4xl">
          <!-- Empty days -->
          <div v-if="!trip.days || trip.days.length === 0" class="card p-12 text-center">
            <p class="text-4xl mb-3">📅</p>
            <p class="font-display text-stone-700 text-xl mb-2">Sin días planificados</p>
            <p class="text-stone-400 text-sm mb-4">Agrega días para organizar tu itinerario</p>
            <button @click="showAddDay = true" class="btn-primary text-sm">
              Agregar primer día
            </button>
          </div>

          <!-- Days list -->
          <div v-else class="space-y-6">
            <div v-for="(day, dIdx) in trip.days" :key="day.id" class="card overflow-hidden">
              <!-- Day header -->
              <div class="flex items-center justify-between px-5 py-3 bg-sand-50 border-b border-sand-100">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-full bg-sand-500 text-white text-xs font-bold flex items-center justify-center">
                    {{ dIdx + 1 }}
                  </span>
                  <div>
                    <p class="font-medium text-stone-800 text-sm">{{ day.title || `Día ${dIdx + 1}` }}</p>
                    <p v-if="day.date" class="text-stone-400 text-xs font-mono">{{ formatDate(day.date) }}</p>
                  </div>
                </div>
                <button
                  @click="openAddActivity(day)"
                  class="flex items-center gap-1.5 text-xs text-sand-600 hover:text-sand-700 font-medium transition-colors"
                >
                  <PlusIcon class="w-3.5 h-3.5" />
                  Actividad
                </button>
              </div>

              <!-- Activities -->
              <div class="divide-y divide-sand-50">
                <div v-if="!day.activities || day.activities.length === 0" class="px-5 py-4 text-center">
                  <p class="text-stone-400 text-sm">Sin actividades — agrega tu primera</p>
                </div>
                <div
                  v-for="act in day.activities"
                  :key="act.id"
                  class="flex items-start gap-4 px-5 py-4 hover:bg-sand-50/50 group transition-colors"
                >
                  <div class="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                    <span class="font-mono text-xs text-stone-400">{{ act.time || '--:--' }}</span>
                    <div class="w-px h-full bg-sand-200 flex-1 min-h-4"></div>
                  </div>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="categoryColors[act.category] || 'bg-stone-100'">
                    <span class="text-sm">{{ categoryEmojis[act.category] || '📌' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-stone-800 text-sm">{{ act.name }}</p>
                    <p v-if="act.location" class="text-stone-400 text-xs mt-0.5 flex items-center gap-1">
                      <MapPinIcon class="w-3 h-3" />{{ act.location }}
                    </p>
                    <p v-if="act.notes" class="text-stone-500 text-xs mt-1 italic">{{ act.notes }}</p>
                    <div class="flex items-center gap-2 mt-1.5">
                      <span v-if="act.duration" class="coord-tag">{{ act.duration }}min</span>
                      <span v-if="act.cost" class="coord-tag">{{ act.cost }}</span>
                      <span class="text-xs text-stone-300 capitalize">{{ act.category }}</span>
                    </div>
                  </div>
                  <button
                    @click="removeAct(day, act.id)"
                    class="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Assistant Panel -->
        <transition name="slide-in">
          <div v-if="showAI" class="w-80 border-l border-sand-100 flex flex-col bg-white">
            <div class="flex items-center justify-between px-4 py-3 border-b border-sand-100 bg-stone-900">
              <div class="flex items-center gap-2">
                <SparklesIcon class="w-4 h-4 text-sand-400" />
                <span class="text-white text-sm font-medium">Asistente IA</span>
                <span class="bg-sand-500 text-white text-xs px-1.5 py-0.5 rounded font-mono">BETA</span>
              </div>
              <button @click="showAI = false" class="text-stone-400 hover:text-stone-200">
                <XIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Chat messages -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
              <div v-if="chatMessages.length === 0" class="text-center py-8">
                <SparklesIcon class="w-8 h-8 text-sand-300 mx-auto mb-3" />
                <p class="text-stone-500 text-sm">Hola! Puedo ayudarte a planificar actividades, sugerir lugares y darte consejos de viaje.</p>
              </div>
              <div
                v-for="msg in chatMessages"
                :key="msg.id"
                class="flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[85%] px-3 py-2 rounded-xl text-sm"
                  :class="msg.role === 'user'
                    ? 'bg-sand-500 text-white rounded-br-sm'
                    : 'bg-sand-50 text-stone-700 border border-sand-100 rounded-bl-sm'"
                >
                  {{ msg.content }}
                </div>
              </div>
              <div v-if="aiLoading" class="flex justify-start">
                <div class="bg-sand-50 border border-sand-100 rounded-xl rounded-bl-sm px-3 py-2">
                  <div class="flex gap-1">
                    <span class="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                    <span class="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                    <span class="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick suggestions -->
            <div class="px-4 py-2 border-t border-sand-100">
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="sug in quickSuggestions"
                  :key="sug"
                  @click="sendMessage(sug)"
                  class="text-xs bg-sand-50 hover:bg-sand-100 text-sand-700 border border-sand-200 px-2 py-1 rounded-full transition-colors"
                >
                  {{ sug }}
                </button>
              </div>
            </div>

            <!-- Input -->
            <div class="p-3 border-t border-sand-100">
              <div class="flex gap-2">
                <input
                  v-model="chatInput"
                  @keydown.enter.prevent="sendMessage(chatInput)"
                  type="text"
                  placeholder="Pregunta sobre tu viaje..."
                  class="input-field text-sm"
                />
                <button
                  @click="sendMessage(chatInput)"
                  class="bg-sand-500 hover:bg-sand-600 text-white p-2.5 rounded-lg transition-colors flex-shrink-0"
                  :disabled="!chatInput.trim() || aiLoading"
                >
                  <SendIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Add day modal -->
    <transition name="fade">
      <div v-if="showAddDay" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        @click.self="showAddDay = false">
        <transition name="modal">
          <div class="card p-6 w-full max-w-sm">
            <h3 class="font-display text-xl font-semibold text-stone-900 mb-4">Agregar día</h3>
            <div class="space-y-4">
              <div>
                <label class="label">Título del día</label>
                <input v-model="newDay.title" type="text" placeholder="Ej: Llegada y exploración" class="input-field" />
              </div>
              <div>
                <label class="label">Fecha</label>
                <input v-model="newDay.date" type="date" class="input-field" />
              </div>
              <div>
                <label class="label">Notas</label>
                <textarea v-model="newDay.notes" rows="2" placeholder="Notas generales del día..." class="input-field resize-none"></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="showAddDay = false" class="btn-secondary flex-1">Cancelar</button>
              <button @click="handleAddDay" class="btn-primary flex-1">Agregar</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Add activity modal -->
    <transition name="fade">
      <div v-if="showAddActivity" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        @click.self="showAddActivity = false">
        <transition name="modal">
          <div class="card p-6 w-full max-w-sm">
            <h3 class="font-display text-xl font-semibold text-stone-900 mb-4">Nueva actividad</h3>
            <div class="space-y-4">
              <div>
                <label class="label">Nombre *</label>
                <input v-model="newActivity.name" type="text" placeholder="Ej: Visita al museo" class="input-field" required />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Hora</label>
                  <input v-model="newActivity.time" type="time" class="input-field" />
                </div>
                <div>
                  <label class="label">Duración (min)</label>
                  <input v-model.number="newActivity.duration" type="number" placeholder="90" class="input-field" />
                </div>
              </div>
              <div>
                <label class="label">Categoría</label>
                <select v-model="newActivity.category" class="input-field">
                  <option value="">Sin categoría</option>
                  <option value="sightseeing">🏛️ Turismo</option>
                  <option value="food">🍽️ Comida</option>
                  <option value="transport">🚌 Transporte</option>
                  <option value="hotel">🏨 Alojamiento</option>
                  <option value="adventure">🏔️ Aventura</option>
                  <option value="shopping">🛍️ Compras</option>
                  <option value="culture">🎭 Cultura</option>
                  <option value="nature">🌿 Naturaleza</option>
                </select>
              </div>
              <div>
                <label class="label">Ubicación</label>
                <input v-model="newActivity.location" type="text" placeholder="Dirección o lugar" class="input-field" />
              </div>
              <div>
                <label class="label">Costo estimado</label>
                <input v-model="newActivity.cost" type="text" placeholder="Ej: $25 USD" class="input-field" />
              </div>
              <div>
                <label class="label">Notas</label>
                <textarea v-model="newActivity.notes" rows="2" class="input-field resize-none" placeholder="Detalles adicionales..."></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="showAddActivity = false" class="btn-secondary flex-1">Cancelar</button>
              <button @click="handleAddActivity" class="btn-primary flex-1" :disabled="!newActivity.name">
                Agregar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </AppLayout>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { aiService } from '@/services/ai.service.js'
import AppLayout from '@/layouts/AppLayout.vue'
import {
  ArrowLeftIcon, MapPinIcon, CalendarIcon, PlusIcon, TrashIcon,
  SparklesIcon, XIcon, SendIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const tripsStore = useTripsStore()

const trip = computed(() => tripsStore.getTrip(route.params.id))
const tripDays = computed(() => {
  if (!trip.value?.startDate || !trip.value?.endDate) return '—'
  return Math.ceil((new Date(trip.value.endDate) - new Date(trip.value.startDate)) / 86400000)
})

const statusClass = computed(() => ({
  planning: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-teal-500/20 text-teal-300',
  completed: 'bg-stone-600 text-stone-300',
}[trip.value?.status] || 'bg-stone-600 text-stone-300'))

const statusLabel = computed(() => ({
  planning: 'PLANIFICANDO', confirmed: 'CONFIRMADO', completed: 'COMPLETADO'
}[trip.value?.status] || 'PLANIFICANDO'))

function formatDate(d) {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Categories
const categoryColors = {
  sightseeing: 'bg-blue-100', food: 'bg-orange-100', transport: 'bg-gray-100',
  hotel: 'bg-purple-100', adventure: 'bg-green-100', shopping: 'bg-pink-100',
  culture: 'bg-yellow-100', nature: 'bg-emerald-100',
}
const categoryEmojis = {
  sightseeing: '🏛️', food: '🍽️', transport: '🚌', hotel: '🏨',
  adventure: '🏔️', shopping: '🛍️', culture: '🎭', nature: '🌿',
}

// Add day
const showAddDay = ref(false)
const newDay = ref({ title: '', date: '', notes: '' })

async function handleAddDay() {
  await tripsStore.addDay(trip.value.id, { ...newDay.value })
  newDay.value = { title: '', date: '', notes: '' }
  showAddDay.value = false
}

// Add activity
const showAddActivity = ref(false)
const activeDay = ref(null)
const newActivity = ref({ name: '', time: '', duration: null, category: '', location: '', cost: '', notes: '' })

function openAddActivity(day) {
  activeDay.value = day
  newActivity.value = { name: '', time: '', duration: null, category: '', location: '', cost: '', notes: '' }
  showAddActivity.value = true
}

async function handleAddActivity() {
  if (!newActivity.value.name) return
  await tripsStore.addActivity(trip.value.id, activeDay.value.id, { ...newActivity.value })
  showAddActivity.value = false
}

async function removeAct(day, actId) {
  await tripsStore.removeActivity(trip.value.id, day.id, actId)
}

// AI Chat
const showAI = ref(false)
const chatInput = ref('')
const chatMessages = ref([])
const aiLoading = ref(false)
const chatContainer = ref(null)

const quickSuggestions = [
  '¿Qué comer aquí?',
  'Sugerir actividades',
  '¿Cómo moverme?',
  'Consejos de seguridad',
]

async function sendMessage(text) {
  if (!text?.trim() || aiLoading.value) return
  const content = text.trim()
  chatInput.value = ''

  chatMessages.value.push({ id: Date.now(), role: 'user', content })
  aiLoading.value = true

  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight

  try {
    const response = await aiService.chat(
      chatMessages.value.map(m => ({ role: m.role, content: m.content })),
      { destination: trip.value?.destination, title: trip.value?.title }
    )
    chatMessages.value.push({ id: Date.now() + 1, role: 'assistant', content: response.content })
  } catch (e) {
    chatMessages.value.push({ id: Date.now() + 1, role: 'assistant', content: 'Hubo un error al procesar tu consulta.' })
  }

  aiLoading.value = false
  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}
</script>

<style scoped>
.slide-in-enter-active, .slide-in-leave-active { transition: all 0.3s ease; }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateX(20px); }
</style>
