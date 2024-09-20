<script setup lang="ts">
import {object, number, string, boolean, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {Notification} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  notification: {
    type: Object as PropType<Notification | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  userId: number().required('User ID is required'),
  subscriptionId: number().nullable(),
  type: string().required('Type is required'),
  message: string().required('Message is required'),
  isRead: boolean().required('Is Read is required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  userId: 0,
  subscriptionId: null as number | null,
  type: '',
  message: '',
  isRead: false,
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.notification
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/notifications';
    let method = 'POST';

    if(props.notification?.id) {
      path = `/api/notifications/${props.notification.id}`
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
        <h3 class="text-xl font-bold">Notification Form</h3>
        <p class="text-sm text-muted-foreground">Enter notification information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="User ID" name="userId" required>
          <u-input
              v-model.number="state.userId"
              type="number"
              placeholder="Enter user ID"
          />
        </u-form-group>
        <u-form-group label="Subscription ID" name="subscriptionId">
          <u-input
              v-model.number="state.subscriptionId"
              type="number"
              placeholder="Enter subscription ID"
          />
        </u-form-group>
        <u-form-group label="Type" name="type" required>
          <u-input
              v-model="state.type"
              type="text"
              placeholder="Enter notification type"
          />
        </u-form-group>
        <u-form-group label="Message" name="message" required>
          <u-textarea
              v-model="state.message"
              placeholder="Enter notification message"
          />
        </u-form-group>
        <u-form-group label="Is Read" name="isRead" required>
          <u-checkbox v-model="state.isRead">
            Mark as read
          </u-checkbox>
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
