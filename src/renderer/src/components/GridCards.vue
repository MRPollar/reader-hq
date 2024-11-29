<template>
    <div class="grid-card">
        <slot/>
    </div>
</template>

<style scoped>
.grid-card{
    @apply
    grid
    grid-cols-3
    gap-3
}
</style>