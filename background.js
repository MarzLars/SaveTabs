// background.js

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Saver extension installed.');
});

// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Query all tabs in the current window
  chrome.tabs.query({currentWindow: true}, (tabs) => {
    // Check if there are any tabs open
    if (tabs.length > 0) {
      // Extract URLs from tabs and filter out any empty values
      const tabUrls = tabs.map(tab => tab.url).filter(url => url);
      // Check if there are any valid URLs
      if (tabUrls.length > 0) {
        saveTabUrls(tabUrls); // Save the URLs if valid
      } else {
        console.error('No valid URLs found in open tabs.');
      }
    } else {
      console.error('No tabs open.');
    }
  });
});

// Function to save tab URLs to local storage
function saveTabUrls(tabUrls) {
  chrome.storage.local.set({tabUrls: tabUrls}, () => {
    console.log('Tabs saved.');
    notifyUserTabsSaved(); // Notify user after saving tabs
  });
}

// Function to create a notification for the user
function notifyUserTabsSaved() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon48.png',
    title: 'Tab Saver',
    message: 'Your tabs have been saved successfully.'
  });
}