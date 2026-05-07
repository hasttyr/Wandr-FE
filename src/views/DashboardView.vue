<template>
  <AppLayout>
    <template #header-actions>
      <button @click="showNewTrip = true" class="btn-primary flex items-center gap-2 text-sm">
        <PlusIcon class="w-4 h-4" />
        Nuevo viaje
      </button>
    </template>

    <div class="p-6 max-w-7xl mx-auto">
      <!-- Welcome banner -->
      <div class="mb-8">
        <h1 class="font-display text-3xl font-semibold text-stone-900">
          Hola, <em class="text-sand-500">{{ auth.user?.firstName }}</em> 👋
        </h1>
        <p class="text-stone-500 mt-1 text-sm">¿A dónde vamos hoy?</p>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="card p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">{{ stat.emoji }}</span>
            <span class="coord-tag">{{ stat.tag }}</span>
          </div>
          <p class="font-display text-3xl font-semibold text-stone-900">{{ stat.value }}</p>
          <p class="text-stone-500 text-xs mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Two columns -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Upcoming trips -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-display text-xl font-semibold text-stone-800">Próximos viajes</h2>
            <router-link to="/planner" class="text-sand-600 hover:text-sand-700 text-sm font-medium">
              Ver todos →
            </router-link>
          </div>

          <div v-if="tripsStore.upcomingTrips.length === 0" class="card p-10 text-center">
            <p class="text-4xl mb-3">🗺️</p>
            <p class="font-display text-stone-700 text-lg mb-1">Sin viajes planificados</p>
            <p class="text-stone-400 text-sm mb-4">Comienza tu próxima aventura ahora</p>
            <button @click="showNewTrip = true" class="btn-primary text-sm">
              Planificar viaje
            </button>
          </div>

          <div v-else class="space-y-3">
            <TripCard
              v-for="trip in tripsStore.upcomingTrips.slice(0, 3)"
              :key="trip.id"
              :trip="trip"
              @click="$router.push(`/planner/${trip.id}`)"
            />
          </div>
        </div>

        <!-- Quick actions + AI panel -->
        <div class="space-y-4">
          <!-- AI Assistant teaser -->
          <div class="card p-5 bg-gradient-to-br from-stone-900 to-stone-800 border-0 text-white">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sand-400">✦</span>
              <span class="text-sand-400 font-mono text-xs tracking-widest">IA ASISTENTE</span>
            </div>
            <p class="font-display text-lg font-semibold mb-2">
              Planifica con inteligencia artificial
            </p>
            <p class="text-stone-400 text-sm mb-4">
              Obtén sugerencias de itinerarios, actividades y consejos personalizados para tu destino.
            </p>
            <button
              @click="$router.push('/planner')"
              class="w-full bg-sand-500 hover:bg-sand-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Explorar con IA →
            </button>
          </div>

          <!-- Quick stats -->
          <div class="card p-5">
            <h3 class="font-medium text-stone-700 mb-4 text-sm">Destinos visitados</h3>
            <div class="space-y-2">
              <div v-for="dest in topDestinations" :key="dest.name" class="flex items-center gap-3">
                <span class="text-lg">{{ dest.emoji }}</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-stone-700 font-medium">{{ dest.name }}</span>
                    <span class="text-stone-400 text-xs">{{ dest.trips }} viajes</span>
                  </div>
                  <div class="h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    <div class="h-full bg-sand-400 rounded-full transition-all duration-700"
                      :style="{ width: dest.pct + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent activity -->
          <div class="card p-5">
            <h3 class="font-medium text-stone-700 mb-3 text-sm">Actividad reciente</h3>
            <div class="space-y-3">
              <div v-for="act in recentActivity" :key="act.id" class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-full bg-sand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs">{{ act.emoji }}</span>
                </div>
                <div>
                  <p class="text-stone-700 text-xs font-medium">{{ act.text }}</p>
                  <p class="text-stone-400 text-xs mt-0.5">{{ act.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New trip modal -->
    <NewTripModal v-if="showNewTrip" @close="showNewTrip = false" @created="onTripCreated" />
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTripsStore } from '@/stores/trips'
import { PlusIcon } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import TripCard from '@/components/TripCard.vue'
import NewTripModal from '@/components/NewTripModal.vue'

const auth = useAuthStore()
const tripsStore = useTripsStore()
const router = useRouter()
const showNewTrip = ref(false)

const stats = computed(() => [
  { emoji: '✈️', tag: 'TOTAL', value: tripsStore.trips.length, label: 'Viajes creados' },
  { emoji: '📅', tag: 'PRÓX', value: tripsStore.upcomingTrips.length, label: 'Próximos viajes' },
  { emoji: '🏁', tag: 'HIST', value: tripsStore.pastTrips.length, label: 'Viajes realizados' },
  { emoji: '📆', tag: 'DÍAS', value: tripsStore.totalDaysPlanned, label: 'Días planificados' },
])

const topDestinations = ref([
  { name: 'Europa', emoji: '🏰', trips: 3, pct: 75 },
  { name: 'Asia', emoji: '🏯', trips: 2, pct: 50 },
  { name: 'América', emoji: '🗽', trips: 1, pct: 25 },
])

const recentActivity = ref([
  { id: 1, emoji: '✏️', text: 'Actualizado itinerario de París', time: 'Hace 2 horas' },
  { id: 2, emoji: '🗺️', text: 'Nuevo viaje: Tokyo 2025', time: 'Ayer' },
  { id: 3, emoji: '✅', text: 'Completado: Viaje a Roma', time: 'Hace 3 días' },
])

function onTripCreated(trip) {
  showNewTrip.value = false
  router.push(`/planner/${trip.id}`)
}
</script>
