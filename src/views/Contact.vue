<script setup>
import { ref } from 'vue'
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'

const contactLinkConfig = ref([{
    title: 'QQ',
    link: 'https://qm.qq.com/q/8E0ZD3jt9S',
    logo: '/img/logo/QQ.png',
    contentKey: 'contact.qqDesc',
}, {
    title: 'Discord',
    link: 'http://discord.com/users/1007503082600546314',
    logo: '/img/logo/Discord.svg',
    contentKey: 'contact.discordDesc',
}, {
    title: 'GitHub',
    link: 'https://github.com/loxidev',
    logo: '/img/logo/GitHub.svg',
    contentKey: 'contact.githubDesc',
}, {
    title: 'Bilibili',
    link: 'https://space.bilibili.com/1093209533',
    logo: '/img/logo/Bilibili.svg',
    contentKey: 'contact.bilibiliDesc',
}, {
    title: 'Email',
    link: 'mailto:loxidev@cosh.work',
    logo: '/img/logo/Email.svg',
    contentKey: 'contact.emailDesc',
},])
</script>


<template>
    <div class="contact_card_container">
        <Title :title="$t('title.contact')" :subtitle="$t('title.contactSub')" color="text-color" v-reveal />
        <ShowList v-for="(item, index) in contactLinkConfig" :key="item.title" :obj="{
            title: item.title,
            content: $t(item.contentKey),
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
