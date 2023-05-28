// Default list of URLs.
let urls = [];

// Listen for a command from the popup script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'openUrls') {
        // Open each URL in a new tab.
        for (let url of urls) {
            chrome.tabs.create({ url });
        }
    } else if (request.cmd === 'addUrl') {
        // Add a URL to the list and save the updated list.
        urls.push(request.url);
        chrome.storage.sync.set({ urls });
    } else if (request.cmd === 'getUrls') {
        // Send the current list of URLs to the popup script.
        sendResponse({ urls });
    }
    return true;
});

// Load the saved list of URLs when the extension starts up.
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get('urls', (data) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (data.urls) {
            urls = data.urls;
        }
    });
});

// Create a new context menu item when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'addUrl',
        title: 'Add this URL to my extension',
        contexts: ['link'],
    });
});

// Handle the click event for the context menu item.
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addUrl' && info.linkUrl) {
        urls.push(info.linkUrl);
        chrome.storage.sync.set({ urls });
    }
});
