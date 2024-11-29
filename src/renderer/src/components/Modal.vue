<script setup lang="ts">
import { ref, Ref } from 'vue';

const emit = defineEmits<{ (e:'modal-control'):void }>()

const modalBox:Ref<HTMLDivElement | null> = ref(null);

const handleEmitEvent = (e:MouseEvent):void => {
    const clickedElement:Node = e.target as Node;
    if(modalBox.value && (modalBox.value.contains(clickedElement) || modalBox.value === clickedElement)) return
    emit('modal-control');
}

</script>
<template>
    <div class="modal-view" @click="handleEmitEvent">
        <div class="modal-box" ref="modalBox">
            <slot/>
        </div>
    </div>
</template>


<style scoped>
.modal-view{
    @apply
    w-full
    h-screen
    fixed
    top-0
    left-0
    z-50
    bg-black/30
    flex
    items-center
    justify-center
    overflow-y-auto
}

.modal-view .modal-box{
    @apply
    bg-[var(--bg-black-full)]
    w-full
    max-w-[600px]
    p-4
    rounded-md
}
</style>