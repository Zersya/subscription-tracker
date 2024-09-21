<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {rrulestr} from 'rrule'
import type {Subscription, Category, RecurringEvent, SubscriptionCategory} from '~/server/utils/drizzle'

interface CalendarDay {
  date: number | null;
  isToday?: boolean;
  events: Array<RecurringEvent & { subscription: Subscription; category: Category }>;
}

const categories = ref<Category[]>([])
const subscriptions = ref<Array<Subscription & { category: SubscriptionCategory }>>([])
const recurringEvents = ref<Array<RecurringEvent & { subscription: Subscription }>>([])

const weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const currentDate = ref<Date>(new Date())
const selectedMonth = ref<string>(currentDate.value.getMonth().toString())

const isOpenDialog = ref({
  form: false
})

const selectedSubscription = ref<Subscription | undefined>(undefined)

const monthOptions = computed(() => {
  return Array.from({length: 12}, (_, i) => ({
    label: new Date(0, i).toLocaleString('default', {month: 'long'}),
    value: i.toString()
  }))
})

const getDaysInMonth = (date: Date): { days: number; firstDay: number } => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  return {days, firstDay: firstDay === 0 ? 7 : firstDay}
}

const calendarDays = computed((): CalendarDay[] => {
  const {days, firstDay} = getDaysInMonth(currentDate.value)
  const today = new Date()
  const calendarDays: CalendarDay[] = []

  for (let i = 1; i < firstDay; i++) {
    calendarDays.push({date: null, events: []})
  }
  for (let i = 1; i <= days; i++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
    const isToday = date.toDateString() === today.toDateString()
    const dayEvents = recurringEvents.value.filter(event => {
      const rule = rrulestr(event.recurrenceRule, {dtstart: new Date(event.subscription.startDate)})
      const occurrences = rule.between(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
          true
      )
      return occurrences.length > 0
    }).map(event => ({
      ...event,
      subscription: subscriptions.value.find(sub => sub.id === event.subscriptionId)!,
      category: categories.value.find(cat => cat.id === subscriptions.value.find(sub => sub.id === event.subscriptionId)?.category?.categoryId)!
    }))

    calendarDays.push({date: i, isToday, events: dayEvents})
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

const openSubscriptionForm = (subscription?: Subscription) => {
  selectedSubscription.value = subscription
  isOpenDialog.value.form = true
}

const handleSubscriptionSuccess = async (updatedSubscription: Subscription) => {
  await Promise.all([
    fetchCategories(),
    fetchSubscriptions(),
    fetchRecurringEvents()
  ])
  isOpenDialog.value.form = false
  selectedSubscription.value = undefined
}

const fetchCategories = async () => {
  try {
    const response: { data: Category[] } = await $fetch('/api/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchSubscriptions = async () => {
  try {
    const response: {
      data: Array<Subscription & { category: SubscriptionCategory }>
    } = await $fetch('/api/subscriptions')
    subscriptions.value = response.data
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  }
}

const fetchRecurringEvents = async () => {
  try {
    const response: {
      data: Array<RecurringEvent & { subscription: Subscription }>
    } = await $fetch('/api/recurringEvents')
    recurringEvents.value = response.data
  } catch (error) {
    console.error('Error fetching recurring events:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchSubscriptions(),
    fetchRecurringEvents()
  ])
})

watch(selectedMonth, (newValue: string) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), parseInt(newValue), 1)
})
</script>

<template>
  <div class="container mx-auto p-4 w-[64em]">
    <div class="flex justify-between items-center mb-4">
      <UButton @click="prevMonth">
        <Icon name="lucide:chevron-left"/>
      </UButton>
      <USelect v-model="selectedMonth" :options="monthOptions"/>
      <UButton @click="nextMonth">
        <Icon name="lucide:chevron-right"/>
      </UButton>
    </div>

    <custom-dialog v-model="isOpenDialog.form">
      <template #activator>
        <u-button variant="solid" @click="openSubscriptionForm()">
          Add Subscription
        </u-button>
      </template>
      <template #body>
        <forms-subscription-form
            :subscription="selectedSubscription"
            @success="handleSubscriptionSuccess"
            @close="isOpenDialog.form = false"
        />
      </template>
    </custom-dialog>

    <div class="grid grid-cols-7 gap-2 mb-2">
      <div v-for="day in weekDays" :key="day" class="font-bold text-center">{{ day }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1" style="grid-template-rows: repeat(6, minmax(100px, 1fr))">
      <template v-for="(day, index) in calendarDays" :key="index">
        <div :class="['border p-1 aspect-square rounded', { 'bg-blue-100': day.isToday }]">
          <div v-if="day.date" class="font-bold">{{ day.date }}</div>
          <template v-for="event in day.events" :key="event.id">
            <div
                class="text-xs p-1 mb-1 rounded cursor-pointer flex overflow-hidden"
                @click="openSubscriptionForm(event.subscription)"
            >
              <div
                  class="flex-grow rounded"
                  :style="{
                    backgroundImage: `linear-gradient(to right, ${event.category?.color || 'transparent'} 3%, ${event.subscription?.color || 'transparent'} 3%)`,
                  }"
              >
                  <span class="pl-3 pr-1 text-white">
                    {{ event.subscription.name }}
                    <span v-if="event.eventType === 'payment'" class="ml-1">💰</span>
                  </span>
              </div>
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
