// sourced from https://github.com/movie-web/movie-web, with some linting and minimizing
import type { Fetcher } from '@movie-web/providers'
import type { MessageName, MessagesMetadata } from '@plasmohq/messaging'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'

// for some reason, about 500 ms is needed after page load before the extension starts responding properly
const isExtensionReady = new Promise<void>(r => setTimeout(r, 500))

async function sendMessage(messageName: MessageName, body = undefined, timeout = -1) {
  await isExtensionReady

  return new Promise<MessagesMetadata[MessageName]['res'] | null>((resolve) => {
    if (timeout >= 0) setTimeout(() => resolve(null), timeout)

    sendToBackgroundViaRelay({ name: messageName, body })
      .then(resolve)
      .catch(() => resolve(null))
  })
}

function getBodyTypeFromBody(body: unknown) {
  if (typeof body === 'string') return 'string'
  if (body instanceof FormData) return 'FormData'
  if (body instanceof URLSearchParams) return 'URLSearchParams'
  return 'object'
}

function convertBodyToObject(body: unknown) {
  if (body instanceof FormData || body instanceof URLSearchParams)
    return [...body]

  return body
}

function makeFinalHeaders(readHeaders: string[], headers: Record<string, string>) {
  const lowercasedHeaders = readHeaders.map(v => v.toLowerCase())
  return new Headers(
    Object.entries(headers).filter(entry =>
      lowercasedHeaders.includes(entry[0].toLowerCase()),
    ),
  )
}

export function makeExtensionFetcher() {
  const fetcher: Fetcher = async (url, ops) => {
    const result = await sendMessage('makeRequest', {
      url,
      ...ops,
      body: convertBodyToObject(ops.body),
      bodyType: getBodyTypeFromBody(ops.body),
    })
    if (!result?.success) throw new Error(`extension error: ${result?.error}`)
    const res = result.response
    return {
      body: res.body,
      finalUrl: res.finalUrl,
      statusCode: res.statusCode,
      headers: makeFinalHeaders(ops.readHeaders, res.headers),
    }
  }
  return fetcher
}
