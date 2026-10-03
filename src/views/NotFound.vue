<script setup>
import config from '@/config'

const assets = config.assets
</script>

<template>
    <div class="notfound_card">
        <img :src="assets.notFoundLeft" alt="Background Left" class="notfound_bg_left" />
        <div class="notfound_content">
            <div class="notfound_title" v-reveal="{ animation: 'fadeInUp', delay: 100 }">{{ $t('notfound.title') }}</div>
            <div class="notfound_subtitle" v-reveal="{ animation: 'fadeInUp', delay: 220 }">{{ $t('notfound.subtitle') }}</div>
            <RouterLink to="/" class="notfound_back" v-reveal="{ animation: 'fadeInUp', delay: 340 }">
                {{ $t('notfound.back') }}
            </RouterLink>
        </div>
        <img :src="assets.notFoundRight" alt="Background Right" class="notfound_bg_right" />
    </div>
</template>

<style scoped>
@media screen and (max-width: 680px) {
    .notfound_bg_right {
        filter: blur(6px);
    }
}

@media screen and (max-width: 420px) {
    .notfound_bg_left {
        filter: blur(6px);
    }
}

.notfound_back {
    background-color: var(--background-color-navbar);
    border: 2px solid var(--theme-color);
    padding: 8px 10px;
    border-radius: var(--border-radius);
    text-decoration: none;
    color: var(--theme-color);
    cursor: pointer;
    font-size: 14px;
    font-family: 'GenSenRounded-R';
    transition: var(--transition-base);

    &:hover {
        color: #ffffff;
        background-color: var(--theme-color);
    }
}

.notfound_card {
    background-color: #ffffff;
    border-radius: var(--border-radius);
    height: 320px;
    position: relative;
    width: 100%;
    border: 3px solid var(--theme-color-3);
}

.notfound_content {
    z-index: 3;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translate(0, -50%);
}

.notfound_title {
    font-size: 32px;
    font-weight: bold;
}

.notfound_subtitle {
    font-size: 24px;
    margin-bottom: 20px;
}

.notfound_bg_left {
    transition: var(--transition-base);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    border-radius: var(--border-radius);
}

.notfound_bg_right {
    transition: var(--transition-base);
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border-radius: var(--border-radius);
    z-index: 1;
}
</style>
