<template>
  <div class="min-h-screen map-grid flex items-center justify-center p-8">
    <div class="w-full max-w-lg">
      <!-- Header -->
      <div class="text-center mb-10">
        <router-link to="/login" class="inline-flex items-center gap-2 mb-6">
          <span class="text-sand-500 text-2xl">⧖</span>
          <span class="font-display text-stone-800 text-2xl font-semibold">wandr</span>
        </router-link>
        <h1 class="font-display text-3xl font-semibold text-stone-900 mb-2">Crea tu cuenta</h1>
        <p class="text-stone-500 text-sm">Empieza a planificar tu próxima aventura</p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Nombre</label>
              <input v-model="form.firstName" type="text" placeholder="Juan" class="input-field" required />
            </div>
            <div>
              <label class="label">Apellido</label>
              <input v-model="form.lastName" type="text" placeholder="García" class="input-field" required />
            </div>
          </div>

          <div>
            <label class="label">Correo electrónico</label>
            <input v-model="form.email" type="email" placeholder="juan@email.com" class="input-field" required />
          </div>

          <div>
            <label class="label">Contraseña</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                class="input-field pr-10"
                minlength="4"
                required
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <EyeIcon v-if="!showPassword" class="w-4 h-4" />
                <EyeOffIcon v-else class="w-4 h-4" />
              </button>
            </div>
            <!-- Password strength -->
            <div class="mt-2 flex gap-1">
              <div v-for="i in 4" :key="i"
                class="h-1 flex-1 rounded-full transition-all duration-300"
                :class="passwordStrength >= i ? strengthColor : 'bg-sand-100'"
              ></div>
            </div>
            <p class="text-xs text-stone-400 mt-1">{{ strengthLabel }}</p>
          </div>

          <div>
            <label class="label">Confirmar contraseña</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              class="input-field"
              required
            />
            <p v-if="form.confirmPassword && !passwordsMatch" class="text-xs text-red-500 mt-1">
              Las contraseñas no coinciden
            </p>
          </div>

          <!-- Intereses de viaje -->
          <div>
            <label class="label">Intereses de viaje <span class="text-stone-400 font-normal">(opcional)</span></label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="interest in interests"
                :key="interest.value"
                type="button"
                @click="toggleInterest(interest.value)"
                class="px-3 py-1.5 rounded-full text-sm border transition-all duration-200"
                :class="form.interests.includes(interest.value)
                  ? 'bg-sand-500 text-white border-sand-500'
                  : 'bg-white text-stone-600 border-sand-200 hover:border-sand-400'"
              >
                {{ interest.emoji }} {{ interest.label }}
              </button>
            </div>
          </div>

          <transition name="fade">
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center gap-2">
              <AlertCircleIcon class="w-4 h-4 flex-shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button
            type="submit"
            class="btn-primary w-full flex items-center justify-center gap-2"
            :disabled="loading || !passwordsMatch"
          >
            <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}</span>
          </button>
        </form>
      </div>

      <p class="text-center text-stone-500 text-sm mt-6">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-sand-600 hover:text-sand-700 font-medium ml-1">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeOffIcon, AlertCircleIcon, Loader2Icon } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  interests: []
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const interests = [
  { value: 'adventure', emoji: '🏔️', label: 'Aventura' },
  { value: 'culture', emoji: '🏛️', label: 'Cultura' },
  { value: 'gastronomy', emoji: '🍜', label: 'Gastronomía' },
  { value: 'beach', emoji: '🏖️', label: 'Playas' },
  { value: 'nature', emoji: '🌿', label: 'Naturaleza' },
  { value: 'photography', emoji: '📸', label: 'Fotografía' },
]

function toggleInterest(val) {
  const idx = form.value.interests.indexOf(val)
  if (idx > -1) form.value.interests.splice(idx, 1)
  else form.value.interests.push(val)
}

const passwordsMatch = computed(() =>
  !form.value.confirmPassword || form.value.password === form.value.confirmPassword)

const passwordStrength = computed(() => {
  const p = form.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-400'
  if (passwordStrength.value === 2) return 'bg-yellow-400'
  if (passwordStrength.value === 3) return 'bg-teal-400'
  return 'bg-teal-500'
})

const strengthLabel = computed(() => {
  if (!form.value.password) return ''
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Excelente']
  return labels[passwordStrength.value] || ''
})

async function handleRegister() {
  if (!passwordsMatch.value) return
  error.value = ''
  loading.value = true
  const result = await auth.register(
    form.value.firstName, form.value.lastName,
    form.value.email, form.value.password
  )
  loading.value = false
  if (result.success) router.push('/dashboard')
  else error.value = result.error || 'Error al crear la cuenta'
}
</script>
