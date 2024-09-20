<script setup lang="ts">
import {object, number, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {SubscriptionCategory} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  subscriptionCategory: {
    type: Object as PropType<SubscriptionCategory | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  subscriptionId: number().required('Subscription ID is required'),
  categoryId: number().required('Category ID is required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  subscriptionId: 0,
  categoryId: 0,
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.subscriptionCategory
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    const path = '/api/subscriptionCategories';
    const method = 'POST';

    const result: any = await $fetch(path, {
      method,
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
        <h3 class="text-xl font-bold">Subscription Category Form</h3>
        <p class="text-sm text-muted-foreground">Enter subscription category information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="Subscription ID" name="subscriptionId" required>
          <u-input
              v-model.number="state.subscriptionId"
              type="number"
              placeholder="Enter subscription ID"
          />
        </u-form-group>
        <u-form-group label="Category ID" name="categoryId" required>
          <u-input
              v-model.number="state.categoryId"
              type="number"
              placeholder="Enter category ID"
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
