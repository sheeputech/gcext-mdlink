import '../../node_modules/jquery/dist/jquery.js'
import '../../node_modules/popper.js/dist/popper.js'
import '../../node_modules/bootstrap/dist/js/bootstrap.js'
import { LinkManager } from './lib/link-manager.js'

window.addEventListener('load', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        // Get tab info
        const curTab = tabs[0]
        const pageUrl = curTab.url

        // format title string
        let pageTitle = String(curTab.title)
        const t = [[/（/g, '('], [/）/g, ')']]
        for (let i = 0; i < t.length; i++) {
            pageTitle = pageTitle.replace(t[i][0], t[i][1])
        }

        const linkManager = new LinkManager()

        linkManager.linkText.value = pageTitle
        linkManager.linkText.select()
        linkManager.updateLinkList()

        // copy link to clipboard and close popup on Enter pressed
        linkManager.linkText.addEventListener('keypress', function(e) {
            // Detect enter not simaltaneous with excluded keys
            // const excludedKeys = [e.shiftKey, e.ctrlKey, e.altKey, e.metaKey]
            if (e.keyCode === 13 || e.keyCode === 10) {
                linkManager.linkText = document.getElementById('linkText')
                const title = linkManager.linkText.value.replace(/(\[|\]|<|>|#|\|)/g, '\\$&')

                linkManager.clipLink(title, pageUrl)
                linkManager.updateLinkList(title, pageUrl)
            }
            if (e.keyCode === 10) {
                window.close()
            }
        })
        linkManager.linkListClipBtn.addEventListener('click', () => linkManager.clipAllLinks())
        linkManager.linkListClearBtn.addEventListener('click', () => linkManager.clearLinkList())
        linkManager.closeBtn.addEventListener('click', () => window.close())
    })
})
