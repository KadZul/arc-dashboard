<template>
  <GridItem
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :i="i"
      :static="static"
      :min-w="minW"
      :min-h="minH"
      :max-w="maxW"
      :max-h="maxH"
      @resized="(params: Record<string, string & number>) => $emit('resized', params)"
  >
    <div
        :class="{ 'widget--editing': isEditing }"
        class="widget"
    >
      <h3 v-if="title">{{ title }}</h3>
      <slot v-if="!isAdding">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
            disabled
            @click="$emit('edit', idx)"
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
  </GridItem>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type BaseWidgetType } from "@/types";
import { type LayoutItem } from "grid-layout-plus";

defineProps<BaseWidgetType & LayoutItem & { onClick?: any }>()

defineEmits(['edit', 'delete', 'add', 'resized'])

const editable = ref(false)
</script>

<style lang="scss" scoped>
.widget {
  overflow: scroll;
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
    overflow: hidden;
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

  h3 {
    margin-bottom: 10px;
  }
}
</style>
