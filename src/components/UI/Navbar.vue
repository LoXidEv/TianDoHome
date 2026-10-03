<script>
import SelLang from './SelLang.vue';
import config from '@/config';

export default {
    components: {
        SelLang
    },
    data() {
        return {
            isMenu: false,
            assets: config.assets,
        }
    },
    computed: {
        navbarLinkConfig() {
            return config.navbar.map(item => ({
                name: this.$t(item.nameKey),
                id: item.id,
                path: item.path,
                isLink: item.type === 'external',
                isMenu: !!item.menuOnly,
            }))
        }
    },
    methods: {
        MenuClick(path, isLink) {
            if (path) {
                if (isLink) {
                    window.open(path, '_blank')
                } else {
                    this.$router.push(path)
                }
            }
            this.isMenu = !this.isMenu
        }
    }
}
</script>

<template>
    <div class="navbar_container">
        <Transition name="menu">
            <div class="navbar_menu" v-if="isMenu">
                <div class="menu_banner">
                    <img :src="assets.logo" alt="DoNG Logo" class="menu_banner_logo">
                    <div>
                        <div>{{ $t('website.name') }}</div>
                        <div class="menu_banner_text_subtitle">
                            {{ $t('website.slogan') }}
                        </div>
                    </div>
                </div>
                <div class="menu_content">
                    <div class="menu_item_container">
                        <div class="menu_item_title">{{ $t('navbar.menu.inside') }}</div>
                        <div v-for="item in navbarLinkConfig.filter(item => !item.isLink)" :key="item.id">
                            <button @click="MenuClick(item.path, item.isLink)" class="menu_item">
                                {{ item.name }}
                            </button>
                        </div>
                    </div>
                    <div class="menu_item_container">
                        <div class="menu_item_title">{{ $t('navbar.menu.outside') }}</div>
                        <div v-for="item in navbarLinkConfig.filter(item => item.isLink)" :key="item.id">
                            <button @click="MenuClick(item.path, item.isLink)" class="menu_item">
                                {{ item.name }}
                            </button>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="menu_toolbar">
                    <SelLang />
                </div>
            </div>
        </Transition>
        <div class="loxi_navbar animate__animated animate__fadeIn animate__delay-1s">
            <button :class="'navbar_item_button ' + (isMenu ? 'button_hover' : '')" @click="MenuClick">
                <img :src="assets.menuIcon" alt="Menu" class="navbar_item_button_icon">
            </button>
            <div v-for="item in navbarLinkConfig.filter(item => !item.isLink && !item.isMenu)" :key="item.id">
                <RouterLink :to="item.path" :class="'navbar_item ' + (($route.path == item.path) ? 'focus' : '')">
                    {{ item.name }}
                </RouterLink>
            </div>
            <div class="navbar_item_divided"></div>
            <div v-for="item in navbarLinkConfig.filter(item => item.isLink && !item.isMenu)" :key="item.id">
                <a :href="item.path" target="_blank"
                    :class="'navbar_item_link ' + (($route.path == item.path) ? 'focus' : '')" style="cursor: pointer;">
                    {{ item.name }}
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
hr {
    margin: 10px 0;
    border: none;
    height: 2px;
    background-color: #e0e0e0;
}

.menu_toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.menu_content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
}

.menu_item_container {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.menu_item_title {
    font-size: 14px;
    margin-bottom: 2px;
    color: #7a7a7a;
}

.menu_item {
    font-family: 'GenSenRounded-R';
    font-size: 14px;
    color: var(--text-color);
    border-radius: 6px;
    transition: var(--transition-base);
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 2px 0;

    &:hover {
        color: var(--theme-color);
        padding: 2px 8px;
        background-color: var(--navbar-hover);
    }
}

.menu_banner {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.menu_banner_logo {
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius);
    transform: rotate(-90deg);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.menu_banner_text_subtitle {
    font-size: 12px;
    color: #7a7a7a;
}

.navbar_menu {
    background-color: var(--background-color-navbar);
    border-radius: var(--border-radius);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    max-width: 100%;
    width: 400px;
    padding: 12px 16px;
    margin-bottom: 16px;
}

.menu-enter-active {
    transition: opacity var(--duration-base) ease, transform var(--duration-base) var(--ease-out);
}

.menu-leave-active {
    transition: opacity var(--duration-fast) ease, transform var(--duration-fast) var(--ease-in-out);
}

.menu-enter-from,
.menu-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

.navbar_item_button {
    font-family: 'GenSenRounded-R';
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: var(--border-radius);
    transition: var(--transition-base);

    &:hover {
        background-color: var(--navbar-hover-2);
    }
}

.button_hover {
    background-color: var(--navbar-hover-2);
}

.navbar_item_button_icon {
    width: 24px;
    height: 24px;
}

.navbar_item_divided {
    width: 2px;
    border-radius: var(--border-radius);
    height: 20px;
    margin-left: 6px;
    background-color: #e0e0e0;
}

.navbar_item_link {
    font-family: 'GenSenRounded-R';
    text-decoration: none;
    font-size: 14px;
    color: var(--text-color);
    padding: 4px 8px;
    border-radius: var(--border-radius);
    width: fit-content;
    transition: var(--transition-base);

    &:hover {
        color: var(--theme-color);
        text-decoration: underline;
    }
}

.navbar_container {
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loxi_navbar {
    background-color: var(--background-color-navbar);
    border-radius: var(--border-radius);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    width: fit-content;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    transition: var(--transition-base);
}

@media screen and (max-width: 648px) {
    .loxi_navbar:hover {
        padding: 12px 16px !important;
        transform: translateY(-5px);
    }
}

.loxi_navbar:hover {
    padding: 12px 30px;
    transform: translateY(-5px);
}

.navbar_item {
    font-family: 'GenSenRounded-R';
    text-decoration: none;
    font-size: 14px;
    color: var(--text-color);
    transition: var(--transition-base);
    padding: 4px 8px;
    border-radius: var(--border-radius);
    width: fit-content;

    &:hover {
        color: var(--theme-color);
        background-color: var(--navbar-hover);
    }

    &:focus {
        background-color: var(--theme-color);
        color: var(--background-color);
    }
}

.focus {
    background-color: var(--theme-color);
    color: var(--background-color);

    &:hover {
        background-color: var(--theme-color);
        color: var(--background-color);
    }
}
</style>
