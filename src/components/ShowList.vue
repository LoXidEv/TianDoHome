<script>
export default {
    props: {
        obj: {
            type: Object,
            default: () => ({
                title: '',
                content: '',
                items: [],
            }),
        },
        useMarginTop: {
            type: Boolean,
            default: true,
        },
    },
}
</script>

<template>
    <a :is="obj.link ? 'a' : 'div'" :href="obj.link" :target="obj.link ? '_blank' : null"
        :class="['loxi_showlist', { 'loxi_showlist_no_margin_top': !useMarginTop }]"
        :style="!obj.link ? 'cursor: default' : ''">
        <div class="card_header">
            <img v-if="obj.logo" :src="obj.logo" class="card_logo" alt="logo">
            <div class="card_title">{{ obj.title }}</div>
        </div>
        <div class="card_content">{{ obj.content }}</div>
    </a>
</template>

<style scoped>
.loxi_showlist {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    padding: 10px;
    border: 2px var(--theme-color-3) solid;
    border-radius: var(--border-radius);
    transition: var(--transition-base);
    background-color: var(--background-color-oc);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    text-decoration: none;
    color: var(--text-color);
    cursor: pointer;

    &:hover {
        background-color: var(--theme-color-2);
    }
}

.loxi_showlist_no_margin_top {
    margin-top: 0;
}

.card_header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.card_logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 4px;
}

.card_title {
    font-weight: bold;
}

.card_content {
    font-size: 14px;
    line-height: 1.6;
    color: #7a7a7a;
}
</style>
