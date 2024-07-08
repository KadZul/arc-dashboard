<template>
  <div>
    <QCalendar
        v-model="selectedDate"
        :day-min-height="70"
        :day-height="0"
        mode="month"
        view="day"
        animated
        bordered
        focusable
        hoverable
        no-active-date
    >
      <template #week="{ scope: { week, weekdays } }">
        <template
            v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
            :key="index"
        >
          <div
              :class="badgeClasses(computedEvent)"
              :style="badgeStyles(computedEvent, week.length)"
          >
            <div
                v-if="computedEvent.event && computedEvent.event.details"
                v-tooltip="computedEvent.event.details"
                class="title q-calendar__ellipsis"
            >
              {{ computedEvent.event.title + (computedEvent.event.time ? ' - ' + computedEvent.event.time : '') }}
            </div>
          </div>
        </template>
      </template>
    </QCalendar>
  </div>
</template>

<script setup lang="ts">
import { QCalendar } from "@quasar/quasar-ui-qcalendar";
import { ref } from "vue";

import {
  daysBetween,
  isOverlappingDates,
  parsed,
  parseDate,
  indexOf,
  today,
} from '@quasar/quasar-ui-qcalendar/src/index.js'

const selectedDate = ref(today())
const CURRENT_DAY = new Date()

type CalendarEvent = {
  id: number,
  title: string,
  details: string,
  start: string,
  end: string,
  bgcolor: string,
  time?: string
}

let events = ref([
  {
    id: 1,
    title: '1st of the Month',
    details: 'Everything is funny as long as it is happening to someone else',
    start: getCurrentDay(1),
    end: getCurrentDay(1),
    bgcolor: 'orange'
  },
  {
    id: 2,
    title: 'Sisters Birthday',
    details: 'Buy a nice present',
    start: getCurrentDay(4),
    end: getCurrentDay(4),
    bgcolor: 'green',
    icon: 'fas fa-birthday-cake'
  },
  {
    id: 3,
    title: 'Meeting',
    details: 'Time to pitch my idea to the company',
    start: getCurrentDay(10),
    end: getCurrentDay(10),
    time: '10:00',
    duration: 120,
    bgcolor: 'red',
    icon: 'fas fa-handshake'
  },
  {
    id: 4,
    title: 'Lunch',
    details: 'Company is paying!',
    start: getCurrentDay(10),
    end: getCurrentDay(10),
    time: '11:30',
    duration: 90,
    bgcolor: 'teal',
    icon: 'fas fa-hamburger'
  },
  {
    id: 5,
    title: 'Visit mom',
    details: 'Always a nice chat with mom',
    start: getCurrentDay(20),
    end: getCurrentDay(20),
    time: '17:00',
    duration: 90,
    bgcolor: 'grey',
    icon: 'fas fa-car'
  },
  {
    id: 6,
    title: 'Conference',
    details: 'Teaching Javascript 101',
    start: getCurrentDay(22),
    end: getCurrentDay(22),
    time: '08:00',
    duration: 540,
    bgcolor: 'blue',
    icon: 'fas fa-chalkboard-teacher'
  },
  {
    id: 7,
    title: 'Girlfriend',
    details: 'Meet GF for dinner at Swanky Restaurant',
    start: getCurrentDay(22),
    end: getCurrentDay(22),
    time: '19:00',
    duration: 180,
    bgcolor: 'teal',
    icon: 'fas fa-utensils'
  },
  {
    id: 8,
    title: 'Rowing',
    details: 'Stay in shape!',
    start: getCurrentDay(27),
    end: getCurrentDay(28),
    bgcolor: 'purple',
    icon: 'rowing'
  },
  {
    id: 9,
    title: 'Fishing',
    details: 'Time for some weekend R&R',
    start: getCurrentDay(22),
    end: getCurrentDay(29),
    bgcolor: 'purple',
    icon: 'fas fa-fish'
  },
  {
    id: 10,
    title: 'Vacation',
    details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
    start: getCurrentDay(22),
    end: getCurrentDay(29),
    bgcolor: 'purple',
    icon: 'fas fa-plane'
  }
])

type WeekEvent = { time?: string, id: number, left: number, right: number, size: number, event: CalendarEvent }
type WeekEvents = WeekEvent[]
const getWeekEvents = (week, weekdays): WeekEvents => {
  const firstDay = parsed(week[0].date + ' 00:00')
  const lastDay = parsed(week[week.length - 1].date + ' 23:59')
  const eventsWeek: WeekEvent[] = []
  const sortedEventsWeek = []

  events.value.forEach((event, id) => {
    const startDate = parsed(event.start + ' 00:00')
    const endDate = parsed(event.end + ' 23:59')

    if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
      const left = daysBetween(firstDay, startDate, true)
      const right = daysBetween(endDate, lastDay, true)

      eventsWeek.push({
        id, // index event
        left, // Position initial day [0-6]
        right, // Number days available
        size: week.length - (left + right), // Size current event (in days)
        event // Info
      })
    }
  })

  if (eventsWeek.length > 0) {
    const infoWeek = eventsWeek.sort((a: { left: number }, b: { left: number }) => a.left - b.left)
    infoWeek.forEach((_, i) => {
      insertEvent(sortedEventsWeek, week.length, infoWeek, i, 0, 0)
    })
  }

  return sortedEventsWeek
}

function insertEvent(events, weekLength, infoWeek, index, availableDays, level) {
  const iEvent = infoWeek[ index ]

  if (iEvent !== undefined && iEvent.left >= availableDays) {
    // If you have space available, more events are placed
    if (iEvent.left - availableDays) {
      // It is filled with empty events
      events.push({ size: iEvent.left - availableDays })
    }
    // The event is built
    events.push({ size: iEvent.size, event: iEvent.event })

    if (level !== 0) {
      // If it goes into recursion, then the item is deleted
      infoWeek.splice(index, 1)
    }

    const currentAvailableDays = iEvent.left + iEvent.size

    if (currentAvailableDays < weekLength) {
      const indexNextEvent = indexOf(infoWeek, e => e.id !== iEvent.id && e.left >= currentAvailableDays)

      insertEvent(
          events,
          weekLength,
          infoWeek,
          indexNextEvent !== -1 ? indexNextEvent : index,
          currentAvailableDays,
          level + 1
      )
    } // else: There are no more days available, end of iteration
  }
  else {
    events.push({ size: weekLength - availableDays })
    // end of iteration
  }
}

function badgeClasses(computedEvent) {
  if (computedEvent.event !== undefined) {
    return {
      'my-event': true,
      'text-white': true,
      [ `bg-${ computedEvent.event.bgcolor }` ]: true,
      'rounded-border': true,
      'q-calendar__ellipsis': true
    }
  }
  return {
    'my-void-event': true
  }
}

function badgeStyles(computedEvent, weekLength) {
  const s: { width?: string } = {}
  if (computedEvent.size !== undefined) {
    s.width = ((100 / weekLength) * computedEvent.size) + '%'
  }
  return s
}

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

</script>

<style lang="scss" scoped>
@import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
@import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
@import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';

.my-event {
  position: relative;
  display: inline-flex;
  white-space: nowrap;
  font-size: 12px;
  height: 16px;
  max-height: 16px;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.my-void-event {
  display: inline-flex;
  white-space: nowrap;
  height: 1px;
}
.text-white {
  color: white;
}
.bg-blue {
  background: blue;
}
.bg-green {
  background: green;
}
.bg-orange {
  background: orange;
}
.bg-red {
  background: red;
}
.bg-teal {
  background: teal;
}
.bg-grey {
  background: grey;
}
.bg-purple {
  background: purple;
}
.rounded-border {
  border-radius: 2px;
}
</style>
