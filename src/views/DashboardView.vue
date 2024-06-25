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
          v-bind="{ ...widget, isEditing, idx: widget.i, isAdding: widget.isAdd }"
          :is="widget.component"
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
        <component v-bind="widget" :is="widget.component" @click="addNewWidget(widget)" />
      </template>
    </GridLayout>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { GridLayout } from "grid-layout-plus";
import { type Component, ref, shallowReactive } from "vue";
import BaseWidget from "../components/widgets/BaseWidget.vue"
import ChartWidget from "@/components/widgets/ChartWidget.vue";
import DatatableWidget from "@/components/widgets/DatatableWidget.vue";

let index = 3
const colNum = ref(12)
const isEditing = ref(false)
const dialogVisible = ref(false)

const selectLayout = shallowReactive([
  {x: 0, y: 0, w: 4, h: 2, i: "0", component: ChartWidget, title: 'Chart widget'},
  {x: 4, y: 0, w: 4, h: 2, i: "1", component: DatatableWidget, title: 'Datatable Widget'},
  {x: 8, y: 0, w: 4, h: 2, i: "2", component: BaseWidget, title: 'Lorem Ipsum widget'},
])
const layout = shallowReactive([
  {x: 0, y: 0, w: 6, h: 2, i: "0", component: ChartWidget, isAdd: false, title: 'Chart widget'},
  {x: 6, y: 0, w: 6, h: 2, i: "1", component: DatatableWidget, isAdd: false, title: 'Datatable Widget'},
  {x: 0, y: 2, w: 4, h: 2, i: "2", component: BaseWidget, isAdd: false, title: 'Lorem Ipsum widget'},
])

function onWidgetAdd() {
  dialogVisible.value = true
}

function addNewWidget(widget) {
  const addingWidgetIdx = layout.findIndex(({ isAdd }) => isAdd)

  if (~addingWidgetIdx) {
    layout.splice(addingWidgetIdx, 1, {
      ...layout[addingWidgetIdx],
      component: widget.component,
      title: widget.title,
      isAdd: false,
    })
    addWidgetAdding()
    dialogVisible.value = false
  }
}

function onEditClick() {
  isEditing.value = !isEditing.value
  const hasAdding = layout.find(({ isAdd }) => isAdd)

  if (isEditing.value) {
    if (!hasAdding) {
      addWidgetAdding()
    }
  } else {
    if (hasAdding) {
      deleteWidgetAdding()
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
    component: BaseWidget,
    isAdd: true,
    title: '',
  })
}

function deleteWidgetAdding() {
  const addingWidget = layout.find(({ isAdd }) => isAdd)

  if (addingWidget) {
    deleteWidgetByIdx(addingWidget.i)
  }
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
