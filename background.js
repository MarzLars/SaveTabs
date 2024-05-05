// background.js

// Instantiate TabManager to manage tab operations like saving and retrieving tabs.
const tabManager = new TabManager();

// Listener for when the Chrome extension is installed.
// Logs a message to the console to indicate successful installation.
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Saver extension installed.');
});

// Listener for when the extension icon is clicked.
// This triggers the `handleIconClick` function.
chrome.action.onClicked.addListener(handleIconClick);

/**
 * Handles the click event on the extension icon.
 * It queries the current window tabs, checks if there are any open tabs,
 * and if there are, it saves their URLs using the TabManager.
 * @param {Object} tab - The active tab when the icon is clicked.
 */
async function handleIconClick(tab) {
  try {
    // Query all tabs in the current window.
    const tabs = await queryTabs({currentWindow: true});
    // Check if there are no tabs open.
    if (tabs.length === 0) {
      console.error('No tabs open.');
      return;
    }

    // Filter out tabs that have valid URLs.
    const tabUrls = tabs.map(tab => tab.url).filter(url => url);
    // Check if there are no valid URLs.
    if (tabUrls.length === 0) {
      console.error('No valid URLs found in open tabs.');
      return;
    }

    // Save the URLs of the open tabs.
    await tabManager.saveTabs(tabUrls);
    console.log('Tabs saved.');
    // Notify the user that tabs have been saved.
    notifyUserTabsSaved();
  } catch (error) {
    console.error('Failed to save tabs:', error);
  }
}

/**
 * Queries tabs based on specified options.
 * @param {Object} queryOptions - Options to define which tabs to query.
 * @returns {Promise<Array>} A promise that resolves to an array of tabs.
 */
function queryTabs(queryOptions) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryOptions, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
}

/**
 * Notifies the user that their tabs have been successfully saved.
 * Uses Chrome's notification API to display a basic notification.
 */
function notifyUserTabsSaved() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon48.png',
    title: 'Tab Saver',
    message: 'Your tabs have been saved successfully.'
  });
}