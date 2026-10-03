<script setup>
import { useI18n } from 'vue-i18n'
import config from '@/config'
import ShowList from '@/components/ShowList.vue'
import Title from '@/components/UI/Title.vue'
import Organization from '@/components/Organization.vue'

const { t } = useI18n()
const sections = config.about.sections

// 兼容两种写法：直接提供 title/content，或提供 i18n 的 titleKey/contentKey
const resolveText = (value, key) => value || (key ? t(key) : '')

const itemObj = (item) => ({
    title: resolveText(item.title, item.titleKey),
    content: resolveText(item.content, item.contentKey),
    logo: item.logo,
    link: item.link,
})
</script>

<template>
    <div class="contact_card_container">
        <template v-for="(section, sectionIndex) in sections" :key="section.id">
            <Title :title="resolveText(section.title, section.titleKey)"
                :subtitle="resolveText(section.subtitle, section.subtitleKey)"
                v-reveal="{ animation: 'fadeInUp', delay: sectionIndex * 60 }" />
            <template v-for="(item, itemIndex) in section.items" :key="item.title || item.titleKey">
                <Organization v-if="section.card === 'organization'" :obj="itemObj(item)"
                    v-reveal="{ animation: 'fadeInUp', delay: itemIndex * 60 }" />
                <ShowList v-else :obj="itemObj(item)"
                    v-reveal="{ animation: 'fadeInUp', delay: itemIndex * 60 }" />
            </template>
        </template>
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
