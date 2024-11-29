<template>
    <button class="base-style">
        <slot/>
    </button>
</template>

<style scoped>
.base-style{
    @apply
    border
    rounded-md
    hover:border-[var(--border-black)]
    hover:bg-[var(--bg-black)]
    p-2
    inline-block
}
</style>