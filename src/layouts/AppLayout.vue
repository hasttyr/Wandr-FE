<template>
  <div class="flex h-screen overflow-hidden bg-sand-50">
    <!-- Sidebar -->
    <aside
      class="flex flex-col bg-stone-900 transition-all duration-300 z-30"
      :class="sidebarOpen ? 'w-60' : 'w-16'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-stone-800 flex-shrink-0 h-16">
        <span class="text-sand-400 text-xl flex-shrink-0">⧖</span>
        <transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden">
            <p class="font-display text-white text-base font-semibold leading-none">wandr</p>
            <p class="font-mono text-stone-500 text-[9px] tracking-widest mt-0.5">TRAVEL PLANNER</p>
          </div>
        </transition>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
          :class="[
            $route.path.startsWith(item.to)
              ? 'bg-sand-500 text-white'
              : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-sm font-medium whitespace-nowrap overflow-hidden">
              {{ item.label }}
            </span>
          </transition>
        </router-link>
      </nav>

      <!-- User section -->
      <div class="border-t border-stone-800 p-3 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-sand-500 flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xs font-semibold">{{ auth.initials }}</span>
          </div>
          <transition name="fade">
            <div v-if="sidebarOpen" class="flex-1 overflow-hidden">
              <p class="text-stone-200 text-sm font-medium truncate">{{ auth.fullName }}</p>
              <p class="text-stone-500 text-xs truncate">{{ auth.user?.email }}</p>
            </div>
          </transition>
        </div>
        <transition name="fade">
          <button
            v-if="sidebarOpen"
            @click="handleLogout"
            class="mt-3 w-full flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-all duration-200 text-sm"
          >
            <LogOutIcon class="w-4 h-4" />
            Cerrar sesión
          </button>
        </transition>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="h-16 bg-white border-b border-sand-100 flex items-center px-6 gap-4 flex-shrink-0">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-lg hover:bg-sand-100 text-stone-500 transition-colors"
        >
          <MenuIcon class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2 flex-1">
          <span class="font-mono text-xs text-stone-400">{{ currentCoord }}</span>
        </div>

        <div class="flex items-center gap-2">
          <slot name="header-actions" />
          <div class="w-8 h-8 rounded-full bg-sand-500 flex items-center justify-center">
            <span class="text-white text-xs font-semibold">{{ auth.initials }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboardIcon, MapIcon, PlusCircleIcon, SettingsIcon,
  LogOutIcon, MenuIcon, CompassIcon
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(true)

const navItems = [
  { to: '/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { to: '/planner', icon: MapIcon, label: 'Mis Viajes' },
]

const coords = ['4.7110° N, 74.0721° W', '48.8566° N, 2.3522° E', '35.6762° N, 139.6503° E', '-33.8688° S, 151.2093° E']
const currentCoord = computed(() => coords[Math.floor(Date.now() / 10000) % coords.length])

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
