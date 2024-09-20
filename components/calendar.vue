<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <UButton @click="prevMonth"><Icon name="lucide:chevron-left" /></UButton>
      <USelect v-model="selectedMonth" :options="monthOptions" />
      <UButton @click="nextMonth"><Icon name="lucide:chevron-right" /></UButton>
    </div>

    <custom-dialog v-model="isOpenDialog.form">
      <template #activator>
        <u-button variant="solid" @click="() => {selected = undefined; isOpenDialog.form = true}">
          Tambah Produk
        </u-button>
      </template>
      <template #body>
        <forms-product-form :product="selected" @success="() => {
                isOpenDialog.form = false;
                refresh()
              }" @close="() => {
                isOpenDialog.form = false
                selected = undefined
              }"
        />
      </template>
    </custom-dialog>

    <div class="grid grid-cols-7 gap-2 mb-2">
      <div v-for="day in weekDays" :key="day" class="font-bold text-center">{{ day }}</div>
    </div>

    <div class="grid grid-cols-7 gap-2" style="grid-template-rows: repeat(6, minmax(100px, 1fr))">
      <template v-for="(day, index) in calendarDays" :key="index">
        <div :class="['border p-1', { 'bg-blue-100': day.isToday }]">
          <div v-if="day.date" class="font-bold">{{ day.date }}</div>
          <template v-for="event in day.events" :key="event.id">
            <div :class="[event.category.color, 'text-white text-xs p-1 mb-1 rounded']">
              {{ event.subscription.name }} - ${{ event.subscription.price }}
              <span v-if="event.eventType === 'payment'" class="ml-1">💰</span>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div class="mt-4">
      <h3 class="font-bold mb-2">Legend</h3>
      <div class="flex flex-wrap gap-2">
        <div v-for="category in categories" :key="category.id" class="flex items-center">
          <div :class="['w-4 h-4 rounded mr-1', category.color]"></div>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Subscription {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

interface RecurringEvent {
  id: number;
  subscriptionId: number;
  date: Date;
  eventType: string;
}

interface CalendarDay {
  date: number | null;
  isToday?: boolean;
  events: Array<RecurringEvent & { subscription: Subscription; category: Category }>;
}

const categories = ref<Category[]>([
  { id: 1, name: 'Streaming', color: 'bg-red-500' },
  { id: 2, name: 'Utilities', color: 'bg-blue-500' },
  { id: 3, name: 'Software', color: 'bg-green-500' },
])

const subscriptions = ref<Subscription[]>([
  { id: 1, name: 'Netflix', price: 15.99, categoryId: 1 },
  { id: 2, name: 'Spotify', price: 9.99, categoryId: 1 },
  { id: 3, name: 'Electric', price: 100, categoryId: 2 },
  { id: 4, name: 'Adobe CC', price: 52.99, categoryId: 3 },
])

const recurringEvents = ref<RecurringEvent[]>([
  { id: 1, subscriptionId: 1, date: new Date(2024, 8, 15), eventType: 'payment' },
  { id: 2, subscriptionId: 2, date: new Date(2024, 8, 1), eventType: 'payment' },
  { id: 3, subscriptionId: 3, date: new Date(2024, 8, 20), eventType: 'payment' },
  { id: 4, subscriptionId: 4, date: new Date(2024, 8, 5), eventType: 'payment' },
])

const weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const currentDate = ref<Date>(new Date())
const selectedMonth = ref<string>(currentDate.value.getMonth().toString())

const monthOptions = computed(() => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    value: i.toString()
  }))
})

const getDaysInMonth = (date: Date): { days: number; firstDay: number } => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  return { days, firstDay: firstDay === 0 ? 7 : firstDay }
}

const calendarDays = computed((): CalendarDay[] => {
  const { days, firstDay } = getDaysInMonth(currentDate.value)
  const today = new Date()
  const calendarDays: CalendarDay[] = []

  for (let i = 1; i < firstDay; i++) {
    calendarDays.push({ date: null, events: [] })
  }
  for (let i = 1; i <= days; i++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
    const isToday = date.toDateString() === today.toDateString()
    const dayEvents = recurringEvents.value.filter(event =>
        event.date.getDate() === i &&
        event.date.getMonth() === currentDate.value.getMonth()
    ).map(event => ({
      ...event,
      subscription: subscriptions.value.find(sub => sub.id === event.subscriptionId)!,
      category: categories.value.find(cat => cat.id === subscriptions.value.find(sub => sub.id === event.subscriptionId)?.categoryId)!
    }))

    calendarDays.push({ date: i, isToday, events: dayEvents })
  }

  return calendarDays
})

const prevMonth = (): void => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  selectedMonth.value = currentDate.value.getMonth().toString()
}

const nextMonth = (): void => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  selectedMonth.value = currentDate.value.getMonth().toString()
}

watch(selectedMonth, (newValue: string) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), parseInt(newValue), 1)
})
</script>
