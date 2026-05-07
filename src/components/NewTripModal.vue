<template>
  <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <transition name="modal" appear>
      <div class="card p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-display text-2xl font-semibold text-stone-900">Nuevo viaje</h2>
            <p class="text-stone-400 text-sm">Empieza a planificar tu aventura</p>
          </div>
          <button @click="$emit('close')" class="p-1.5 text-stone-400 hover:text-stone-600 transition-colors">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <!-- Emoji picker -->
          <div>
            <label class="label">Ícono del viaje</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="e in emojis"
                :key="e"
                type="button"
                @click="form.coverEmoji = e"
                class="w-9 h-9 rounded-lg text-xl flex items-center justify-center border-2 transition-all"
                :class="form.coverEmoji === e ? 'border-sand-400 bg-sand-50 scale-110' : 'border-transparent hover:border-sand-200'"
              >{{ e }}</button>
            </div>
          </div>

          <div>
            <label class="label">Nombre del viaje *</label>
            <input v-model="form.title" type="text" placeholder="Ej: Verano en Europa 2025" class="input-field" required autofocus />
          </div>

          <div>
            <label class="label">Destino</label>
            <input v-model="form.destination" type="text" placeholder="Ej: París, Francia" class="input-field" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Fecha de inicio</label>
              <input v-model="form.startDate" type="date" class="input-field" />
            </div>
            <div>
              <label class="label">Fecha de fin</label>
              <input v-model="form.endDate" type="date" class="input-field" :min="form.startDate" />
            </div>
          </div>

          <div>
            <label class="label">Estado</label>
            <select v-model="form.status" class="input-field">
              <option value="planning">📋 Planificando</option>
              <option value="confirmed">✅ Confirmado</option>
              <option value="completed">🏁 Completado</option>
            </select>
          </div>

          <div>
            <label class="label">Presupuesto estimado</label>
            <input v-model="form.budget" type="text" placeholder="Ej: $2,000 USD" class="input-field" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="$emit('close')" class="btn-secondary flex-1">Cancelar</button>
            <button type="submit" class="btn-primary flex-1 flex items-center justify-center gap-2" :disabled="loading">
              <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
              <span>{{ loading ? 'Creando...' : 'Crear viaje' }}</span>
            </button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTripsStore } from '@/stores/trips'
import { XIcon, Loader2Icon } from 'lucide-vue-next'

const emit = defineEmits(['close', 'created'])
const tripsStore = useTripsStore()

const emojis = ['✈️','🗺️','🏖️','🏔️','🌴','🏛️','🗽','🌊','🏕️','🎭','🍜','🛕','🏯','🚢','🚂']

const form = ref({
  title: '', destination: '', startDate: '', endDate: '',
  status: 'planning', budget: '', coverEmoji: '✈️',
})
const loading = ref(false)

async function handleCreate() {
  if (!form.value.title.trim()) return
  loading.value = true
  const trip = await tripsStore.createTrip({ ...form.value })
  loading.value = false
  emit('created', trip)
}
</script>
