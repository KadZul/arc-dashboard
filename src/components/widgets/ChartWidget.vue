<template>
  <BaseWidget
      ref="widget"
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :i="i"
      :min-w="5"
      :min-h="2"
      :static="static"
      :is-editing="isEditing"
      :is-adding="isAdding"
      :idx="i"
      :title="title"
      @delete="$emit('delete', i)"
      @resized="resizeChart"
  >
    <div :class="chartWrapperClasses" class="chart-widget">
      <PrimeChart
          ref="chart"
          :data="chartData"
          :options="chartOptions"
          :type="type"
          :plugins="[htmlLegendPlugin, doughnutTotalTextPlugin]"
          @loaded="resizeChart"
      />
      <div v-if="isDoughnut" :id="`widget-legend-${uuid}`"></div>
    </div>
  </BaseWidget>
</template>

<script setup lang="ts">
import { ref, nextTick, type VNodeRef, computed, getCurrentInstance } from "vue";
import { type LayoutItem } from "grid-layout-plus";
import { type BaseWidgetType } from "@/types";
import { htmlLegendPlugin, doughnutTotalTextPlugin } from "@/plugins/ChartPlugins";
import BaseWidget from "@/components/widgets/BaseWidget.vue";

const instance = getCurrentInstance()

type chartProps = {
  type: string
}

const props = defineProps<BaseWidgetType & LayoutItem & chartProps>()

const chart = ref<VNodeRef | null>(null)
const widget = ref<VNodeRef | null>(null)
const uuid = ref(instance?.uid || 0)

const isDoughnut = computed(() => props.type === 'doughnut')
const chartWrapperClasses = computed(() => {
  return {
    'chart-widget--custom-legend': isDoughnut.value
  }
})

async function resizeChart() {
  await nextTick()
  if (chart.value && widget.value) {
    const canvas = chart.value.$el.getElementsByTagName('canvas')[0]
    const widgetEl = widget.value.$el
    const titleEl = widgetEl.getElementsByTagName('h3')[0]
    canvas.style.height = widgetEl.offsetHeight - 30 - titleEl.offsetHeight - 2 + 'px'
  }
}

const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Sales',
      data: [540, 325, 702, 620],
      backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(143,102,238,0.2)'],
      borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(140,106,217)'],
      borderWidth: 1
    }
  ]
})

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--p-text-color');
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

const chartOptionsSchema = {
  doughnut: {
    cutout: '80%',
    spacing: 10,
    arcBorderColor: 'white',
    plugins: {
      htmlLegend: {
        container: `widget-legend-${uuid.value}`
      },
      legend: {
        display: false
      }
    }
  },
  line: {
    stacked: false,
    aspectRatio: 0.6,
    plugins: {
      htmlLegend: false,
      doughnutTotalTextPlugin: false,
      legend: {
        labels: {
          color: textColor
        }
      }
    },
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
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: textColorSecondary
        },
        grid: {
          drawOnChartArea: false,
          color: surfaceBorder
        }
      }
    }
  },
  bar: {
    plugins: {
      htmlLegend: false,
      doughnutTotalTextPlugin: false,
      legend: {
        labels: {
          color: textColor
        }
      }
    },
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
  }
}

const chartOptions = ref({
  ...(chartOptionsSchema[props.type]),
  maintainAspectRatio: false,
})
</script>

<style lang="scss" scoped>
.chart-widget {
  &--custom-legend {
    display: grid;
    grid-template-columns: min-content auto;
  }
}
</style>
