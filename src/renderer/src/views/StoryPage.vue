<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import type IStoryProps from '../../../types/IStoryProps';
import type IFiles from '../../../types/IFiles';
import GridCards from '@renderer/components/GridCards.vue';
import FileCard from '@renderer/components/FileCard.vue';
import api from '@renderer/api';

const props = defineProps<IStoryProps>()
const files:Ref<IFiles[]> = ref([])

onMounted(async () => {
    const { data }:{ data:{ files:IFiles[], ok:boolean } } = await api.get(`/story/${props.site}/${props.name}`);
    const sortData:IFiles[] = data.files.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] ?? "0", 10);
        const numB = parseInt(b.name.match(/\d+/)?.[0] ?? "0", 10);
        return numA - numB;
    });
    files.value = sortData.reverse();
})
</script>

<template>
    <div class="view">
        <GridCards>
            <FileCard v-for="story in files" :key="story.name" :dir="story" name="chapter" :params="{ site, name, chapter: story.name }"/>
        </GridCards>
    </div>
</template>