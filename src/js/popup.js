import '../../node_modules/jquery/dist/jquery.js'
import '../../node_modules/popper.js/dist/popper.js'
import '../../node_modules/bootstrap/dist/js/bootstrap.js'
import './lib/storage.js'
import { LinkStorage } from './lib/storage.js'

class Popup {
    constructor() {
        this.linkList = document.getElementById('linkList')
        this.linkListClipBtn = document.getElementById('linkListClipBtn')
        this.linkListClearBtn = document.getElementById('linkListClearBtn')
        this.closeBtn = document.getElementById('closeBtn')
        this.linkStorage = new LinkStorage()
    }

    clearLinkStorage() {
        const self = this
        this.linkStorage.clear().then(function(result) {
            console.log('storage.clear status: ', result)
            self.updateLinkList()
        })
    }

    addLinkToStorage(title, url) {
        const self = this
        this.linkStorage.get().then(function(links) {
            links[url] = title
            self.linkStorage.set(links)
        })
    }

    clipAllLinks() {
        let linkStr = ''
        for (const [url, title] of Object.entries(this.linkStorage.links)) {
            linkStr += `- [${title}](${url})\n`
        }
        setClipboard(linkStr)
    }

    updateLinkList() {
        const self = this
        this.linkStorage.get().then(function(links) {
            while (self.linkList.firstChild) {
                self.linkList.removeChild(self.linkList.firstChild)
            }
            if (Object.keys(links).length > 0) {
                for (const [url, title] of Object.entries(links)) {
                    const linkItem = self.generateLinkListItem(title, url)
                    self.linkList.appendChild(linkItem)
                }
            }
        })
    }

    generateLinkListItem(title, url) {
        const linkElem = document.createElement('a')
        linkElem.innerText = title
        linkElem.setAttribute('href', url)
        linkElem.setAttribute('target', '_blank')
        linkElem.classList.add('list-group-item')
        linkElem.classList.add('list-group-item-action')

        return linkElem
    }
}

function setClipboard(content) {
    const el = document.createElement('textarea')
    el.value = content
    el.setAttribute('readonly', '')
    el.style = { position: 'absolute', left: '-9999px' }
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
}

window.addEventListener('load', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        const curTab = tabs[0]
        const pageUrl = curTab.url
        let pageTitle = String(curTab.title)
        let linkText = document.getElementById('linkText')
        const popup = new Popup()

        // format title string
        const t = [[/（/g, '('], [/）/g, ')']]
        for (let i = 0; i < t.length; i++) {
            pageTitle = pageTitle.replace(t[i][0], t[i][1])
        }

        linkText.value = pageTitle
        linkText.select()
        popup.updateLinkList()

        // copy link to clipboard and close popup on Enter pressed
        linkText.addEventListener('keypress', function(e) {
            console.log(e)

            // Detect enter not simaltaneous with excluded keys
            const excludedKeys = [e.shiftKey, e.ctrlKey, e.altKey, e.metaKey]
            if (e.keyCode === 13 && excludedKeys.indexOf(true) === -1) {
                linkText = document.getElementById('linkText')
                const title = linkText.value.replace(/(\[|\]|<|>|#|\|)/g, '\\$&')
                setClipboard(`[${title}](${pageUrl})`)

                // Add to chrome.storage
                popup.updateLinkList()
            }
            if (e.ctrlKey && e.keyCode === 13) {
                linkText = document.getElementById('linkText')
                const title = linkText.value.replace(/(\[|\]|<|>|#|\|)/g, '\\$&')
                setClipboard(`[${title}](${pageUrl})`)

                // Add to chrome.storage
                popup.updateLinkList()

                window.close()
            }
        })
        popup.linkListClipBtn.addEventListener('click', popup.clipAllLinks)
        popup.linkListClearBtn.addEventListener('click', popup.clearLinkStorage)
        popup.closeBtn.addEventListener('click', () => window.close())
    })
})
