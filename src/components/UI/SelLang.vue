<script>
import { useI18n } from 'vue-i18n'

export default {
    setup() {
        const { locale } = useI18n()
        return { locale }
    },
    data() {
        return {
            showLanguageMenu: false,
            languages: [
                {
                    code: 'en',
                    name: 'English'
                },
                {
                    code: 'zh',
                    name: '简体中文'
                },
                {
                    code: 'tc',
                    name: '繁體中文'
                },
            ]
        }
    },
    computed: {
        selected() {
            const currentCode = this.locale || localStorage.getItem('lang') || 'zh'
            return this.getLangName(currentCode)
        }
    },
    methods: {
        getLangName(code) {
            return this.languages.find(lang => lang.code == code)?.name || code
        },
        selectLanguage(language) {
            this.changeLanguage(language.code)
        },
        changeLanguage(langCode) {
            this.locale = langCode
            localStorage.setItem('lang', langCode)
            this.showLanguageMenu = false
        },
    },
    mounted() {
        this.locale = localStorage.getItem('lang') || 'zh'
    }
}
</script>

<template>
    <div class="lang_list" :style="{ width: showLanguageMenu ? '100%' : '0' }">
        <button :class="{ 'active': language.code == locale }" v-for="language in languages" :key="language.code"
            @click="selectLanguage(language)">
            {{ getLangName(language.code) }}
        </button>
    </div>
    <button class="lang_selected" @click="showLanguageMenu = !showLanguageMenu">
        {{ selected }}
        <img src="/img/icon/lang.png" width="20" alt="Language Icon">
    </button>
</template>

<style scoped>
.lang_selected {
    background-color: transparent;
    border: none;
    word-break: keep-all;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: bold;
    background-color: var(--navbar-hover-2);
    padding: 4px 8px;
    border-radius: var(--border-radius);
}

.lang_list {
    width: 0;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-end;
    transition: width var(--duration-base) var(--ease-out);
    overflow: hidden;
}

.lang_list button {
    color: var(--text-color);
    font-family: 'GenSenRounded-R';
    height: 30px;
    background-color: transparent;
    border: none;
    word-break: keep-all;
    padding: 4px 8px;
    border-radius: var(--border-radius);
    transition: var(--transition-base);
}

.lang_list button:hover {
    background-color: var(--navbar-hover-2);
}

.lang_list button.active {
    background-color: var(--navbar-hover-2);
}
</style>
