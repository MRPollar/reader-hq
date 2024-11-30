<script setup lang="ts">
import FileCard from '@renderer/components/FileCard.vue';
import GridCards from '@renderer/components/GridCards.vue';
import type IFiles from 'src/types/IFiles';
import { onMounted, Ref, ref } from 'vue';
import api from '@renderer/api';

const files:Ref<IFiles[]> = ref([]);

onMounted(async () => {
    const { data }:{ data:{ files:IFiles[], ok:boolean } } = await api.get('/root');
    files.value = data.files;
})

</script>

<template>
    <div class="view">
        <GridCards>
            <FileCard v-for="file in files" :key="file.name" :dir="file" name="site" :params="{ site: file.name }"/>
        </GridCards>
    </div>
</template>