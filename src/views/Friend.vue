<script setup>
import { ref, computed } from 'vue'
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'

const friendLinkConfig = ref([
    {
        title: '孙悟元',
        content: '今年欢笑复明年，秋月春风等闲度。',
        logo: 'https://wuyuan.dev/media/avatar.png',
        link: 'https://wuyuan.dev/',
    },
    {
        title: 'zzdev',
        content: '為無聊的人生賦予一點意義罷',
        logo: 'https://cosh.work/img/zzdev_avatar.webp',
        link: 'https://zzdev.carrd.co/',
    },
    {
        title: 'OiklM',
        content: '善於開發軟體、網頁、遊戲類專案',
        logo: 'https://avatars.githubusercontent.com/u/160687846?v=4',
        link: 'https://www.oiklm.com/',
    },
    {
        title: 'Lithescale',
        content: '戚雨藏云碎诡风，轻羽绵鳞猫猫龙',
        logo: '/img/DoNG/other/Lithescale.webp',
        link: 'https://www.lscd.cc/',
    },
    {
        title: '夜白的小空间',
        content: 'Live Today,Love Tomorrow,Unite Forever',
        logo: 'https://img.yebaiwn.top/yebai.jpg',
        link: 'https://blog.yebaiwn.top/',
    },
    {
        title: '龙星划空',
        content: '人生近看是悲剧，远看是喜剧',
        logo: 'https://blog.furryawa.com/images/atiq.png',
        link: 'https://blog.furryawa.com/',
    },
])

// 随机打乱一次，保证每次进入页面顺序随机，且不会因渲染而反复变化
const shuffledLinks = computed(() =>
    [...friendLinkConfig.value].sort(() => Math.random() - 0.5)
)
</script>


<template>
    <div class="friend_card_container">
        <Title :title="$t('title.friend')" :subtitle="$t('title.friendSub')" color="text-color" v-reveal />
        <ShowList v-for="(item, index) in shuffledLinks" :key="item.title" :obj="item"
            v-reveal="{ animation: 'fadeInUp', delay: index * 60 }" />
    </div>
</template>

<style scoped>
.friend_card_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>