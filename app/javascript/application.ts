import '@hotwired/turbo-rails'
import type { ScrapeMedia, Stream } from '@movie-web/providers'
import { makeProviders, targets } from '@movie-web/providers'
import 'alpine-turbo-drive-adapter'
import Alpine from 'alpinejs'
import Hls from 'hls.js'
import { makeExtensionFetcher } from './extensionFetcher'

const providers = makeProviders({
  fetcher: makeExtensionFetcher(),
  target: targets.BROWSER_EXTENSION,
  consistentIpForRequests: true,
})

const hls = new Hls()
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  Alpine.store('player').qualities = ['auto', ...hls.levels.map(l => l.height)]
  Alpine.store('player').qualityIndex = 0
})

Alpine.store('player', {
  streams: [],
  streamIndex: -1,
  stream: null,
  qualities: [],
  qualityIndex: -1,

  clear() {
    this.streams = []
    this.streamIndex = -1
    this.stream = null
    this.qualities = []
    this.qualityIndex = -1
  },

  addStream(name: string, stream: Stream) {
    // ignore HLS streams on devices that don't support them
    if (stream.type === 'hls' && !Hls.isSupported())
      return
    // ignore IP-locked streams
    if (stream.flags.includes('ip-locked'))
      return

    this.streams.push({ name, ...stream })
    // start playing from it if this is the first valid stream we found
    if (this.streamIndex === -1)
      this.setStream(0)
  },

  getPlayer() {
    const player = document.getElementById('player') as HTMLVideoElement
    return { player, timeCache: player.currentTime }
  },

  setStream(index) {
    this.streamIndex = Number.parseInt(index)
    this.stream = this.streams[this.streamIndex]
    this.qualities = []
    this.qualityIndex = -1

    if (this.stream.type === 'file') {
      this.qualities = Object.keys(this.stream.qualities)
      this.setQuality(this.qualities.length - 1)
    }
    else {
      hls.loadSource(this.stream.playlist)
      const { player, timeCache } = this.getPlayer()
      hls.attachMedia(player)
      player.currentTime = timeCache
    }
  },

  setQuality(index) {
    this.qualityIndex = Number.parseInt(index)
    const { player, timeCache } = this.getPlayer()

    if (this.stream.type === 'file')
      player.src = this.stream.qualities[this.qualities[this.qualityIndex]].url
    else
      hls.currentLevel = index - 1

    player.currentTime = timeCache
  },
})

window.getStreams = function (media: ScrapeMedia) {
  providers.listSources().forEach(async ({ id, name }) => {
    let embeds = []
    try {
      embeds = (await providers.runSourceScraper({ id, media })).embeds
    }
    catch {}

    embeds.forEach(async ({ embedId, url }) => {
      let streams = []
      try {
        streams = (await providers.runEmbedScraper({ id: embedId, url })).stream
      }
      catch {}

      for (const stream of streams)
        Alpine.store('player').addStream(`${name} - ${embedId}`, stream)
    })
  })
}

window.Alpine = Alpine
Alpine.start()
