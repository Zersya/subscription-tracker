<script setup lang="ts">
import {object, string, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {Category} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  category: {
    type: Object as PropType<Category | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  name: string().required('Name is required'),
  color: string().nullable(),
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: '',
  color: null as string | null,
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.category
  if(value) {
    Object.assign(state, value)
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/categories';
    let method = 'POST';

    if(props.category?.id) {
      path = `/api/categories/${props.category.id}`
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
        <h3 class="text-xl font-bold">Category Form</h3>
        <p class="text-sm text-muted-foreground">Enter category information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="Name" name="name" required>
          <u-input
              v-model="state.name"
              type="text"
              placeholder="Enter category name"
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
