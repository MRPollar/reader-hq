<script setup lang="ts">
import type ISiteProps from 'src/types/ISiteProps';

defineProps<ISiteProps>()
</script>

<template>
    <div class="view">
        SitePage {{ site }}<br>
        <RouterLink :to="{name:'story', params:{ site: site, name: 'Dragon Ball' }}">Story</RouterLink>
    </div>
</template>