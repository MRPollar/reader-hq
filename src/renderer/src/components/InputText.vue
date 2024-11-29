<script setup lang="ts">
defineProps({
    type:{
        type: String as () => 'text' | 'search' | 'url',
        default: 'text',
    },
    modelValue:String
})
const emit = defineEmits<{ (e:'update:modelValue',value:string):void }>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
    <input :type="type" :value="modelValue" @input="handleInput"/>
</template>

<style scoped>
    input {
        @apply
        w-full
        text-[var(--text-black)]
        px-3
        py-1
        rounded-md
        outline-none
        inline-block
        text-base
    }
</style>