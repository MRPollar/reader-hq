<script setup lang="ts">
import type IChapterProps from 'src/types/IChapterProps';
import IFiles from 'src/types/IFiles';
import { onMounted, ref, Ref } from 'vue';
import api from '@renderer/api';


const props = defineProps<IChapterProps>();

const pages:Ref<IFiles[]> = ref([]);

onMounted(async () => {
    const { data }:{ data:{ files:IFiles[], ok:boolean } } = await api.get(`/chapter/${props.site}/${props.name}/${props.chapter}`)
    console.log(data);
    pages.value = data.files;
})
</script>

<template>
    <div class="view">
        <img v-for="page in pages" :key="page.name" :src="`http://localhost:4200/files/${site}/${name}/${props.chapter}/${page.name}`" :alt="props.name"/>
    </div>
</template>

<style scoped>
    img{
        @apply
        max-w-[700px]
        mx-auto
    }
</style>