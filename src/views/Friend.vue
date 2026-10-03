<script setup>
import { computed } from 'vue'
import config from '@/config'
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'

const friendConfig = config.friend
const friendLinkConfig = friendConfig.links

// 随机打乱一次，保证每次进入页面顺序随机，且不会因渲染而反复变化
const shuffledLinks = computed(() => {
    const links = [...friendLinkConfig]
    return friendConfig.shuffle ? links.sort(() => Math.random() - 0.5) : links
})
</script>


<template>
    <div class="friend_card_container">
        <Title :title="$t(friendConfig.titleKey)" :subtitle="$t(friendConfig.subtitleKey)" color="text-color"
            v-reveal />
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
