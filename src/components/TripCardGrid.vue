<template>
  <div
    @click="$emit('click')"
    class="card overflow-hidden hover:shadow-lg hover:border-sand-200 transition-all duration-200 cursor-pointer group"
  >
    <!-- Card visual header -->
    <div class="h-32 bg-gradient-to-br relative flex items-center justify-center overflow-hidden"
      :style="{ background: cardGradient }">
      <div class="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <circle cx="80%" cy="50%" r="60" fill="none" stroke="white" stroke-width="1"/>
          <circle cx="80%" cy="50%" r="30" fill="none" stroke="white" stroke-width="0.5"/>
          <line x1="0" y1="40%" x2="100%" y2="60%" stroke="white" stroke-width="0.5"/>
        </svg>
      </div>
      <span class="text-4xl z-10 group-hover:scale-125 transition-transform duration-300">{{ trip.coverEmoji }}</span>
      <div class="absolute top-3 right-3 flex gap-1.5">
        <span class="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">{{ statusLabel }}</span>
      </div>
      <button
        @click.stop="$emit('delete', trip)"
        class="absolute bottom-3 right-3 p-1.5 bg-white/20 hover:bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <TrashIcon class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Card body -->
    <div class="p-4">
      <h3 class="font-display font-semibold text-stone-800 mb-1 truncate">{{ trip.title }}</h3>
      <div class="flex items-center gap-1.5 text-stone-400 text-xs mb-3">
        <MapPinIcon v-if="trip.destination" class="w-3 h-3 flex-shrink-0" />
        <span v-if="trip.destination" class="truncate">{{ trip.destination }}</span>
        <span v-else class="italic">Sin destino</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span v-if="trip.startDate" class="text-stone-400">
          {{ formatDate(trip.startDate) }}
        </span>
        <span v-else class="text-stone-300 italic">Sin fechas</span>
        <span class="coord-tag">{{ trip.days?.length || 0 }} días</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPinIcon, TrashIcon } from 'lucide-vue-next'

const props = defineProps({ trip: Object })
defineEmits(['click', 'delete'])

const gradients = [
  'linear-gradient(135deg, #3a3832 0%, #784119 100%)',
  'linear-gradient(135deg, #0b7659 0%, #0e4d3b 100%)',
  'linear-gradient(135deg, #784119 0%, #ce8328 100%)',
  'linear-gradient(135deg, #3a3832 0%, #4e4d43 100%)',
  'linear-gradient(135deg, #955219 0%, #dca04a 100%)',
]

const cardGradient = computed(() => {
  const idx = props.trip.id?.charCodeAt(0) % gradients.length || 0
  return gradients[idx]
})

const statusLabel = computed(() => ({
  planning: 'Planificando', confirmed: 'Confirmado', completed: 'Completado',
}[props.trip.status] || 'Planificando'))

function formatDate(d) {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
