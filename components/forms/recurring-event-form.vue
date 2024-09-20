<script setup lang="ts">
import {object, string, number, date, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {RecurringEvent} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  recurringEvent: {
    type: Object as PropType<RecurringEvent | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  subscriptionId: number().required('Subscription ID is required'),
  eventType: string().required('Event type is required'),
  recurrenceRule: string().required('Recurrence rule is required'),
  lastOccurrence: date().nullable(),
  nextOccurrence: date().required('Next occurrence is required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  subscriptionId: 0,
  eventType: '',
  recurrenceRule: '',
  lastOccurrence: null as Date | null,
  nextOccurrence: new Date(),
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.recurringEvent
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/recurringEvents';
    let method = 'POST';

    if(props.recurringEvent?.id) {
      path = `/api/recurringEvents/${props.recurringEvent.id}`
      method = 'PATCH'
    }

    const result: any = await $fetch(path, {
      method: method as 'POST' | 'PATCH',
      body: JSON.stringify(event.data),
    })

    if (result.success) {
      showSuccessToast(result.message);
      emit('success', result.data)
    }
  } catch (e: any) {
    if (e.data) {
      showErrorToast(e.data.message)
    }
  }

  state.isLoadingSubmit = false;
}
</script>

<template>
  <u-card>
    <u-form :schema="schema" :state="state" @submit="onSubmitForm">
      <div class="mb-5">
        <h3 class="text-xl font-bold">Recurring Event Form</h3>
        <p class="text-sm text-muted-foreground">Enter recurring event information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="Subscription ID" name="subscriptionId" required>
          <u-input
              v-model.number="state.subscriptionId"
              type="number"
              placeholder="Enter subscription ID"
          />
        </u-form-group>
        <u-form-group label="Event Type" name="eventType" required>
          <u-input
              v-model="state.eventType"
              type="text"
              placeholder="Enter event type"
          />
        </u-form-group>
        <u-form-group label="Recurrence Rule" name="recurrenceRule" required>
          <u-input
              v-model="state.recurrenceRule"
              type="text"
              placeholder="Enter recurrence rule"
          />
        </u-form-group>
        <u-form-group label="Last Occurrence" name="lastOccurrence">
          <u-input
              v-model="state.lastOccurrence"
              type="date"
          />
        </u-form-group>
        <u-form-group label="Next Occurrence" name="nextOccurrence" required>
          <u-input
              v-model="state.nextOccurrence"
              type="date"
          />
        </u-form-group>
        <div class="flex items-center justify-end mt-4 gap-4">
          <u-button
              type="button"
              variant="ghost"
              @click="emit('close')"
          >
            Close
          </u-button>
          <u-button
              :class="{'opacity-50': state.isLoadingSubmit}"
              :disabled="state.isLoadingSubmit"
              :loading="state.isLoadingSubmit"
              type="submit"
          >
            Save
          </u-button>
        </div>
      </div>
    </u-form>
  </u-card>
</template>
