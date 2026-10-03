<script setup>
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'
import Organization from '@/components/Organization.vue'
</script>

<template>
    <div class="contact_card_container">
        <Title :title="$t('title.organization')" :subtitle="$t('title.organizationSub')" v-reveal />
        <Organization :obj="{
            title: $t('about.coshTitle'),
            content: $t('about.coshContent'),
            logo: '/img/logo/logo_cosh_dark.svg',
            link: 'https://cosh.work',
        }" v-reveal="{ animation: 'fadeInUp', delay: 0 }" />
        <Title :title="$t('title.activeProjects')" :subtitle="$t('title.activeProjectsSub')" v-reveal="{ animation: 'fadeInUp', delay: 120 }" />
        <ShowList :obj="{
            title: $t('about.sarLabTitle'),
            content: $t('about.sarLabContent'),
            logo: '/img/logo/sarlab_logo.svg',
            link: 'https://sarlab.cosh.work',
        }" v-reveal="{ animation: 'fadeInUp', delay: 180 }" />
        <ShowList :obj="{
            title: $t('about.sawToolTitle'),
            content: $t('about.sawToolContent'),
            logo: '/img/logo/sarlab_logo.svg',
            link: 'https://sawtool.cosh.work',
        }" v-reveal="{ animation: 'fadeInUp', delay: 240 }" />
        <Title :title="$t('title.aiProjects')" :subtitle="$t('title.aiProjectsSub')" v-reveal="{ animation: 'fadeInUp', delay: 300 }" />
        <ShowList :obj="{
            title: $t('about.sarMarketTitle'),
            content: $t('about.sarMarketContent'),
            logo: 'https://market.loxi.work/favicon.ico',
            link: 'https://market.loxi.work',
        }" v-reveal="{ animation: 'fadeInUp', delay: 360 }" />
    </div>
</template>

<style scoped>
.contact_card_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
