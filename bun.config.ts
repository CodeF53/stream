import fs from 'node:fs'
import path from 'node:path'

async function build() {
  const result = await Bun.build({
    sourcemap: 'external',
    entrypoints: ['app/javascript/application.ts'],
    outdir: path.join(process.cwd(), 'app/assets/builds'),
  })
  if (result.success) return

  // quit with an error if not hot-reloading
  if (!process.argv.includes('--watch'))
    throw new AggregateError(result.logs, 'Build failed')
  // otherwise print a stacktrace and try again next edit
  console.error('Build failed')
  for (const message of result.logs)
    console.error(message)
}

await build()

if (!process.argv.includes('--watch')) process.exit(0)

fs.watch(path.join(process.cwd(), 'app/javascript'), { recursive: true }, (eventType, filename) => {
  console.log(`File changed: ${filename}. Rebuilding...`)
  build()
})
