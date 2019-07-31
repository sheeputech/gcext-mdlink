export class LinkStorage {
    constructor() {
        this.storageKey = 'gcext-mdlink-links'
        this.links = {}
    }

    get() {
        const self = this
        return new Promise(function(resolve) {
            chrome.storage.sync.get([self.storageKey], function(result) {
                self.links = {}
                resolve(result[self.storageKey] || {})
            })
        })
    }

    set(obj) {
        const self = this
        return new Promise(function(resolve) {
            chrome.storage.sync.set({ [self.storageKey]: obj }, function() {
                self.links = obj
                resolve(true)
            })
        })
    }

    clear() {
        const self = this
        return new Promise(function(resolve) {
            chrome.storage.sync.set({ [self.storageKey]: {} }, function() {
                self.links = {}
                resolve(true)
            })
        })
    }
}
