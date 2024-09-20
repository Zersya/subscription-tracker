<script setup lang="ts">
import {object, string, type InferType} from "yup";
import type {FormSubmitEvent} from "#ui/types";
import {showErrorToast, showSuccessToast} from "~/utils/functions";
import type {User} from "~/server/utils/drizzle";
import type {ResponseData} from "~~/server/utils/handleResponseAPI";

const props = defineProps({
  user: {
    type: Object as PropType<User | undefined>,
  },
})

const emit = defineEmits(['success', 'close'])

const schema = object({
  name: string().required('Name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  avatar: string().nullable(),
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: '',
  email: '',
  password: '',
  avatar: null as string | null,
  isLoadingSubmit: false
})

onMounted(() => {
  const value = props.user
  if(value) {
    state.name = value.name
    state.email = value.email
    state.avatar = value.avatar
  }
})

async function onSubmitForm(event: FormSubmitEvent<Schema>) {
  state.isLoadingSubmit = true;

  try {
    let path = '/api/users';
    let method = 'POST';

    if(props.user?.id) {
      path = `/api/users/${props.user.id}`
      method = 'PATCH'
    }

    const result: any = await $fetch(path, {
      method: method as 'POST' | 'PATCH',
      body: JSON.stringify({
        name: event.data.name,
        email: event.data.email,
        password: event.data.password,
        avatar: event.data.avatar,
      }),
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
        <h3 class="text-xl font-bold">User Form</h3>
        <p class="text-sm text-muted-foreground">Enter user information</p>
      </div>
      <div class="flex flex-col gap-4">
        <u-form-group label="Name" name="name" required>
          <u-input
              v-model="state.name"
              icon="i-heroicons-user-solid"
              type="text"
              placeholder="Enter user name"
          />
        </u-form-group>
        <u-form-group label="Email" name="email" required>
          <u-input
              v-model="state.email"
              icon="i-heroicons-envelope-solid"
              type="email"
              placeholder="Enter user email"
          />
        </u-form-group>
        <u-form-group label="Password" name="password" required>
          <u-input
              v-model="state.password"
              icon="i-heroicons-lock-closed-solid"
              type="password"
              placeholder="Enter user password"
          />
        </u-form-group>
        <u-form-group label="Avatar" name="avatar">
          <u-input
              v-model="state.avatar"
              icon="i-heroicons-photo-solid"
              type="text"
              placeholder="Enter avatar URL"
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
