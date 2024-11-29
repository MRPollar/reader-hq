<script setup lang="ts">
import ButtonDefault from './ButtonDefault.vue';
type Props = {
    text:string
}
type Emits = {
    (e:'close-modal'):void,
    (e:'confirm'):void;
}
defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClose = ():void => emit('close-modal');
const handleConfirm = ():void => emit('confirm');
</script>

<template>
    <div class="alert-box">
        <h3>{{ text }}</h3>
        <div class="buttons">
            <ButtonDefault @click="handleConfirm">Sim</ButtonDefault>
            <ButtonDefault @click="handleClose">Não</ButtonDefault>
        </div>
    </div>
</template>

<style scoped>
.alert-box{
    @apply
    flex
    flex-col
    gap-3
}

.alert-box .buttons{
    @apply
    grid
    grid-cols-4
    gap-4
}
</style>