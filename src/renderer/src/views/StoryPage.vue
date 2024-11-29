<script setup lang="ts">
import type IStoryProps from 'src/types/IStoryProps';
defineProps<IStoryProps>()
</script>

<template>
    <div class="view">
        StoryPage {{ site }} - {{ name }}<br>
        <RouterLink :to="{name:'chapter', params: {site, name, chapter:'capitulo-1'}}">capítulo 1</RouterLink>
    </div>
</template>