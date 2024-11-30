<script setup lang="ts">
import type IRoute from 'src/types/IRoute';
import ProgressRound from './components/ProgressRound.vue';
import { storeSites } from '@renderer/stores/storeSites'
import { onMounted } from 'vue'
import { storeProgress } from '@renderer/stores/storeProgress'

const storeProgressProperty = storeProgress();
const storeSitePropertys = storeSites();
const routes:IRoute[] = [
  {
    icon: 'solar:home-2-bold',
    pathname: 'Home',
    to: { name: 'home' }
  },
  {
    icon: 'solar:folder-with-files-bold',
    pathname: 'Baixados',
    to: { name: 'baixados' }
  }
];

onMounted(async () => {
  await storeSitePropertys.getAllSites();
  storeProgressProperty.observableProgress();
})

</script>

<template>
  <div class="app">
    <header>
      <nav class="navigation">
        <ul>
          <li v-for="route in routes" :key="route.pathname">
            <RouterLink :class="`nav-link ${$route.path === route.to ? 'active' : ''}`" :to="route.to" :title="route.pathname">
              <Icon :icon="route.icon"/>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <RouterView/>
    </main>
    <template v-if="storeProgressProperty.visible && !$route.path.startsWith('/download/')">
      <div class="fixed bottom-2 right-5">
        <ProgressRound/>
      </div>
    </template>
  </div>
</template>

<style scoped>

.app{
  @apply
  w-full
  h-screen
  grid
  grid-cols-12
}
.app header{
  @apply
  col-span-1
  h-screen
  bg-[var(--bg-black-full)]
}

.app header .navigation{
  @apply
  p-3
}

.app header .navigation ul{
  @apply
  flex
  gap-3
  flex-col
}

.app header .navigation ul .nav-link{
  @apply
  w-full
  aspect-square
  flex
  items-center
  justify-center
  rounded-md
  text-2xl
  hover:bg-[var(--bg-black)]
}

.app header .navigation ul .nav-link.router-link-active.router-link-exact-active{
  @apply bg-[var(--bg-black)]
}

.app main{
  @apply
  col-span-11
  h-screen
  max-h-screen
  overflow-y-auto
}
</style>
