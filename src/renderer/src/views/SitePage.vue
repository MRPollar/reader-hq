<script setup lang="ts">
import type ISiteProps from "../../../types/ISiteProps";
import type IFiles from '../../../types/IFiles';
import GridCards from '@renderer/components/GridCards.vue';
import FileCard from '@renderer/components/FileCard.vue';
import api from '@renderer/api';
import { onMounted, Ref, ref } from 'vue';
const props = defineProps<ISiteProps>()

const files:Ref<IFiles[]> = ref([]);

onMounted(async () => {
    const { data }:{ data:{ files:IFiles[], ok:boolean } } = await api.get(`/downloads/${props.site}`)
    files.value = data.files;
})
</script>

<template>
    <div class="view">
        <GridCards>
            <FileCard v-for="story in files" :key="story.name" :dir="story" name="story" :params="{ site, name: story.name }"/>
        </GridCards>
    </div>
</template>