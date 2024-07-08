<template>
  <header style="margin-bottom: 50px">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>
    </Menubar>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script setup>
import Menubar from "primevue/menubar";
import { ref } from "vue"

const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-objects-column',
    route: '/',
  },
  {
    label: 'Calendar',
    icon: 'pi pi-calendar',
    route: '/calendar',
  },
  {
    label: 'Schedule calendar',
    icon: 'pi pi-calendar-clock',
    route: '/schedule-calendar',
  },
])
</script>

<style lang="scss" scoped>

</style>
