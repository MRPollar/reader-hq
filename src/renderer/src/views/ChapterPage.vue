<script setup lang="ts">
import type IChapterProps from 'src/types/IChapterProps';
defineProps<IChapterProps>()
</script>

<template>
    <div class="view">
        ChapterPage {{ site }} - {{ name }} - {{ chapter }}
    </div>
</template>