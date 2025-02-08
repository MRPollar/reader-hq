<script setup lang="ts">
import type ISite from '../../../types/ISite';
import { ref, Ref } from 'vue';
import InputText from './InputText.vue';
import ButtonDefault from './ButtonDefault.vue';
import verifyInputs from '@renderer/functions/verifyInputs';
import { storeSites } from '@renderer/stores/storeSites';

const store = storeSites();
const emit = defineEmits<{ (e:'submit-control'):void }>()
const submitFlag:Ref<boolean> = ref(false);
const formInputs:Ref<ISite> = ref({
    site_name:'Manga Online Biz',
    url:'https://mangaonline.biz/',
    title_selector:'#single > div.content > div.sheader > div > h1',
    chapter_selector:'#seasons > div > div.se-a > ul > li > div > a',
    page_selector:'#single > div.content > p > img'
})

const handleSubmit = async ():Promise<void> => {
    try {
        submitFlag.value = !submitFlag.value
        if(!verifyInputs({ ...formInputs.value })) return;

        await window.database.addSite({ ...formInputs.value });

        const objectList = Object.entries(formInputs.value)
        for(const [key] of objectList){
            formInputs.value[key] = '';
        }
        emit('submit-control');
        store.getAllSites();
    } catch (error) {
        console.log(error);
    } finally{
        submitFlag.value = !submitFlag.value
    }
}

</script>

<template>
    <form @submit.prevent="handleSubmit">
        <h3>Adicionar novo site</h3>
        <label>
            Nome do site:
            <InputText v-model="formInputs.site_name" :disabled="submitFlag"/>
        </label>
        <label>
            URL do site:
            <InputText v-model="formInputs.url" type="url" :disabled="submitFlag"/>
        </label>
        <label>
            Seletor de título da história:
            <InputText v-model="formInputs.title_selector" :disabled="submitFlag"/>
        </label>
        <label>
            Seletor de capítulo da história:
            <InputText v-model="formInputs.chapter_selector" :disabled="submitFlag"/>
        </label>
        <label>
            Seletor de página da história:
            <InputText v-model="formInputs.page_selector" :disabled="submitFlag"/>
        </label>
        <div>
            <ButtonDefault type="submit" :disabled="submitFlag">Adicionar</ButtonDefault>
        </div>
    </form>
</template>

<style scoped>
h3{
    @apply
    mb-4
    text-2xl
    font-bold
}

label{
    @apply
    mb-4
    block
    space-y-2
}
</style>