window.addEventListener('load', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        const curTab = tabs[0]
        const pageTitle = curTab.title
        const pageUrl = curTab.url
        const link = document.getElementById('linkText')

        link.value = String(pageTitle)
        link.select()

        // format markdown link on copy
        document.addEventListener('copy', e => {
            e.preventDefault()
            e.clipboardData.setData('text/plain', `[${link.value}](${pageUrl})`)
        })

        // copy link to clipboard and close popup on Enter pressed
        link.addEventListener('keypress', e => {
            e.preventDefault()

            const excludedKeys = [e.shiftKey, e.ctrlKey, e.altKey]
            if (e.keyCode === 13 && excludedKeys.indexOf(true) === -1) {
                document.execCommand('copy')
                window.close()
            }
        })
    })
})
