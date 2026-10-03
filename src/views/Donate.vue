<script setup>
import config from '@/config'

const donate = config.donate
</script>

<template>
    <div class="dc_donate">
        <div class="donate_title" v-reveal>{{ $t('donate.title') }}</div>
        <div class="donate_subtitle" v-reveal="{ animation: 'fadeInUp', delay: 120 }">{{ $t('donate.subtitle') }}</div>
        <img :src="donate.image" :alt="$t('donate.wechatQr')" class="donate_qr"
            v-reveal="{ animation: 'zoomIn', delay: 240 }">
    </div>
</template>

<style scoped>
.dc_donate {
    text-align: center;
}

.donate_title {
    font-size: 30px;
}

.donate_subtitle {
    margin-bottom: 40px;
    color: #7a7a7a;
}

.donate_qr {
    width: 320px;
    max-width: 100%;
    border-radius: var(--border-radius);
    border: 3px solid var(--theme-color-3);
    transition: var(--transition-base);
}

.donate_qr:hover {
    transform: scale(1.1);
}
</style>
