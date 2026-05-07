import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Auth Store ────────────────────────────────────────────────────────────
// Para conectar un backend real, reemplaza las funciones `login` y `register`
// con llamadas a tu authService. El resto de la app no cambia.
// Ejemplo: import { authService } from '@/services/auth.service.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('wandr_user') || 'null'))
  const token = ref(localStorage.getItem('wandr_token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '')
  const initials = computed(() =>
    user.value
      ? `${user.value.firstName?.[0] ?? ''}${user.value.lastName?.[0] ?? ''}`.toUpperCase()
      : '?')

  async function login(email, password) {
    // 🔌 REEMPLAZAR: const res = await authService.login(email, password)
    await delay(600)
    if (email && password.length >= 4) {
      const mockUser = {
        id: '1', firstName: 'Viajero', lastName: 'Explorador',
        email, avatar: null
      }
      _setSession(mockUser, 'mock-jwt-' + Date.now())
      return { success: true }
    }
    return { success: false, error: 'Credenciales inválidas' }
  }

  async function register(firstName, lastName, email, password) {
    // 🔌 REEMPLAZAR: const res = await authService.register({ firstName, lastName, email, password })
    await delay(800)
    const mockUser = { id: Date.now().toString(), firstName, lastName, email, avatar: null }
    _setSession(mockUser, 'mock-jwt-' + Date.now())
    return { success: true }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('wandr_user')
    localStorage.removeItem('wandr_token')
  }

  function _setSession(u, t) {
    user.value = u
    token.value = t
    localStorage.setItem('wandr_user', JSON.stringify(u))
    localStorage.setItem('wandr_token', t)
  }

  return { user, token, isAuthenticated, fullName, initials, login, register, logout }
})

const delay = ms => new Promise(r => setTimeout(r, ms))
