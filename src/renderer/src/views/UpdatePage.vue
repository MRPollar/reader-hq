<script setup lang="ts">
import type ISite from 'src/types/ISite';
import ButtonDefault from '@renderer/components/ButtonDefault.vue';
import InputText from '@renderer/components/InputText.vue';

import verifyInputs from '@renderer/functions/verifyInputs';
import { ref, Ref } from 'vue';
const form:Ref<Record<string, string>> = ref({
    name_site:'',
    url_site:'',
    title_selector:'',
    chapter_selector:'',
    page_selector:''
})

const submitForm = ():void => {
    const validForm = verifyInputs(form.value);
    if(!validForm) return;


}

</script>

<template>
    <div class="view">
        <h2 class="title_page">Atualiza seletores</h2>
        <form @submit.prevent="submitForm">
            <label>
                Nome do site:
                <InputText v-model="form.name_site"/>
            </label>
            <label>
                URL do site:
                <InputText v-model="form.url_site"/>
            </label>
            <label>
                Seletor de título:
                <InputText v-model="form.title_selector"/>
            </label>
            <label>
                Seletor de capítulos:
                <InputText v-model="form.chapter_selector"/>
            </label>
            <label>
                Seletor de páginas:
                <InputText v-model="form.page_selector"/>
            </label>
            <div>
                <ButtonDefault type="submit">Atualizar</ButtonDefault>
            </div>
        </form>
    </div>
</template>

<style scoped>
form{
    @apply
    space-y-3
}
form label{
    @apply
    block
}
</style>