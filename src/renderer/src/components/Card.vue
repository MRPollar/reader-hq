<script setup lang="ts">
import icon from "@renderer/assets/icon.png";
import ISiteItem from '../../../types/ISiteItem'
defineProps<{ site:ISiteItem }>();
const emit = defineEmits<{ (e: 'delete', id: number): void; }>();

const handlerClick = (id:number): void => {
    emit('delete', id);
}


</script>

<template>
    <div class="box-site">
        <RouterLink class="download-link" :to="{ name: 'download', params: { slug: site.site_slug } }">
            <img width="40" height="40px" :src="`http://localhost:4200/icons/${site.image}`" :alt="site.site_name"/>
            <span>{{ site.site_name }}</span>
        </RouterLink>
        <ul class="box-actions">
            <li>
                <RouterLink :to="{ name: 'update', params:{ slug: site.site_slug } }" title="Editar">
                    <Icon icon="solar:pen-new-square-bold"/>
                </RouterLink>
            </li>
            <li>
                <RouterLink @click.prevent="handlerClick(Number(site.id))" to="#" title="Apagar">
                    <Icon icon="solar:trash-bin-2-bold"/>
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.box-site{
    @apply
    aspect-video
    relative
    overflow-hidden
    rounded-lg
}

.box-site .download-link{
    @apply
    flex
    items-center
    flex-col
    gap-1
    w-full
    h-full
    border
    rounded-lg
    py-5
}

.box-site .box-actions{
    @apply
    bg-[var(--bg-black-full)]
    w-full
    absolute
    bottom-0
    left-0
    flex
    items-center
    justify-around
    py-1
    px-3
    text-2xl
    gap-4
}

.box-site .box-actions a[title='Editar']{
    @apply
    hover:text-blue-500
}

.box-site .box-actions a[title='Apagar']{
    @apply
    hover:text-red-500
}
</style>
