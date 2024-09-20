<script setup lang="ts">
import {object, string, number, date, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {Subscription} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  subscription: {
    type: Object as PropType<Subscription | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  userId: number().required('User ID is required'),
  name: string().required('Name is required'),
  description: string().nullable(),
  price: number().required('Price is required'),
  currency: string().required('Currency is required'),
  billingCycle: string().required('Billing cycle is required'),
  billingDay: number().nullable(),
  startDate: date().required('Start date is required'),
  endDate: date().nullable(),
  nextBillingDate: date().required('Next billing date is required'),
  status: string().required('Status is required'),
  color: string().nullable(),
})

type Schema = InferType<typeof schema>

const state = reactive({
  userId: 0,
  name: '',
  description: null as string | null,
  price: 0,
  currency: '',
  billingCycle: '',
  billingDay: null as number | null,
  startDate: new Date(),
  endDate: null as Date | null,
  nextBillingDate: new Date(),
  status: 'active',
  color: null as string | null,
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.subscription
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/subscriptions';
    let method = 'POST';

    if(props.subscription?.id) {
      path = `/api/subscriptions/${props.subscription.id}`
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
        <h3 class="text-xl font-bold">Subscription Form</h3>
        <p class="text-sm text-muted-foreground">Enter subscription information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="User ID" name="userId" required>
          <u-input
              v-model.number="state.userId"
              type="number"
              placeholder="Enter user ID"
          />
        </u-form-group>
        <u-form-group label="Name" name="name" required>
          <u-input
              v-model="state.name"
              type="text"
              placeholder="Enter subscription name"
          />
        </u-form-group>
        <u-form-group label="Description" name="description">
          <u-textarea
              v-model="state.description"
              placeholder="Enter subscription description"
          />
        </u-form-group>
        <u-form-group label="Price" name="price" required>
          <u-input
              v-model.number="state.price"
              type="number"
              placeholder="Enter price"
          />
        </u-form-group>
        <u-form-group label="Currency" name="currency" required>
          <u-input
              v-model="state.currency"
              type="text"
              placeholder="Enter currency"
          />
        </u-form-group>
        <u-form-group label="Billing Cycle" name="billingCycle" required>
          <u-input
              v-model="state.billingCycle"
              type="text"
              placeholder="Enter billing cycle"
          />
        </u-form-group>
        <u-form-group label="Billing Day" name="billingDay">
          <u-input
              v-model.number="state.billingDay"
              type="number"
              placeholder="Enter billing day"
          />
        </u-form-group>
        <u-form-group label="Start Date" name="startDate" required>
          <u-input
              v-model="state.startDate"
              type="date"
          />
        </u-form-group>
        <u-form-group label="End Date" name="endDate">
          <u-input
              v-model="state.endDate"
              type="date"
          />
        </u-form-group>
        <u-form-group label="Next Billing Date" name="nextBillingDate" required>
          <u-input
              v-model="state.nextBillingDate"
              type="date"
          />
        </u-form-group>
        <u-form-group label="Status" name="status" required>
          <u-input
              v-model="state.status"
              type="text"
              placeholder="Enter status"
          />
        </u-form-group>
        <u-form-group label="Color" name="color">
          <u-input
              v-model="state.color"
              type="color"
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
