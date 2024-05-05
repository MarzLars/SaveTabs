// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Saver extension installed.');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    if (tabs.length === 0) {
      console.error('No tabs open.');
      return;
    }
    let tabUrls = tabs.map(tab => tab.url);
    chrome.storage.local.set({tabUrls: tabUrls}, function() {
      console.log('Tabs saved.');
      // Notify user that tabs have been saved
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'Tab Saver',
        message: 'Your tabs have been saved successfully.'
      });
    });
  });
});