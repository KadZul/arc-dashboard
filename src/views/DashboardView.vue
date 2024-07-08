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
      :is-resizable="false"
  >
    <GridItem
        v-for="widget of layout"
        :key="widget.i"
        :x="widget.x"
        :y="widget.y"
        :w="widget.w"
        :h="widget.h"
        :i="widget.i"
    >
      <!-- @vue-skip -->
      <component
          v-bind="{ isEditing, idx: widget.i, isAdding: widget.isAdd }"
          :is="widget.component"
          @delete="deleteWidgetByIdx"
          @add="onWidgetAdd"
      >
        {{ widget.i }}
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at
        its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
        opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
        packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
        will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).
      </component>
    </GridItem>
  </GridLayout>
  <PrimeDialog
      v-model:visible="dialogVisible"
      :style="{ width: '80vw' }"
      modal
      header="Select widget"
  >
    <span style="font-weight: 600">lorem ipsum widget</span>
    <div>
      <!-- @vue-skip -->
      <BaseWidget @click="addNewWidget">
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at
        its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
        opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
        packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
        will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).
      </BaseWidget>
    </div>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { GridItem, GridLayout } from "grid-layout-plus";
import { ref, shallowRef, shallowReactive } from "vue";
import BaseWidget from "../components/widgets/BaseWidget.vue"

let index = 3
const colNum = ref(12)
const isEditing = ref(false)
const dialogVisible = ref(false)

const layout = shallowReactive([
  {x: 0, y: 0, w: 4, h: 2, i: "0", component: BaseWidget, isAdd: false},
  {x: 4, y: 0, w: 4, h: 2, i: "1", component: BaseWidget, isAdd: false},
  {x: 8, y: 0, w: 4, h: 2, i: "2", component: BaseWidget, isAdd: false},
])

function onWidgetAdd() {
  dialogVisible.value = true
}

function addNewWidget() {
  const addingWidgetIdx = layout.findIndex(({ isAdd }) => isAdd)

  if (~addingWidgetIdx) {
    layout.splice(addingWidgetIdx, 1, {
      ...layout[addingWidgetIdx],
      isAdd: false,
      component: BaseWidget,
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
  })
}

function deleteWidgetAdding() {
  const addingWidget = layout.find(({ isAdd }) => isAdd)

  if (addingWidget) {
    deleteWidgetByIdx(addingWidget.i)
  }
}

function deleteWidgetByIdx(idx: number | string) {
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
    font-weight: 800;
  }
}

hr {
  margin-bottom: 10px;
}
</style>
