<script setup lang="ts">
import {object, number, string, date, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {Payment} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  payment: {
    type: Object as PropType<Payment | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  subscriptionId: number().required('Subscription ID is required'),
  amount: number().required('Amount is required'),
  currency: string().required('Currency is required'),
  paymentDate: date().required('Payment date is required'),
  status: string().oneOf(['success', 'failed', 'pending']).required('Status is required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  subscriptionId: 0,
  amount: 0,
  currency: '',
  paymentDate: new Date(),
  status: 'pending' as 'success' | 'failed' | 'pending',
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.payment
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/payments';
    let method = 'POST';

    if(props.payment?.id) {
      path = `/api/payments/${props.payment.id}`
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
        <h3 class="text-xl font-bold">Payment Form</h3>
        <p class="text-sm text-muted-foreground">Enter payment information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="Subscription ID" name="subscriptionId" required>
          <u-input
              v-model.number="state.subscriptionId"
              type="number"
              placeholder="Enter subscription ID"
          />
        </u-form-group>
        <u-form-group label="Amount" name="amount" required>
          <u-input
              v-model.number="state.amount"
              type="number"
              placeholder="Enter amount"
          />
        </u-form-group>
        <u-form-group label="Currency" name="currency" required>
          <u-input
              v-model="state.currency"
              type="text"
              placeholder="Enter currency"
          />
        </u-form-group>
        <u-form-group label="Payment Date" name="paymentDate" required>
          <u-input
              v-model="state.paymentDate"
              type="date"
          />
        </u-form-group>
        <u-form-group label="Status" name="status" required>
          <u-select v-model="state.status">
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </u-select>
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
