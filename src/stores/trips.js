import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Trips Store ──────────────────────────────────────────────────────────
// 🔌 Para conectar backend/microservicio: reemplaza las operaciones locales
// con llamadas a tripService. La estructura de datos permanece igual.

const STORAGE_KEY = 'wandr_trips'

function loadTrips() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export const useTripsStore = defineStore('trips', () => {
  const trips = ref(loadTrips())
  const loading = ref(false)

  const sortedTrips = computed(() =>
    [...trips.value].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  )

  const upcomingTrips = computed(() => {
    const now = new Date()
    return sortedTrips.value.filter(t => new Date(t.startDate) >= now)
  })

  const pastTrips = computed(() => {
    const now = new Date()
    return sortedTrips.value.filter(t => new Date(t.endDate) < now)
  })

  const totalDaysPlanned = computed(() =>
    trips.value.reduce((acc, t) => {
      if (!t.startDate || !t.endDate) return acc
      const diff = Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 86400000)
      return acc + diff
    }, 0)
  )

  function getTrip(id) {
    return trips.value.find(t => t.id === id)
  }

  async function createTrip(data) {
    // 🔌 REEMPLAZAR: const trip = await tripService.create(data)
    loading.value = true
    await delay(300)
    const trip = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'planning',
      coverEmoji: randomEmoji(),
      days: [],
      budget: null,
      notes: '',
      ...data,
    }
    trips.value.unshift(trip)
    saveTrips(trips.value)
    loading.value = false
    return trip
  }

  async function updateTrip(id, patch) {
    // 🔌 REEMPLAZAR: await tripService.update(id, patch)
    const idx = trips.value.findIndex(t => t.id === id)
    if (idx === -1) return
    trips.value[idx] = { ...trips.value[idx], ...patch }
    saveTrips(trips.value)
    return trips.value[idx]
  }

  async function deleteTrip(id) {
    // 🔌 REEMPLAZAR: await tripService.delete(id)
    trips.value = trips.value.filter(t => t.id !== id)
    saveTrips(trips.value)
  }

  async function addDay(tripId, dayData) {
    const trip = getTrip(tripId)
    if (!trip) return
    const day = {
      id: crypto.randomUUID(),
      activities: [],
      ...dayData,
    }
    if (!trip.days) trip.days = []
    trip.days.push(day)
    await updateTrip(tripId, { days: trip.days })
    return day
  }

  async function addActivity(tripId, dayId, activityData) {
    const trip = getTrip(tripId)
    if (!trip) return
    const day = trip.days?.find(d => d.id === dayId)
    if (!day) return
    const activity = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...activityData,
    }
    day.activities.push(activity)
    await updateTrip(tripId, { days: trip.days })
    return activity
  }

  async function removeActivity(tripId, dayId, activityId) {
    const trip = getTrip(tripId)
    if (!trip) return
    const day = trip.days?.find(d => d.id === dayId)
    if (!day) return
    day.activities = day.activities.filter(a => a.id !== activityId)
    await updateTrip(tripId, { days: trip.days })
  }

  return {
    trips, loading, sortedTrips, upcomingTrips, pastTrips, totalDaysPlanned,
    getTrip, createTrip, updateTrip, deleteTrip, addDay, addActivity, removeActivity
  }
})

const delay = ms => new Promise(r => setTimeout(r, ms))
const EMOJIS = ['🗺️','✈️','🏖️','🏔️','🌴','🏛️','🗽','🌊','🏕️','🎭','🍜','🛕']
const randomEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
