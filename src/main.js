import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import 'animate.css'
import { i18n } from '@/i18n/i18n'
import { applyTheme, applySiteMeta } from '@/config'

// 主题与站点信息统一来自 src/config/website.json
applyTheme()
applySiteMeta()

const app = createApp(App)

// v-reveal：元素滚动进入视口时播放 animate.css 动画，播放完自动清理类，
// 避免 animate.css 的 fill-mode 残留影响元素自身的悬停位移等效果。
// 用法：v-reveal | v-reveal="'fadeInLeft'" | v-reveal="120" | v-reveal="{ animation: 'zoomIn', delay: 200 }"
const reveal = {
    mounted(el, binding) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let options = { animation: 'fadeInUp', delay: 0 }
        if (typeof binding.value === 'string') options.animation = binding.value
        else if (typeof binding.value === 'number') options.delay = binding.value
        else if (binding.value && typeof binding.value === 'object') options = { ...options, ...binding.value }

        el.classList.add('reveal-hidden')

        const play = () => {
            el.classList.remove('reveal-hidden')
            el.classList.add('animate__animated', `animate__${options.animation}`)
            if (options.delay) el.style.animationDelay = `${options.delay}ms`
            el.addEventListener(
                'animationend',
                () => {
                    el.classList.remove('animate__animated', `animate__${options.animation}`)
                    el.style.removeProperty('animation-delay')
                },
                { once: true }
            )
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                play()
                observer.disconnect()
            },
            { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
        )
        observer.observe(el)
        el._revealObserver = observer
    },
    unmounted(el) {
        if (el._revealObserver) el._revealObserver.disconnect()
    },
}
app.directive('reveal', reveal)

app.use(router)
app.use(i18n)

app.mount('#app')
