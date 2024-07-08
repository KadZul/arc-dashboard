import { createRouter, createWebHistory } from "vue-router"
import DashboardView from "@/views/DashboardView.vue"
import CalendarView from "@/views/CalendarView.vue"
import ScheduleCalendarView from "@/views/ScheduleCalendarView.vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: "/",
          name: "dashboard",
          component: DashboardView,
        },
        {
          path: "/calendar",
          name: "calendar",
          component: CalendarView,
        },
        {
          path: "/schedule-calendar",
          name: "schedule-calendar",
          component: ScheduleCalendarView,
        }
      ],
    },
  ],
});

export default router;
