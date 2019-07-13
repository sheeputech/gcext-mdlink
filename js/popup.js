window.addEventListener('load', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        const curTab = tabs[0]
        const pageUrl = curTab.url
        let pageTitle = String(curTab.title)
        let link = document.getElementById('linkText')

        // format title string
        const t = [[/（/g, '('], [/）/g, ')']]
        for (let i = 0; i < t.length; i++) {
            pageTitle = pageTitle.replace(t[i][0], t[i][1])
        }

        link.value = pageTitle
        link.select()

        // format markdown link on copy
        document.addEventListener('copy', e => {
            e.preventDefault()
            link = document.getElementById('linkText')
            const title = link.value.replace(/(\[|\]|<|>|#|\|)/g, '\\$&')
            e.clipboardData.setData('text/plain', `[${title}](${pageUrl})`)
        })

        // copy link to clipboard and close popup on Enter pressed
        link.addEventListener('keypress', e => {
            const excludedKeys = [e.shiftKey, e.ctrlKey, e.altKey]
            if (e.keyCode === 13 && excludedKeys.indexOf(true) === -1) {
                document.execCommand('copy')
                window.close()
            }
        })
    })
})
