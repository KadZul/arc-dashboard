<template>
  <div>
    <QCalendar
        v-model="selectedDate"
        v-model:model-resources="resources"
        :day-min-height="70"
        :day-height="0"
        resource-key="id"
        resource-label="name"
        mode="scheduler"
        view="week"
        animated
        bordered
        focusable
        hoverable
        no-active-date
    >
      <template #resource-days="{ scope }">
        <template
            v-for="(event, index) in getEvents(scope)"
            :key="index"
        >
          <q-badge
              outline
              color="primary"
              :label="event.title"
              :style="getStyle(event)"
          />
        </template>
      </template>
    </QCalendar>
  </div>
</template>

<script setup lang="ts">
import { QCalendar } from "@quasar/quasar-ui-qcalendar";
import { ref, reactive } from "vue";

import {
  today,
} from '@quasar/quasar-ui-qcalendar/src/index.js'

const selectedDate = ref(today())

let events = ref({
  1: [ // John
    { dow: 1, title: 'Gym' },
    { dow: 3, title: 'Meeting: Olivia' },
    { dow: 4, title: 'Training', range: 2 }
  ],
      2: [ // Board room
      ],
      2.1: [ // Room-1
      { dow: 2, title: 'Board Meeting', range: 2 }
      ],
      2.2: [ // Room-2

  ],
      '2.2.1': [ // Partition-A
    { dow: 4, title: 'Corporate Training', range: 2 }
  ],
      '2.2.2': [ // Partition-B

  ],
      '2.2.3': [ // Partition-C

  ],
      3: [ // Mary
    { dow: 4, title: 'Corporate Training', range: 2 }
    // { start: '12:00', title: 'Lunch', duration: 60 }
  ],
      4: [ // Susan
    { dow: 4, title: 'Corporate Training', range: 2 }
    // { start: '12:00', title: 'Lunch', duration: 60 }
  ],
      5: [ // Olivia
    { dow: 4, title: 'Corporate Training', range: 2 },
    { dow: 3, title: 'Meeting: John' }
  ]
})

const resources = reactive([
  { id: '1', name: 'John' },
  {
    id: '2',
    name: 'Board Room',
    expanded: false,
    children: [
      { id: '2.1', name: 'Room-1' },
      {
        id: '2.2',
        name: 'Room-2',
        expanded: false,
        children: [
          { id: '2.2.1', name: 'Partition-A' },
          { id: '2.2.2', name: 'Partition-B' },
          { id: '2.2.3', name: 'Partition-C' }
        ]
      }
    ]
  },
  { id: '3', name: 'Mary' },
  { id: '4', name: 'Susan' },
  { id: '5', name: 'Olivia' }
])

type CalendarItems = { left: string, width: string, title: string }[]
function getEvents (scope): { left: string, width: string, title: string }[] {
  const formattedEvents: CalendarItems = []
  if (events.value[ scope.resource.id ]) {
    // get events for the specified resource
    const resourceEvents = events.value[ scope.resource.id ]
    // make sure we have events
    if (resourceEvents && resourceEvents.length > 0) {
      // for each event figure out start position and width
      for (let x = 0; x < resourceEvents.length; ++x) {
        formattedEvents.push({
          left: getLeft(scope, resourceEvents[ x ]),
          width: getWidth(scope, resourceEvents[ x ]),
          title: resourceEvents[ x ].title
        })
      }
    }
  }
  return formattedEvents
}

function getStyle (event) {
  return {
    position: 'absolute',
    background: 'white',
    left: event.left,
    width: event.width
  }
}

function getLeft (scope, event) {
  const left = event.dow * parseFloat(scope.cellWidth)
  const val = left + (scope.cellWidth.endsWith('%') ? '%' : 'px')
  return val
}

function getWidth (scope, event) {
  const width = (event.range ? event.range : 1) * parseFloat(scope.cellWidth)
  const val = width + (scope.cellWidth.endsWith('%') ? '%' : 'px')
  return val
}

</script>

<style lang="scss" scoped>
.my-resource-header {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 14px;
  font-weight: 700;
}
</style>
