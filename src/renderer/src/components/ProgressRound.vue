<script setup lang="ts">
import { storeProgress } from '@renderer/stores/storeProgress';
import { storeToRefs } from 'pinia';

const store = storeProgress();
const { progress, verify } = storeToRefs(store);

</script>

<template>
    <div class="container-loader">
        <div v-if="verify" class="loader">
            <svg viewBox="0 0 200 200">
                <circle
                    :cx="100"
                    :cy="100"
                    :r="70"
                ></circle>
            </svg>
        </div>
        <div v-else class="loader-download">
            <div class="progress">{{ progress }}%</div>
            <svg viewBox="0 0 200 200">
                <circle
                    :style="`stroke-dashoffset: calc(439 - (${progress} * 439) / 100);`"
                    :cx="100"
                    :cy="100"
                    :r="70"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<style scoped>
    .container-loader{
        @apply
        aspect-square
        bg-black
        rounded-full
    }

    .loader-download,
    .loader{
        @apply
        relative
        w-[80px]
    }

    .loader-download svg,
    .loader svg{
        @apply
        absolute
        left-0
        top-0
    }

    .loader-download svg circle,
    .loader svg circle{
        @apply
        fill-none
        stroke-green-500
        stroke-[10px];
        stroke-linecap: round;
    }

    .loader-download svg circle{
        stroke-dasharray: 439;
    }

    .loader-download .progress{
        @apply
        absolute
        top-[40px]
        left-[50%]
        translate-x-[-50%]
        translate-y-[-50%]
        text-sm
        font-bold
        z-10
    }

    .loader svg circle{
        animation: loading 3000ms linear infinite;
    }

    @keyframes loading {
        0%{
            stroke-dasharray: 439;
            stroke-dashoffset: 439;
        }
        50%{
            stroke-dasharray: 439;
            stroke-dashoffset: 0;
        } 
        100%{
            stroke-dasharray: 439;
            stroke-dashoffset: -439;
        }
    }


</style>