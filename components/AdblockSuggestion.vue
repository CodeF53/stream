<script setup lang="ts">
import Bowser from 'bowser'

const popup: Ref<HTMLDialogElement | undefined> = ref()

// figure out what adblocker to suggest to the user
function getUrl() {
  const { userAgent } = navigator

  const ios = /iPhone|iPad|iPod/i.test(userAgent)
  if (ios) // open app store with the search term adblock
    return 'itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term=adblock'

  const browser = Bowser.getParser(userAgent).getBrowserName()
  const android = /Android/i.test(userAgent)
  if (android) {
    if (browser === 'Firefox')
      return 'https://addons.mozilla.org/en-US/android/addon/ublock-origin/'
    // search play store for ad blocking browsers
    return 'https://play.google.com/store/search?q=adblock'
  }

  switch (browser) {
    case 'Firefox':
      return 'https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/'
    case 'Safari':
      return 'https://apps.apple.com/us/app/adblock-for-safari/id1402042596'
    case 'Microsoft Edge':
      return 'https://microsoftedge.microsoft.com/addons/detail/ublock-origin/odfafepnkmbhccpbejgmiehpchacaeak'
    case 'Opera':
      return 'https://addons.opera.com/en/extensions/details/ublock/'
    default: // desktop, not firefox/safari/edge/opera, so likely chrome/chromium
      return 'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm'
  }
}
const installUrl: Ref<string> = ref('')

onMounted(async () => {
  installUrl.value = getUrl()

  // if user has dismissed warning before, don't show it again
  const dismissed = !!localStorage.getItem('dismissedAdblockWarning')

  if (!dismissed && !(await hasAdblock()))
    popup.value!.showModal()
})

function dismiss() {
  popup.value!.close()
  localStorage.setItem('dismissedAdblockWarning', 'true')
}
</script>

<template>
  <dialog id="noAdblock" ref="popup" class="col gap2">
    <img src="~/assets/img/noAdblock.webp" alt="No AdBlock?">
    <p>
      It looks like you aren't using an adblocker!
    </p>
    <p>
      The sources for video on this website contain ads which are not only annoying, but potentially malicious.
    </p>
    <NuxtLink class="input accent" :to="installUrl" target="_blank">
      Get an ad blocker
    </NuxtLink>
    <button @click="dismiss">
      I'll take the risk
    </button>
  </dialog>
</template>

<style lang="scss">
#noAdblock {
  &:not([open]) { display: none; }

  background-color: var(--b000);
  max-width: 20rem;
  border: none;
  &, > img { border-radius: 1rem; }

  > a, > button {
    font-size: 1rem;
    width: 16rem;
    align-self: center;
    text-align: center;
  }
}
::backdrop { backdrop-filter: blur(.25rem); }
</style>
