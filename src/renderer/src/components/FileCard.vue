<script setup lang="ts">
import IFiles from '@types/IFiles';

defineProps<{ dir:IFiles, name:string, params:any }>();

const formatText = (val:string):string => {
    return val.toUpperCase().replace(/-/g, ' ');
}
</script>

<template>
    <RouterLink class="card-file" :to="{ name, params }">
        <Icon class="icon" icon="solar:folder-with-files-line-duotone"/>
        <span class="directory-name" :title="formatText(dir.name)">{{ formatText(dir.name) }}</span>
    </RouterLink>
</template>

<style scoped>
  .card-file{
    @apply
    border
    aspect-video
    flex
    items-center
    justify-center
    flex-col
    rounded-md
  }
  .card-file > .icon{
    @apply
    gap-3
    text-5xl
  }
  .card-file > .directory-name{
    @apply
    font-bold
    inline-block
    px-2
    w-full
    text-center
    whitespace-nowrap
    text-ellipsis
    overflow-hidden
  }
</style>
