<template>
  <BaseWidget
      ref="widget"
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :i="i"
      :min-w="4"
      :min-h="2"
      :static="static"
      :is-editing="isEditing"
      :is-adding="isAdding"
      :idx="i"
      :title="title"
      @delete="$emit('delete', i)"
      @resized="resizeChart"
  >
    <PrimeChart
        ref="chart"
        :data="chartData"
        :options="chartOptions"
        type="bar"
        @loaded="resizeChart"
    />
  </BaseWidget>
</template>

<script setup lang="ts">
import { ref, nextTick, type VNodeRef } from "vue";
import BaseWidget from "@/components/widgets/BaseWidget.vue";
import { type LayoutItem } from "grid-layout-plus";
import { type BaseWidgetType } from "@/types";

defineProps<BaseWidgetType & LayoutItem>()

const chart = ref<VNodeRef | null>(null)
const widget = ref<VNodeRef | null>(null)

async function resizeChart() {
  await nextTick()
  if (chart.value && widget.value) {
    const canvas = chart.value.$el.getElementsByTagName('canvas')[0]
    const widgetEl = widget.value.$el
    const titleEl = widgetEl.getElementsByTagName('h3')[0]
    canvas.style.height = widgetEl.offsetHeight - 20 - titleEl.offsetHeight - 2 + 'px'
  }
}

const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Sales',
      data: [540, 325, 702, 620],
      backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'],
      borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
      borderWidth: 1
    }
  ]
})

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--p-text-color');
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder
      }
    }
  }
})
</script>

<style scoped>

</style>
