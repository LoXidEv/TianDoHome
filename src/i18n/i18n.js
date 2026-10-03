import { createI18n } from 'vue-i18n'
import config from '@/config'

// 自动加载 src/i18n/locales 下的所有语言包，新增语言只需放入对应 .json 文件
const localeModules = import.meta.glob('./locales/*.json', { eager: true })

const messages = {}
for (const [path, module] of Object.entries(localeModules)) {
    const code = path.match(/([^/]+)\.json$/)?.[1]
    if (code) messages[code] = module.default
}

const storedLocale = localStorage.getItem('lang')
const availableLocales = Object.keys(messages)
const defaultLocale = config.site.defaultLocale

export const i18n = createI18n({
    legacy: false,
    locale: storedLocale && availableLocales.includes(storedLocale) ? storedLocale : defaultLocale,
    fallbackLocale: config.site.fallbackLocale || defaultLocale,
    messages,
})
