<template>
  <div
    @click="$emit('click')"
    class="card p-4 flex items-center gap-4 hover:shadow-md hover:border-sand-200 transition-all duration-200 cursor-pointer group"
  >
    <div class="w-12 h-12 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform">
      {{ trip.coverEmoji }}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <h3 class="font-medium text-stone-800 truncate">{{ trip.title }}</h3>
        <span class="text-xs px-2 py-0.5 rounded-full flex-shrink-0" :class="statusClass">{{ statusLabel }}</span>
      </div>
      <div class="flex items-center gap-3 text-stone-400 text-xs">
        <span v-if="trip.destination" class="flex items-center gap-1">
          <MapPinIcon class="w-3 h-3" />{{ trip.destination }}
        </span>
        <span v-if="trip.startDate" class="flex items-center gap-1">
          <CalendarIcon class="w-3 h-3" />{{ formatDate(trip.startDate) }}
        </span>
        <span class="coord-tag">{{ trip.days?.length || 0 }} días</span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button v-if="showDelete" @click.stop="$emit('delete', trip)"
        class="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-red-400 transition-all">
        <TrashIcon class="w-4 h-4" />
      </button>
      <ChevronRightIcon class="w-4 h-4 text-stone-300 group-hover:text-sand-400 transition-colors" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPinIcon, CalendarIcon, ChevronRightIcon, TrashIcon } from 'lucide-vue-next'

const props = defineProps({ trip: Object, showDelete: Boolean })
defineEmits(['click', 'delete'])

const statusClass = computed(() => ({
  planning: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-teal-100 text-teal-700',
  completed: 'bg-stone-100 text-stone-500',
}[props.trip.status] || 'bg-stone-100 text-stone-500'))

const statusLabel = computed(() => ({
  planning: 'Planificando', confirmed: 'Confirmado', completed: 'Completado',
}[props.trip.status] || 'Planificando'))

function formatDate(d) {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}
</script>
