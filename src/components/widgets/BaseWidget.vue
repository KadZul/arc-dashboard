<template>
  <div
      ref="widgetEl"
      :spellcheck="!editable"
      :contenteditable="editable"
      :class="{ 'widget--editing': isEditing }"
      class="widget"
      @keydown.enter="onContentEdit"
  >
    <slot v-if="!isAdding">
      {{ value }}
    </slot>
    <div v-if="isEditing && !editable" class="widget__edit">
      <PrimeButton
          v-if="isAdding"
          icon="pi pi-plus-circle"
          severity="success"
          rounded
          @click="$emit('add')"
      />
      <PrimeButton
          v-if="!isAdding"
          icon="pi pi-pencil"
          severity="info"
          rounded
          @click="editable = true"
      />
      <PrimeButton
          v-if="!isAdding"
          icon="pi pi-times-circle"
          severity="danger"
          rounded
          @click="$emit('delete', idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  isEditing?: boolean,
  isAdding?: boolean,
  idx?: string | number,
}>()

defineEmits(['delete', 'add'])

const value = ref('')
const editable = ref(false)
const widgetEl = ref(null)
function onContentEdit(event: Event) {
  (event.target as HTMLInputElement).blur()
  const widgetElHtml = widgetEl.value as unknown as HTMLElement
  value.value = widgetElHtml.innerText.trim()
  editable.value = false
}
</script>

<style lang="scss" scoped>
.widget {
  user-select: none;
  cursor: default;
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(159, 158, 158, 0.56);
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);

  &--editing {
    border-style: dashed;
    cursor: auto;
    user-select: auto;
  }

  &__edit {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffffa3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
}
</style>
