import { LinkStorage } from './storage.js'

export class LinkManager {
    constructor() {
        this.linkStorage = new LinkStorage()
        this.linkText = document.getElementById('linkText')
        this.linkList = document.getElementById('linkList')
        this.linkListClipBtn = document.getElementById('linkListClipBtn')
        this.linkListClearBtn = document.getElementById('linkListClearBtn')
        this.closeBtn = document.getElementById('closeBtn')
    }

    async updateLinkList(title, url) {
        let links = []
        if (title && url) {
            links = await this.linkStorage.add(title, url)
        } else {
            links = await this.linkStorage.get()
        }

        while (this.linkList.firstChild) {
            this.linkList.removeChild(self.linkList.firstChild)
        }

        if (links.length > 0) {
            for (const link of links) {
                this.linkList.appendChild(this.makeLinkListItem(link.title, link.url))
            }
        }
    }

    async clearLinkList() {
        await this.linkStorage.clear()
        await this.updateLinkList()
    }

    makeLinkListItem(title, url) {
        const item = document.createElement('a')
        item.innerText = title
        item.setAttribute('href', url)
        item.setAttribute('target', '_blank')
        item.classList.add('list-group-item')
        item.classList.add('list-group-item-action')

        return item
    }

    clipLink(title, url) {
        this.setToClipboard(`[${title}](${url})`)
    }

    async clipAllLinks() {
        const links = await this.linkStorage.get()
        let content = ''
        for (let link of links) {
            content += `- [${link.title}](${link.url})\n`
        }
        this.setToClipboard(content)
    }

    setToClipboard(content) {
        const el = document.createElement('textarea')
        el.value = content
        el.setAttribute('readonly', '')
        el.style = { position: 'absolute', left: '-9999px' }
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
    }
}
