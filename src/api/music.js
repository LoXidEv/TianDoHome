// 音乐接口封装：基于 NeteaseCloudMusicApi（music.loxi.work）
// 当前播放器仅支持「歌单」模式。

const DEFAULT_TIMEOUT = 12000

async function fetchJson(url, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

const withBase = (base, path) => `${String(base).replace(/\/+$/, '')}${path}`

/** 歌单基本信息 */
export async function getPlaylistDetail(apiBase, playlistId) {
  const data = await fetchJson(
    withBase(apiBase, `/playlist/detail?id=${encodeURIComponent(playlistId)}`)
  )
  const playlist = data?.playlist
  if (!playlist) throw new Error('playlist unavailable')
  return {
    id: playlist.id,
    name: playlist.name,
    cover: playlist.coverImgUrl,
    trackCount: playlist.trackCount,
    creator: playlist.creator?.nickname || '',
  }
}

/** 歌单全部曲目 */
export async function getPlaylistTracks(apiBase, playlistId, limit = 1000) {
  const data = await fetchJson(
    withBase(
      apiBase,
      `/playlist/track/all?id=${encodeURIComponent(playlistId)}&limit=${encodeURIComponent(limit)}`
    )
  )
  const songs = Array.isArray(data?.songs) ? data.songs : []
  return songs.map((song) => ({
    id: song.id,
    title: song.name || '',
    artist: (song.ar || [])
      .map((artist) => artist.name)
      .filter(Boolean)
      .join(' / '),
    album: song.al?.name || '',
    cover: song.al?.picUrl || '',
    duration: (song.dt || 0) / 1000,
  }))
}

/** 获取单曲播放地址；不可播放时返回 null */
export async function getSongUrl(apiBase, songId, level = 'standard') {
  const result = await fetchJson(
    withBase(
      apiBase,
      `/song/url/match?id=${encodeURIComponent(songId)}&level=${encodeURIComponent(level)}`
    )
  )
  // /song/url/match 返回 { code, data: "音频地址", proxyUrl }
  const url = result?.data || result?.proxyUrl
  if (!url) return null
  // 接口返回的地址可能是 http，统一升级为 https，避免 HTTPS 页面触发混合内容拦截
  return String(url).replace(/^http:/, 'https:')
}
