import website from './website.json'

/**
 * 全站唯一配置源：src/config/website.json
 * 组件请统一通过 `import config from '@/config'` 读取，避免在代码中硬编码。
 */
export const config = website

// 配置项键名 -> CSS 变量名（用于把主题写入 :root）
const THEME_VAR_MAP = {
  textColor: '--text-color',
  themeColor: '--theme-color',
  themeColor2: '--theme-color-2',
  themeColor3: '--theme-color-3',
  borderColor: '--border-color',
  backgroundColor: '--background-color',
  navbarHover: '--navbar-hover',
  navbarHover2: '--navbar-hover-2',
  backgroundColorNavbar: '--background-color-navbar',
  backgroundColorOc: '--background-color-oc',
  borderRadius: '--border-radius',
  easeOut: '--ease-out',
  easeInOut: '--ease-in-out',
  durationFast: '--duration-fast',
  durationBase: '--duration-base',
  durationSlow: '--duration-slow',
}

/** 将 website.json 的 theme 配置写入根元素 CSS 变量 */
export function applyTheme(theme = config.theme) {
  if (!theme) return
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(THEME_VAR_MAP)) {
    if (theme[key] != null && theme[key] !== '') {
      root.style.setProperty(cssVar, theme[key])
    }
  }
}

/** 将站点基础信息（语言、标题图标）写入文档 */
export function applySiteMeta() {
  const { htmlLang, favicon } = config.site || {}
  if (htmlLang) document.documentElement.lang = htmlLang
  if (favicon) {
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = favicon
  }
}

export default config
