<script setup lang="ts">
import { ref, Ref } from 'vue'
import GridCards from '@renderer/components/GridCards.vue';
import Card from '@renderer/components/Card.vue';
import Modal from '@renderer/components/Modal.vue';
import AlertBox from '@renderer/components/AlertBox.vue';
import AddForm from '@renderer/components/AddForm.vue';

import { storeSites } from '@renderer/stores/storeSites'
import { storeToRefs } from 'pinia'

const store = storeSites();
const { sites } = storeToRefs(store);


const addItemBox:Ref<boolean> = ref(true);
const deleteBox:Ref<boolean> = ref(false);
const itemDeleteID:Ref<number> = ref(0);


// Abre e fecha a modal de alerta para confirmação
const handleDeleteModalToggle = (): void => {
    deleteBox.value = !deleteBox.value;
}
// Aciona um evento para a modal de abrir e capturar o id do item que vai ser deletado
const handleDeleteBoxItem = (id:number): void => {
    itemDeleteID.value = id;
    handleDeleteModalToggle();
}
// Ação de confirmação da modal
const handleDeleteItem = async (): Promise<void> => {
    await window.database.deleteSite({ id:itemDeleteID.value });
    handleDeleteModalToggle();
    await store.getAllSites();
}

// Controle de modal de formulário para adição de novo site
// Abre o fecha modal de formulário
const handleAddItemModalToggle = (): void => {
    addItemBox.value = !addItemBox.value
}

</script>

<template>
    <div class="view">
        <GridCards>
            <Card v-for="site in sites" :key="site.id" :site="site" @delete="handleDeleteBoxItem"/>

            <button class="add-button" title="Adicionar novo site" @click="handleAddItemModalToggle">
                <Icon icon="solar:add-square-broken"/>
            </button>
        </GridCards>
        <Modal v-show="deleteBox" @modal-control="handleDeleteModalToggle">
            <AlertBox text="Deseja deletar este site?" @close-modal="handleDeleteModalToggle" @confirm="handleDeleteItem"/>
        </Modal>
        <Modal v-show="addItemBox" @modal-control="handleAddItemModalToggle">
            <AddForm @submit-control="handleAddItemModalToggle"/>
        </Modal>
    </div>
</template>

<style scoped>
.add-button{
    @apply
    aspect-video
    flex
    items-center
    justify-center
    text-5xl
    outline-none
    border
    rounded-lg
}
</style>
