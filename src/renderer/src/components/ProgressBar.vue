<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { storeProgress } from '@renderer/stores/storeProgress';

const store = storeProgress();
const { progress, verify } = storeToRefs(store);

defineProps<{ titleProgress:string }>()
let interval:null | ReturnType<typeof setInterval> = null;

onBeforeUnmount(() => {
    if(interval !== null) {
        clearInterval(interval)
        interval = null
    }
})

</script>

<template>
    <div class="progress-container">
        <h2 class="progress-title">{{ verify ? 'Buscando Dados' : titleProgress }}</h2>
        <div class="progress" v-if="verify">
            <div class="progress-verify"/>
        </div>
        <template v-else>
            <div class="progress">
                <div class="progress-bar" :style="`width: ${progress}%;`"/>
            </div>
            <div class="progress-percent">{{ progress }}%</div>
        </template>
    </div>
</template>

<style scoped>
.progress-title{
    @apply
    text-lg
    font-[500]
}
.progress{
    @apply
    w-full
    h-[20px]
    bg-[var(--bg-white)]
    border-[1px]
    border-black
    rounded-md
    relative
}

.progress-verify,
.progress-bar{
    @apply
    bg-green-500
    h-full
    rounded-md
}

.progress-verify{
    @apply
    absolute
    top-0;
    animation: verify 3000ms linear infinite;
}

.progress-bar{
    @apply
    duration-500
}

@keyframes verify {
    0%{
        @apply w-[0px] left-0 bg-green-500;
    }
    50%{
        @apply w-[100%] left-auto bg-green-400;
    }
    100%{
        @apply w-[0px] right-0 bg-green-500;
    }
}
</style>

