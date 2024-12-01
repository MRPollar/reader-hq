<script setup lang="ts">
import type ISite from '../../../types/ISite';
import { ref, Ref } from 'vue';
import InputText from './InputText.vue';
import ButtonDefault from './ButtonDefault.vue';
import verifyInputs from '@renderer/functions/verifyInputs';

const emit = defineEmits<{ (e:'submit-control'):void }>()
const formInputs:Ref<ISite> = ref({
    site_name:'',
    url:'https://oldi.sussytoons.com/',
    title_selector:'',
    chapter_selector:'',
    page_selector:''
})

const handleSubmit = async ():Promise<void> => {
    try {
        const recordData:Record<string, (string | number)> = { ...formInputs.value }

        if(!verifyInputs(recordData)) return;

        await window.database.addSite({ ...formInputs.value });

        const objectList = Object.entries(formInputs.value)
        for(const [key] of objectList){
            formInputs.value[key] = '';
        }

        // emit('submit-control');
    } catch (error) {
        console.log(error);
    } finally{

    }
}

</script>

<template>
    <form @submit.prevent="handleSubmit">
        <h3>Adicionar novo site</h3>
        <label>
            Nome do site:
            <InputText v-model="formInputs.site_name"/>
        </label>
        <label>
            URL do site:
            <InputText v-model="formInputs.url" type="url"/>
        </label>
        <label>
            Seletor de título da história:
            <InputText v-model="formInputs.title_selector"/>
        </label>
        <label>
            Seletor de capítulo da história:
            <InputText v-model="formInputs.chapter_selector"/>
        </label>
        <label>
            Seletor de página da história:
            <InputText v-model="formInputs.page_selector"/>
        </label>
        <div>
            <ButtonDefault type="submit">Adicionar</ButtonDefault>
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