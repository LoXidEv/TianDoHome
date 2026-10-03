<script>
import config from '@/config'

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
    },
    data() {
        return {
            avatarList: config.organization.avatars,
        }
    },
}
</script>

<template>
    <div class="org_card">
        <img :src="obj.logo" class="card_logo" alt="logo">
        <img v-for="(value, index) in avatarList.sort(() => 0.5 - Math.random())" :src="value"
            :class="`card_logo_avatar_${index + 1}`" alt="logo avatar">
        <div class="org_content_container">
            <div class="org_title">{{ obj.title }}</div>
            <div class="org_content">{{ obj.content }}</div>
            <a :href="obj.link" target="_blank" class="org_link">{{ $t('organization.officialWebsite') }}</a>
        </div>
    </div>
</template>

<style scoped>
.org_link {
    font-size: 16px;
    color: var(--theme-color);
    text-decoration: none;
    cursor: pointer;
    padding: 4px 0;
    transition: var(--transition-base);
    border-radius: var(--border-radius);

    &:hover {
        padding: 4px 8px;
        background-color: var(--navbar-hover);
    }
}

@media screen and (max-width: 540px) {
    .card_logo,
    .card_logo_avatar_1,
    .card_logo_avatar_2,
    .card_logo_avatar_3 {
        opacity: 0.5;
        filter: blur(2px);
    }
}

.org_content_container {
    z-index: 10;
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: calc(100% - 20px);
}

.org_title {
    font-size: 30px;
    font-weight: bold;
}

.org_content {
    margin-bottom: 10px;
}

.org_card {
    position: relative;
    max-width: 100%;
    height: 200px;
    padding: 10px;
    border: 2px var(--theme-color-3) solid;
    border-radius: var(--border-radius);
    background-color: var(--background-color-oc);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.card_logo {
    z-index: 1;
    position: absolute;
    bottom: 70px;
    right: 80px;
    width: 100px;
    transition: var(--transition-base);
}

.card_logo_avatar_1,
.card_logo_avatar_2,
.card_logo_avatar_3 {
    transition: var(--transition-base);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    position: absolute;
    width: 50px;
    border-radius: var(--border-radius);
}

.card_logo_avatar_1 {
    z-index: 5;
    bottom: 80px;
    transform: rotate(-20deg);
    right: 170px;
}

.card_logo_avatar_2 {
    z-index: 4;
    bottom: 50px;
    transform: rotate(20deg);
    right: 50px;
}

.card_logo_avatar_3 {
    z-index: 3;
    bottom: 140px;
    transform: rotate(6deg);
    right: 50px;
}
</style>
