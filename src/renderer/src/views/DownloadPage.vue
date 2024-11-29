<script setup lang="ts">
import InputText from '@renderer/components/InputText.vue';
import ProgressBar from '@renderer/components/ProgressBar.vue';
import { ref, Ref } from 'vue';

const urlRest:Ref<string> = ref('');

</script>

<template>
    <div class="view">
        <h2 class="title_page">Baixar história de Sussy Scan</h2>
        <form>
            <label class="label_flex">
                <span>http://old.sussycan.com/</span>
                <InputText v-model="urlRest"/>
            </label>
            <button type="submit" class="button-download">Baixar</button>
        </form>
        <ProgressBar title-progress="Baixando"/>
    </div>
</template>

<style scoped>
form{
    @apply
    mb-4
}
.label_flex{
    @apply
    flex
    items-center
    gap-2
}

.label_flex span{
    @apply
    inline-block
    px-3
    py-1
    rounded-md
    bg-[var(--bg-black-full)]
    text-base
}

.button-download{
    @apply
    p-2
    hover:bg-[var(--bg-black-full)]
    hover:border-[var(--border-black-full)]
    inline-block
    mt-3
    border
    rounded-md
}
</style>