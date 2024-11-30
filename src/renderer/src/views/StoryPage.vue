<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import type IStoryProps from 'src/types/IStoryProps';
import type IFiles from 'src/types/IFiles';
import GridCards from '@renderer/components/GridCards.vue';
import FileCard from '@renderer/components/FileCard.vue';
import api from '@renderer/api';

const props = defineProps<IStoryProps>()
const files:Ref<IFiles[]> = ref([])

onMounted(async () => {
    const { data }:{ data:{ files:IFiles[], ok:boolean } } = await api.get(`/story/${props.site}/${props.name}`);
    files.value = data.files.reverse();
})
</script>

<template>
    <div class="view">
        <GridCards>
            <FileCard v-for="story in files" :key="story.name" :dir="story" name="chapter" :params="{ site, name, chapter: story.name }"/>
        </GridCards>
    </div>
</template>