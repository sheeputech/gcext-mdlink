window.addEventListener('load', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        const curTab = tabs[0]
        const pageTitle = curTab.title
        const pageUrl = curTab.url
        const link = document.getElementById('link')
        link.value = `[${pageTitle}](${pageUrl})`
        link.select()
        document.execCommand('copy')

        // copy to clipboard
        const clipBtn = document.getElementById('clipBtn')
        clipBtn.addEventListener('click', () => {
            link.select()
            document.execCommand('copy')
        })
    })
})
