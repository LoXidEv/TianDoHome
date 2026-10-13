<script>
import config from '@/config'

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            assets: config.assets,
        }
    },
    computed: {
        displayTitle() {
            return this.title || this.$t('title.organization')
        },
        displaySubtitle() {
            return this.subtitle || this.$t('title.organizationSub')
        }
    }
}
</script>

<template>
    <div class="dc_title_h2">
        <div class="dc_title_h2_title">{{ displayTitle }}</div>
        <div class="dc_title_h2_subtitle">
            {{ displaySubtitle }}
        </div>
        <img :src="assets.logo" alt="冬冬" class="dc_title_h2_logo">
    </div>
</template>

<style scoped>
.dc_title_h2 {
    height: 60px;
    padding: 10px;
    border: 3px solid var(--border-color);
    border-radius: var(--border-radius);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background-color: var(--background-color-oc);
    position: relative;
    overflow: hidden;
}

.dc_title_h2_logo {
    position: absolute;
    bottom: -20px;
    right: -10px;
    height: 140px;
    z-index: 1;
}

.dc_title_h2_title {
    color: var(--theme-color);
    font-weight: bold;
    font-size: 24px;
    position: absolute;
    bottom: 6px;
    z-index: 3;
}

.dc_title_h2_subtitle {
    font-weight: bold;
    position: absolute;
    right: 10px;
    bottom: -6px;
    font-size: 26px;
    color: var(--border-color);
    z-index: 2;
}
</style>
