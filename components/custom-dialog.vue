<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  preventClose: {
    type: Boolean,
    default: false,
  },
  uiWidth: {
    type: String || undefined,
  },
  uiHeight: {
    type: String,
    default: ''
  }
})


const emit = defineEmits(['update:modelValue', 'open', 'close'])

watch(() => props.modelValue, (value) => {
  if (value) {
    emit('open')
  } else {
    emit('close')
  }
})

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [ props.modelValue ],
    handler: () => {
      emit('update:modelValue', false)
      emit('close')
    }
  }
})
</script>

<template>
  <slot name="activator" @click="emit('update:modelValue', !props.modelValue);" />
  <u-modal :model-value="props.modelValue" :persistent="true" :fullscreen="fullscreen" :prevent-close="preventClose"
    @update:model-value="emit('update:modelValue', $event)"
    :ui="{
        base: 'overflow-visible',
        width: props.uiWidth ?? 'w-full sm:max-w-lg',
        height: '',
    }">
    <slot name="body" />
  </u-modal>
</template>

<style scoped></style>
