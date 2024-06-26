<template>
  <div class="dashboard__top">
    <span>Dashboard</span>
    <PrimeButton
        :label="isEditing ? null : 'Edit'"
        :icon="isEditing ? 'pi pi-times' : 'pi pi-pencil'"
        :rounded="isEditing"
        @click="onEditClick"
    />
  </div>
  <hr />
  <GridLayout
      v-model:layout="layout"
      :row-height="150"
      :margin="[10, 10]"
      :is-draggable="isEditing"
      :is-resizable="isEditing"
  >
    <template
        v-for="widget of layout"
        :key="widget.i"
    >
      <component
          v-bind="getWidgetBind(widget)"
          :is="widget.options.component"
          @delete="deleteWidgetByIdx"
          @add="onWidgetAdd"
      />
    </template>
  </GridLayout>
  <PrimeDialog
      v-model:visible="dialogVisible"
      :style="{ width: '80vw' }"
      modal
      header="Select widget"
  >
    <GridLayout
        v-model:layout="selectLayout"
        :row-height="150"
        :margin="[10, 10]"
        :is-draggable="false"
        :is-resizable="false"
    >
      <template v-for="widget of selectLayout" :key="widget.i">
        <component
            v-bind="getListWidgetBind(widget)"
            :is="widget.options.component"
            @click="addNewWidget(widget)"
        />
      </template>
    </GridLayout>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { GridLayout } from "grid-layout-plus"
import { ref, shallowReactive } from "vue"
import { WidgetsGridType, WidgetsItemType } from "@/types"

import BaseWidget from "@/components/widgets/BaseWidget.vue"
import ChartWidget from "@/components/widgets/ChartWidget.vue"
import DatatableWidget from "@/components/widgets/DatatableWidget.vue"

let index = 2
const colNum = ref(12)
const isEditing = ref(false)
const dialogVisible = ref(false)

const selectLayout = shallowReactive<WidgetsGridType>([
  {
    x: 0, y: 0, w: 4, h: 2, i: "0",
    options: { component: ChartWidget },
    props: { title: 'Chart bar widget', type: 'bar' }
  },
  {
    x: 4, y: 0, w: 4, h: 2, i: "1",
    options: { component: ChartWidget },
    props: { title: 'Chart doughnut widget', type: 'doughnut' }
  },
  {
    x: 8, y: 0, w: 4, h: 2, i: "2",
    options: { component: ChartWidget },
    props: { title: 'Chart line widget', type: 'line' }
  },
  {
    x: 0, y: 2, w: 4, h: 2, i: "3",
    options: { component: DatatableWidget },
    props: { title: 'Datatable Widget' }
  },
  {
    x: 4, y: 2, w: 4, h: 2, i: "4",
    options: { component: BaseWidget },
    props: { title: 'Lorem Ipsum widget' }
  },
])

const layout = shallowReactive<WidgetsGridType>([
  {
    x: 0, y: 0, w: 6, h: 2, i: "0",
    options: { component: ChartWidget },
    props: { title: 'Chart bar widget', type: 'bar' }
  },
  {
    x: 6, y: 0, w: 6, h: 2, i: "1",
    options: { component: DatatableWidget },
    props: { title: 'Datatable Widget' }
  }
])

function onWidgetAdd() {
  dialogVisible.value = true
}

function getWidgetBind(widget: WidgetsItemType) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { props, options, ...params } = widget

  return {
    ...params,
    ...props,
    isEditing: isEditing.value,
    idx: widget.i,
    isAdding: widget.options.isAdd
  }
}

function getListWidgetBind(widget: WidgetsItemType) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { props, options, ...params } = widget

  return { ...props, ...params }
}

function addNewWidget(widget: WidgetsItemType) {
  const addingWidgetIdx = layout.findIndex(item => !!item.options.isAdd)

  if (~addingWidgetIdx) {
    layout.splice(addingWidgetIdx, 1, {
      ...layout[addingWidgetIdx],
      options: widget.options,
      props: widget.props
    })
    addWidgetAdding()
    dialogVisible.value = false
  }
}

function onEditClick() {
  isEditing.value = !isEditing.value
  const addingWidget = layout.find(item => !!item.options.isAdd)

  if (isEditing.value) {
    if (!addingWidget) {
      addWidgetAdding()
    }
  } else {
    if (addingWidget) {
      deleteWidgetByIdx(addingWidget.i)
    }
  }
}

function addWidgetAdding() {
  layout.push({
    x: (layout.length * 4) % (colNum.value || 12),
    y: layout.length + (colNum.value || 12),
    w: 4,
    h: 2,
    i: `${index++}`,
    options: { component: BaseWidget, isAdd: true },
    props: { title: '' }
  })
}

function deleteWidgetByIdx(idx: number | string | unknown) {
  const targetWidgetIdx = layout.findIndex(({ i }) => i === `${idx}`)

  if (~targetWidgetIdx) {
    layout.splice(targetWidgetIdx, 1)
  }
}

</script>

<style lang="scss" scoped>
.dashboard__top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;

  span {
    font-size: 22px;
    font-weight: 800;
    align-self: center;
    text-transform: uppercase;
  }
}

hr {
  margin-bottom: 10px;
}
</style>
