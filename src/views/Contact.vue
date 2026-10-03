<script setup>
import config from '@/config'
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'

const contactConfig = config.contact
const contactLinkConfig = contactConfig.links
</script>


<template>
    <div class="contact_card_container">
        <Title :title="$t(contactConfig.titleKey)" :subtitle="$t(contactConfig.subtitleKey)" color="text-color"
            v-reveal />
        <ShowList v-for="(item, index) in contactLinkConfig" :key="item.id || item.title" :obj="{
            title: item.title,
            content: item.desc ? item.desc : $t(item.descKey),
            logo: item.logo,
            link: item.link,
        }" v-reveal="{ animation: 'fadeInUp', delay: index * 60 }" />
    </div>
</template>

<style scoped>
.contact_card_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>
