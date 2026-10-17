<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import config from '@/config'
import { getPlaylistDetail, getPlaylistTracks, getSongUrl } from '@/api/music'

const props = defineProps({
  menuOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open'])

const { t } = useI18n()
const music = config.music
const assets = config.assets

const audioEl = ref(null)
const isOpen = ref(false)
const playlist = ref(null)
const tracks = ref([])
const currentIndex = ref(-1)
const playlistLoading = ref(false)
const playlistError = ref(false)
const trackStatus = ref('idle') // idle | loading | ready | error
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const notice = ref('')

// 失败重试策略：同一首歌最多尝试 maxAttempts 次，每次间隔 retryDelay 毫秒
const maxAttempts = Math.max(1, Number(music.maxAttempts) || 3)
const retryDelay = Math.max(0, Number(music.retryDelay) || 1200)

let playlistToken = 0
let trackToken = 0
let loadTimer = null
let retryTimer = null
let failedToken = -1
let attempts = 0
let pendingAutoplay = false
let seeking = false

const currentTrack = computed(() => tracks.value[currentIndex.value] || null)
const isReady = computed(() => trackStatus.value === 'ready')
const canControl = computed(
  () => !playlistLoading.value && !playlistError.value && tracks.value.length > 0
)
const canOperate = computed(() => canControl.value && trackStatus.value !== 'loading')
const coverSrc = computed(
  () => currentTrack.value?.cover || playlist.value?.cover || assets.logo
)
const progress = computed(() =>
  duration.value > 0 ? Math.min(100, (currentTime.value / duration.value) * 100) : 0
)

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function clearLoadTimer() {
  if (loadTimer) {
    clearTimeout(loadTimer)
    loadTimer = null
  }
}

function clearRetryTimer() {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
}

function close() {
  isOpen.value = false
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) return
  emit('open')
  // 首次打开时再请求歌单，避免每次进入站点都发起网络请求
  if (!playlist.value && !playlistLoading.value && !playlistError.value) {
    loadPlaylist()
  }
}

async function loadPlaylist() {
  playlistLoading.value = true
  playlistError.value = false
  notice.value = ''
  clearLoadTimer()
  clearRetryTimer()
  attempts = 0
  failedToken = -1
  const token = ++playlistToken

  try {
    const [detail, list] = await Promise.all([
      getPlaylistDetail(music.apiBase, music.playlistId),
      getPlaylistTracks(music.apiBase, music.playlistId, music.limit),
    ])
    if (token !== playlistToken) return

    playlist.value = detail
    tracks.value = list
    currentIndex.value = list.length ? 0 : -1
    trackStatus.value = 'idle'
    currentTime.value = 0
    duration.value = list.length ? list[0].duration : 0
    if (!list.length) notice.value = t('music.empty')
  } catch (error) {
    if (token !== playlistToken) return
    playlistError.value = true
    notice.value = t('music.playlistError')
  } finally {
    if (token === playlistToken) playlistLoading.value = false
  }
}

function handleFailure(index, token) {
  if (token !== trackToken) return
  if (index !== currentIndex.value) return
  // 同一次尝试可能同时触发 timeout / error 等多个回调，这里去重
  if (failedToken === token) return
  failedToken = token

  clearLoadTimer()
  isPlaying.value = false
  pendingAutoplay = false
  trackStatus.value = 'error'

  // 智能检测：断网时不再空转重试
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    notice.value = t('music.offline')
    return
  }

  // 未达到上限时自动重试当前歌曲，不切换到下一首
  if (attempts < maxAttempts) {
    notice.value = t('music.retrying', { current: attempts, total: maxAttempts })
    retryTimer = setTimeout(() => {
      if (index === currentIndex.value && trackStatus.value === 'error') {
        selectTrack(index, true, true)
      }
    }, retryDelay)
    return
  }

  // 达到上限后停止尝试，交给用户决定重试或换歌，避免无限循环
  notice.value = t('music.playFailed')
}

async function selectTrack(index, autoplay = true, isRetry = false) {
  if (!canControl.value) return
  if (index < 0 || index >= tracks.value.length) return
  if (trackStatus.value === 'loading' && index === currentIndex.value) return

  // 用户主动切歌时重置次数；自动重试则沿用当前尝试次数
  if (!isRetry) {
    attempts = 0
    clearRetryTimer()
  }

  const token = ++trackToken
  const audio = audioEl.value
  if (!audio) return

  clearLoadTimer()
  pendingAutoplay = autoplay
  attempts += 1
  trackStatus.value = 'loading'
  isPlaying.value = false
  currentTime.value = 0
  currentIndex.value = index
  duration.value = tracks.value[index].duration || 0
  notice.value = ''

  audio.pause()
  audio.removeAttribute('src')
  audio.load()

  // 加载超时兜底，防止一直停留在 loading 状态
  loadTimer = setTimeout(() => {
    if (token === trackToken && trackStatus.value === 'loading') handleFailure(index, token)
  }, 15000)

  try {
    const url = await getSongUrl(music.apiBase, tracks.value[index].id, music.level)
    if (token !== trackToken) return
    if (!url) {
      handleFailure(index, token)
      return
    }
    audio.src = url
    audio.load()
  } catch (error) {
    if (token !== trackToken) return
    handleFailure(index, token)
  }
}

function doPlay() {
  const audio = audioEl.value
  if (!audio || trackStatus.value !== 'ready') return
  const result = audio.play()
  if (result && typeof result.catch === 'function') {
    result.catch(() => {
      isPlaying.value = false
      notice.value = t('music.playBlocked')
    })
  }
}

function togglePlay() {
  if (!canOperate.value || currentIndex.value < 0) return
  if (trackStatus.value !== 'ready') {
    selectTrack(currentIndex.value, true)
    return
  }
  if (audioEl.value.paused) doPlay()
  else audioEl.value.pause()
}

function playNext() {
  if (!canOperate.value) return
  const total = tracks.value.length
  if (!total) return
  selectTrack((currentIndex.value + 1) % total, true)
}

function playPrev() {
  if (!canOperate.value) return
  const total = tracks.value.length
  if (!total) return
  selectTrack((currentIndex.value - 1 + total) % total, true)
}

function seekFromEvent(event) {
  if (!isReady.value || !duration.value || !audioEl.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const time = ratio * duration.value
  audioEl.value.currentTime = time
  currentTime.value = time
}

function onSeekStart(event) {
  if (!isReady.value) return
  seeking = true
  event.currentTarget.setPointerCapture?.(event.pointerId)
  seekFromEvent(event)
}

function onSeekMove(event) {
  if (seeking) seekFromEvent(event)
}

function onSeekEnd(event) {
  if (!seeking) return
  seeking = false
  event.currentTarget.releasePointerCapture?.(event.pointerId)
}

function onSeekKey(event) {
  if (!isReady.value || !duration.value || !audioEl.value) return
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  event.preventDefault()
  const step = event.key === 'ArrowRight' ? 5 : -5
  const time = Math.min(duration.value, Math.max(0, audioEl.value.currentTime + step))
  audioEl.value.currentTime = time
  currentTime.value = time
}

function onTimeUpdate() {
  if (audioEl.value) currentTime.value = audioEl.value.currentTime
}

function onLoadedMetadata() {
  const value = audioEl.value?.duration
  if (Number.isFinite(value) && value > 0) duration.value = value
}

function onCanPlay() {
  clearLoadTimer()
  clearRetryTimer()
  // 播放成功后重置重试计数，避免后续偶发错误被误判为连续失败
  attempts = 0
  failedToken = -1
  if (trackStatus.value === 'loading' || trackStatus.value === 'idle') {
    trackStatus.value = 'ready'
  }
  if (pendingAutoplay) {
    pendingAutoplay = false
    doPlay()
  }
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function onEnded() {
  playNext()
}

function onAudioError() {
  const audio = audioEl.value
  // 切歌时清空 src 也可能触发 error，此时不应计入当前歌曲的失败次数
  if (!audio || !audio.src) return
  if (trackStatus.value === 'loading' || trackStatus.value === 'ready') {
    handleFailure(currentIndex.value, trackToken)
  }
}

// 打开导航菜单时收起音乐面板，避免两个浮层重叠
watch(
  () => props.menuOpen,
  (open) => {
    if (open) isOpen.value = false
  }
)

onBeforeUnmount(() => {
  playlistToken += 1
  trackToken += 1
  clearLoadTimer()
  clearRetryTimer()
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.removeAttribute('src')
    audioEl.value.load()
  }
})
</script>

<template>
  <Transition name="music">
    <div v-if="isOpen" class="music_panel">
      <div class="panel_header">
        <span class="panel_title">{{ $t('title.music') }}</span>
        <button class="panel_close" :aria-label="$t('music.close')" @click="close">×</button>
      </div>

      <div v-if="playlistLoading" class="panel_state">
        <span class="spinner"></span>
        <span>{{ $t('music.loadingPlaylist') }}</span>
      </div>

      <div v-else-if="playlistError" class="panel_state">
        <span>{{ $t('music.playlistError') }}</span>
        <button class="loxi_button" @click="loadPlaylist">{{ $t('music.retry') }}</button>
      </div>

      <template v-else>
        <div class="now">
          <div class="cover_wrap">
            <img :src="coverSrc" :alt="currentTrack?.title || $t('music.playlist')" class="cover">
            <div v-if="trackStatus === 'loading'" class="cover_overlay">
              <span class="spinner"></span>
            </div>
          </div>
          <div class="now_info">
            <div class="now_title" :title="currentTrack?.title || $t('music.playlist')">
              {{ currentTrack?.title || $t('music.playlist') }}
            </div>
            <div class="now_artist" :title="currentTrack?.artist || $t('music.unknownArtist')">
              {{ currentTrack?.artist || $t('music.unknownArtist') }}
            </div>
          </div>
          <div class="controls">
            <button class="control_btn" :disabled="!canOperate" :aria-label="$t('music.previous')"
              @click="playPrev">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>
            <button class="control_btn primary" :disabled="!canOperate"
              :aria-label="isPlaying ? $t('music.pause') : $t('music.play')" @click="togglePlay">
              <span v-if="trackStatus === 'loading'" class="spinner spinner_small"></span>
              <svg v-else-if="isPlaying" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M7 5h4v14H7zm6 0h4v14h-4z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button class="control_btn" :disabled="!canOperate" :aria-label="$t('music.next')"
              @click="playNext">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="progress_row">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress" :class="{ disabled: !isReady }" role="slider" tabindex="0"
            :aria-valuemin="0" :aria-valuemax="Math.round(duration)" :aria-valuenow="Math.round(currentTime)"
            :aria-label="$t('music.progress')" @pointerdown="onSeekStart" @pointermove="onSeekMove"
            @pointerup="onSeekEnd" @pointercancel="onSeekEnd" @keydown="onSeekKey">
            <div class="progress_track">
              <div class="progress_fill" :style="{ width: progress + '%' }"></div>
              <div class="progress_knob" :style="{ left: progress + '%' }"></div>
            </div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>

        <div v-if="notice" class="notice">{{ notice }}</div>

        <div class="playlist_header">
          <span class="playlist_name">{{ playlist?.name || $t('music.playlist') }}</span>
          <span v-if="tracks.length" class="playlist_count">{{ $t('music.tracks', { count: tracks.length }) }}</span>
        </div>

        <div v-if="!tracks.length" class="panel_state panel_state_small">
          <span>{{ $t('music.empty') }}</span>
        </div>
        <div v-else class="playlist_items">
          <button v-for="(track, index) in tracks" :key="track.id" class="playlist_item"
            :class="{ active: index === currentIndex }" :disabled="!canControl || trackStatus === 'loading'"
            @click="selectTrack(index)">
            <span class="item_index">
              <span v-if="index === currentIndex && isPlaying" class="eq" aria-hidden="true">
                <i></i><i></i><i></i>
              </span>
              <template v-else>{{ String(index + 1).padStart(2, '0') }}</template>
            </span>
            <span class="item_main">
              <span class="item_title">{{ track.title }}</span>
              <span class="item_artist">{{ track.artist || $t('music.unknownArtist') }}</span>
            </span>
            <span class="item_time">{{ formatTime(track.duration) }}</span>
          </button>
        </div>
      </template>
    </div>
  </Transition>

  <audio ref="audioEl" class="music_audio" preload="auto" @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata" @canplay="onCanPlay" @play="onPlay" @pause="onPause"
    @ended="onEnded" @error="onAudioError"></audio>

  <button class="music_toggle" :class="{ active: isOpen, playing: isPlaying }"
    :aria-label="$t('navbar.music')" :aria-expanded="isOpen" @click="toggleOpen">
    <span v-if="isPlaying" class="toggle_eq" aria-hidden="true">
      <i></i><i></i><i></i>
    </span>
    <svg v-else viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" />
    </svg>
  </button>
</template>

<style scoped>
.music_audio {
  display: none;
}

.music_toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition-base);
}

.music_toggle:hover,
.music_toggle.active {
  background-color: var(--navbar-hover-2);
}

.music_toggle.playing {
  color: var(--theme-color);
}

.toggle_eq {
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  width: 24px;
  height: 18px;
}

.toggle_eq i {
  display: block;
  width: 3px;
  height: 100%;
  border-radius: var(--border-radius);
  background-color: currentColor;
  transform-origin: bottom;
  animation: musicEq 0.9s ease-in-out infinite;
}

.toggle_eq i:nth-child(1) {
  animation-delay: 0s;
}

.toggle_eq i:nth-child(2) {
  animation-delay: 0.2s;
}

.toggle_eq i:nth-child(3) {
  animation-delay: 0.4s;
}

.music_panel {
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 424px;
  max-width: calc(100vw - 20px);
  max-height: min(72vh, 620px);
  padding: 10px 12px;
  overflow: hidden;
  border-radius: var(--border-radius);
  background-color: var(--background-color-navbar);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transform: translateX(-50%);
}

.music-enter-active {
  transition: opacity var(--duration-base) ease, transform var(--duration-base) var(--ease-out);
}

.music-leave-active {
  transition: opacity var(--duration-fast) ease, transform var(--duration-fast) var(--ease-in-out);
}

.music-enter-from,
.music-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

.panel_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.panel_title {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9a9a9a;
}

.panel_close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #7a7a7a;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition-base);
}

.panel_close:hover {
  color: var(--theme-color);
  background-color: var(--navbar-hover);
}

.panel_state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 120px;
  padding: 20px 12px;
  font-size: 13px;
  color: #7a7a7a;
  text-align: center;
}

.panel_state_small {
  min-height: 0;
  padding: 20px 12px;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color);
  border-top-color: var(--theme-color);
  border-radius: 50%;
  animation: musicSpin 0.9s linear infinite;
}

.spinner_small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.45);
  border-top-color: #ffffff;
}

@keyframes musicSpin {
  to {
    transform: rotate(360deg);
  }
}

.now {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cover_wrap {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

.cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  user-select: none;
}

.cover_overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  background-color: var(--background-color-oc);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.now_info {
  flex: 1;
  min-width: 0;
}

.now_title {
  font-family: 'Poppins Bold', 'GenSenRounded-B';
  font-size: 14px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now_artist {
  font-size: 11px;
  color: #7a7a7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress_row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.time {
  flex-shrink: 0;
  min-width: 32px;
  font-family: 'Poppins Regular', 'GenSenRounded-R';
  font-size: 11px;
  color: #9a9a9a;
  text-align: center;
}

.progress {
  flex: 1;
  padding: 6px 0;
  cursor: pointer;
  touch-action: none;
  outline: none;
}

.progress.disabled {
  cursor: not-allowed;
}

.progress.disabled .progress_knob {
  background-color: #a7b2c6;
}

.progress:focus-visible .progress_knob {
  box-shadow: 0 0 0 4px var(--navbar-hover);
}

.progress_track {
  position: relative;
  height: 4px;
  border-radius: var(--border-radius);
  background-color: #c4ccd8;
}

.progress_fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--border-radius);
  background-color: var(--theme-color);
}

.progress_knob {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 4px;
  background-color: var(--theme-color);
  transform: translate(-50%, -50%);
}

.controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-left: auto;
}

.control_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition-base);
}

.control_btn:hover:not(:disabled) {
  color: var(--theme-color);
  background-color: var(--navbar-hover);
}

.control_btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control_btn.primary {
  width: 34px;
  height: 34px;
  color: #ffffff;
  background-color: var(--theme-color);
}

.control_btn.primary:hover:not(:disabled) {
  color: #ffffff;
  background-color: var(--theme-color);
}

.notice {
  margin-top: 6px;
  font-size: 12px;
  color: #b04a4a;
  text-align: center;
}

.playlist_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 4px 6px;
  margin-top: 6px;
  border-top: 2px solid var(--theme-color-3);
  font-size: 12px;
  color: #7a7a7a;
}

.playlist_name {
  font-weight: bold;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist_count {
  flex-shrink: 0;
}

.playlist_items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 200px;
  overflow-y: auto;
}

.playlist_item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: var(--border-radius);
  background-color: transparent;
  color: var(--text-color);
  text-align: left;
  cursor: pointer;
  transition: var(--transition-base);
}

.playlist_item:hover:not(:disabled) {
  background-color: var(--navbar-hover);
}

.playlist_item.active {
  color: #ffffff;
  background-color: var(--theme-color);
}

/* active 优先于 hover，避免悬停当前播放项时丢失 active 样式 */
.playlist_item.active:hover:not(:disabled) {
  color: #ffffff;
  background-color: var(--theme-color);
}

.playlist_item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.item_index {
  flex-shrink: 0;
  width: 22px;
  font-size: 12px;
  color: #9a9a9a;
  text-align: center;
}

.playlist_item.active .item_index {
  color: #ffffff;
}

.eq {
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 12px;
}

.eq i {
  display: block;
  width: 2px;
  height: 100%;
  border-radius: var(--border-radius);
  background-color: currentColor;
  transform-origin: bottom;
  animation: musicEq 0.9s ease-in-out infinite;
}

.eq i:nth-child(1) {
  animation-delay: 0s;
}

.eq i:nth-child(2) {
  animation-delay: 0.2s;
}

.eq i:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes musicEq {

  0%,
  100% {
    transform: scaleY(0.45);
  }

  50% {
    transform: scaleY(1);
  }
}

.item_main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.item_title,
.item_artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item_title {
  font-size: 13px;
}

.item_artist {
  font-size: 12px;
  color: #7a7a7a;
}

.playlist_item.active .item_artist {
  color: rgba(255, 255, 255, 0.8);
}

.item_time {
  flex-shrink: 0;
  font-size: 12px;
  color: #9a9a9a;
}

.playlist_item.active .item_time {
  color: rgba(255, 255, 255, 0.8);
}

@media screen and (max-width: 420px) {
  .now {
    gap: 8px;
  }

  .controls {
    gap: 4px;
  }

  .control_btn {
    width: 24px;
    height: 24px;
  }

  .control_btn.primary {
    width: 30px;
    height: 30px;
  }

  .now_title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    line-height: 1.15;
  }
}
</style>
