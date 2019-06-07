let pageTitle = ''
let pageUrl = ''

chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    const curTab = tabs[0]
    pageTitle = curTab.title
    pageUrl = curTab.url
})

window.addEventListener('load', () => {
    // make markdown link by title and URL of the page
    const link = document.getElementById('link')
    link.value = `[${pageTitle}](${pageUrl})`

    // copy to clipboard
    const clipBtn = document.getElementById('clipBtn')
    clipBtn.addEventListener('click', () => {
        link.select()
        document.execCommand('copy')
    })
})
