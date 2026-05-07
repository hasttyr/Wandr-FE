<template>
  <div class="min-h-screen map-grid flex">
    <!-- Left panel: branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-stone-900 relative overflow-hidden flex-col justify-between p-12">
      <!-- Decorative lines -->
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="#ce8328" stroke-width="1"/>
          <line x1="0" y1="60%" x2="100%" y2="75%" stroke="#ce8328" stroke-width="0.5"/>
          <line x1="20%" y1="0" x2="35%" y2="100%" stroke="#ce8328" stroke-width="0.5"/>
          <line x1="70%" y1="0" x2="60%" y2="100%" stroke="#ce8328" stroke-width="1"/>
          <circle cx="50%" cy="50%" r="180" fill="none" stroke="#ce8328" stroke-width="0.5"/>
          <circle cx="50%" cy="50%" r="280" fill="none" stroke="#ce8328" stroke-width="0.3"/>
          <circle cx="20%" cy="35%" r="4" fill="#ce8328"/>
          <circle cx="75%" cy="65%" r="4" fill="#ce8328"/>
          <circle cx="50%" cy="50%" r="6" fill="#ce8328"/>
        </svg>
      </div>

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-sand-400 text-2xl">⧖</span>
          <span class="font-display text-white text-xl font-semibold">wandr</span>
        </div>
        <span class="font-mono text-xs text-stone-500 tracking-widest">TRAVEL PLANNER</span>
      </div>

      <div class="relative z-10">
        <p class="font-display text-white text-4xl font-semibold leading-tight mb-4">
          Cada viaje comienza<br/>
          <em class="text-sand-400">con un mapa en blanco.</em>
        </p>
        <p class="text-stone-400 text-sm leading-relaxed max-w-sm">
          Organiza tus aventuras, planifica itinerarios detallados y guarda los recuerdos de cada destino.
        </p>
      </div>

      <div class="relative z-10 flex items-center gap-6">
        <div class="text-center">
          <p class="font-display text-sand-400 text-2xl font-semibold">150+</p>
          <p class="text-stone-500 text-xs">Destinos</p>
        </div>
        <div class="w-px h-8 bg-stone-700"></div>
        <div class="text-center">
          <p class="font-display text-sand-400 text-2xl font-semibold">12k</p>
          <p class="text-stone-500 text-xs">Itinerarios</p>
        </div>
        <div class="w-px h-8 bg-stone-700"></div>
        <div class="text-center">
          <p class="font-display text-sand-400 text-2xl font-semibold">98%</p>
          <p class="text-stone-500 text-xs">Satisfacción</p>
        </div>
      </div>
    </div>

    <!-- Right panel: form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <span class="text-sand-500 text-xl">⧖</span>
          <span class="font-display text-stone-800 text-xl font-semibold">wandr</span>
        </div>

        <div class="mb-8">
          <h1 class="font-display text-3xl font-semibold text-stone-900 mb-1">Bienvenido de vuelta</h1>
          <p class="text-stone-500 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="label">Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              class="input-field"
              autocomplete="email"
              required
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="label">Contraseña</label>
              <a href="#" class="text-xs text-sand-600 hover:text-sand-700">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input-field pr-10"
                autocomplete="current-password"
                required
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <EyeIcon v-if="!showPassword" class="w-4 h-4" />
                <EyeOffIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <transition name="fade">
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center gap-2">
              <AlertCircleIcon class="w-4 h-4 flex-shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2" :disabled="loading">
            <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ loading ? 'Ingresando...' : 'Ingresar' }}</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-stone-500 text-sm">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-sand-600 hover:text-sand-700 font-medium ml-1">
              Regístrate gratis
            </router-link>
          </p>
        </div>

        <!-- Coord decoration -->
        <div class="mt-10 pt-6 border-t border-sand-100 flex justify-center gap-4">
          <span class="coord-tag">40.7128° N</span>
          <span class="coord-tag">74.0060° W</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { EyeIcon, EyeOffIcon, AlertCircleIcon, Loader2Icon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  const result = await auth.login(form.value.email, form.value.password)
  loading.value = false
  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    error.value = result.error
  }
}
</script>
