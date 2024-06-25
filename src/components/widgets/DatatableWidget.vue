<template>
  <BaseWidget
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :i="i"
      :static="static"
      :min-w="6"
      :min-h="2"
      :is-editing="isEditing"
      :is-adding="isAdding"
      :idx="i"
      :title="title"
      @delete="$emit('delete', i)"
  >
    <PrimeDatatable :value="products" tableStyle="width: 100%">
      <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></PrimeColumn>
    </PrimeDatatable>
  </BaseWidget>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseWidget from "@/components/widgets/BaseWidget.vue";
import { LayoutItem } from "grid-layout-plus";
import { BaseWidgetType } from "@/types";

defineProps<BaseWidgetType & LayoutItem>()

const columns = ref([
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' }
])

const products = ref([
  {
    id: '1001',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1002',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1003',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1004',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }
])
</script>

<style scoped>

</style>
