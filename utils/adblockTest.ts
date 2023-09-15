// various URLs from vidsrc that adblockers should block
const toTest = [
  'superherosnout.com',
  'gleagainedam.info',
  'bidgear.com',
  'coldvain.com',
]

// returns true if script loads (wasn't blocked)
function testResource(url: string): Promise<boolean> {
  return new Promise((resolve, _reject) => {
    const script = document.createElement('script')

    const yeetResolve = (resVal: boolean) => {
      document.querySelector(`script[src="https://${url}"]`)?.remove()
      resolve(resVal)
    }
    script.onload = () => yeetResolve(true)
    script.onerror = () => yeetResolve(false)

    script.src = `https://${url}`
    script.async = true
    document.body.appendChild(script)
  })
}

export async function hasAdblock() {
  const results = await Promise.all(toTest.map(testResource))
  // if any of the sites tested successfully loaded, user likely doesn't have an adblocker
  return !results.some(a => a)
}
