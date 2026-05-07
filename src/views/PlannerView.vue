<template>
  <AppLayout>
    <template #header-actions>
      <button @click="showNewTrip = true" class="btn-primary flex items-center gap-2 text-sm">
        <PlusIcon class="w-4 h-4" />
        Nuevo viaje
      </button>
    </template>

    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="font-display text-3xl font-semibold text-stone-900 mb-1">Mis Viajes</h1>
          <p class="text-stone-500 text-sm">
            {{ tripsStore.trips.length }} viaje{{ tripsStore.trips.length !== 1 ? 's' : '' }} en total
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="view in ['grid', 'list']"
            :key="view"
            @click="viewMode = view"
            class="p-2 rounded-lg transition-colors"
            :class="viewMode === view ? 'bg-sand-500 text-white' : 'bg-white text-stone-500 border border-sand-200 hover:bg-sand-50'"
          >
            <LayoutGridIcon v-if="view === 'grid'" class="w-4 h-4" />
            <ListIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 mb-6 flex-wrap">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Buscar viaje..."
            class="input-field pl-9 w-56 text-sm"
          />
        </div>
        <select v-model="filterStatus" class="input-field w-40 text-sm">
          <option value="">Todos los estados</option>
          <option value="planning">Planificando</option>
          <option value="confirmed">Confirmado</option>
          <option value="completed">Completado</option>
        </select>
      </div>

      <!-- Empty state -->
      <div v-if="filteredTrips.length === 0 && tripsStore.trips.length === 0"
        class="card p-16 text-center max-w-md mx-auto">
        <p class="text-6xl mb-4">🌍</p>
        <h2 class="font-display text-2xl font-semibold text-stone-800 mb-2">
          Tu primera aventura te espera
        </h2>
        <p class="text-stone-500 text-sm mb-6">
          Crea tu primer viaje y empieza a planificar cada detalle de tu itinerario.
        </p>
        <button @click="showNewTrip = true" class="btn-primary">
          Crear mi primer viaje
        </button>
      </div>

      <!-- No results -->
      <div v-else-if="filteredTrips.length === 0" class="text-center py-12">
        <p class="text-stone-400">No se encontraron viajes con ese criterio</p>
      </div>

      <!-- Grid view -->
      <div v-else-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TripCardGrid
          v-for="trip in filteredTrips"
          :key="trip.id"
          :trip="trip"
          @click="$router.push(`/planner/${trip.id}`)"
          @delete="confirmDelete(trip)"
        />
      </div>

      <!-- List view -->
      <div v-else class="space-y-3">
        <TripCard
          v-for="trip in filteredTrips"
          :key="trip.id"
          :trip="trip"
          :showDelete="true"
          @click="$router.push(`/planner/${trip.id}`)"
          @delete="confirmDelete(trip)"
        />
      </div>
    </div>

    <NewTripModal v-if="showNewTrip" @close="showNewTrip = false" @created="onTripCreated" />

    <!-- Delete confirm -->
    <transition name="fade">
      <div v-if="tripToDelete" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        @click.self="tripToDelete = null">
        <transition name="modal">
          <div class="card p-6 max-w-sm w-full">
            <h3 class="font-display text-xl font-semibold text-stone-900 mb-2">¿Eliminar viaje?</h3>
            <p class="text-stone-500 text-sm mb-6">
              Se eliminará <strong>{{ tripToDelete.title }}</strong> y todo su itinerario. Esta acción no se puede deshacer.
            </p>
            <div class="flex gap-3">
              <button @click="tripToDelete = null" class="btn-secondary flex-1">Cancelar</button>
              <button @click="handleDelete" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { PlusIcon, LayoutGridIcon, ListIcon, SearchIcon } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import TripCard from '@/components/TripCard.vue'
import TripCardGrid from '@/components/TripCardGrid.vue'
import NewTripModal from '@/components/NewTripModal.vue'

const router = useRouter()
const tripsStore = useTripsStore()

const showNewTrip = ref(false)
const viewMode = ref('grid')
const search = ref('')
const filterStatus = ref('')
const tripToDelete = ref(null)

const filteredTrips = computed(() => {
  let list = tripsStore.sortedTrips
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) || t.destination?.toLowerCase().includes(q)
    )
  }
  if (filterStatus.value) list = list.filter(t => t.status === filterStatus.value)
  return list
})

function confirmDelete(trip) { tripToDelete.value = trip }
async function handleDelete() {
  await tripsStore.deleteTrip(tripToDelete.value.id)
  tripToDelete.value = null
}
function onTripCreated(trip) {
  showNewTrip.value = false
  router.push(`/planner/${trip.id}`)
}
</script>
