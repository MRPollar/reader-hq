<script setup lang="ts">
import InputText from '@renderer/components/InputText.vue';
import ProgressBar from '@renderer/components/ProgressBar.vue';
import { onMounted, ref, Ref } from 'vue'
import ISite from '../../../types/ISite'
import { storeProgress } from '@renderer/stores/storeProgress'
import { storeToRefs } from 'pinia'
import verifyInputs from '@renderer/functions/verifyInputs'

const { visible } = storeToRefs(storeProgress());


const props = defineProps<{ slug:string }>()
const urlRest:Ref<string> = ref('');
const site:Ref<ISite | null> = ref(null);

onMounted(async () => {
  const site_single:ISite = await window.database.getSite({ slug: props.slug });
  site.value = site_single
})

const download_story = (): void => {
  const record: Record<string, string> = { url: urlRest.value }
  const verify = verifyInputs(record);
  if(!verify) return;

  const url: string = site.value?.url.endsWith('/') ? site.value?.url.slice(0, site.value?.url.length-1) : site.value?.url as string;
  const rest: string = urlRest.value.trim().startsWith('/') ? urlRest.value.trim().slice(1, urlRest.value.trim().length) : urlRest.value.trim();

  const data:{ url: string, slug: string } = {
    url: `${url}/${rest}`,
    slug: props.slug,
  }
  window.database.downloadSite(data);
}

</script>

<template>
    <div class="view">
        <h2 class="title_page">Baixar história de {{ site?.site_name }}</h2>
        <form @submit.prevent="download_story">
            <label class="label_flex">
                <span>{{ site?.url }}</span>
                <InputText v-model="urlRest"/>
            </label>
            <button type="submit" class="button-download">Baixar</button>
        </form>
        <ProgressBar v-if="visible" title-progress="Baixando"/>
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
    block
    whitespace-nowrap
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
