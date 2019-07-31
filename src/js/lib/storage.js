export class LinkStorage {
    constructor() {
        this.key = 'gcext-mdlink-links'
    }

    async get() {
        const self = this
        return await new Promise(function(resolve) {
            chrome.storage.sync.get([self.key], function(result) {
                resolve(result[self.key] || [])
            })
        })
    }

    async add(title, url) {
        const self = this
        const links = await this.get()
        links.push({ title, url })

        return await new Promise(function(resolve) {
            chrome.storage.sync.set({ [self.key]: links }, function() {
                resolve(links)
            })
        })
    }

    async clear() {
        const self = this
        return await new Promise(function(resolve) {
            chrome.storage.sync.set({ [self.key]: [] }, function() {
                resolve([])
            })
        })
    }
}
