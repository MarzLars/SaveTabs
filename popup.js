//popup.js
/**
 * Initializes the application once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tabManager = new TabManager();
    const uiManager = new UIManager(tabManager);

    setupEventListeners(tabManager, uiManager);
});

/**
 * Sets up event listeners for various user interactions.
 * @param {TabManager} tabManager - The instance managing tab operations.
 * @param {UIManager} uiManager - The instance managing UI operations.
 */
function setupEventListeners(tabManager, uiManager) {
    document.getElementById('saveTabs').addEventListener('click', () => saveTabs(tabManager, uiManager));
    document.getElementById('exportTabs').addEventListener('click', () => exportTabs(tabManager));
    document.getElementById('importTabs').addEventListener('click', () => importTabs(tabManager, uiManager));
}

/**
 * Saves the current window's tabs and displays them in the UI.
 * @param {TabManager} tabManager - The instance managing tab operations.
 * @param {UIManager} uiManager - The instance managing UI operations.
 */
async function saveTabs(tabManager, uiManager) {
    try {
        const tabs = await chrome.tabs.query({currentWindow: true});
        const tabUrls = tabs.map(tab => tab.url);
        await tabManager.saveTabs(tabUrls);
        console.log('Tabs saved.');
        uiManager.displaySavedTabs(tabUrls);
    } catch (error) {
        console.error('Failed to save tabs:', error);
    }
}

/**
 * Exports the saved tabs to a text file that the user can download.
 * @param {TabManager} tabManager - The instance managing tab operations.
 */
async function exportTabs(tabManager) {
    try {
        const url = await tabManager.exportTabs();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tabs.txt';
        a.click();
        console.log('Exporting tabs:', url);
    } catch (error) {
        console.error('Failed to export tabs:', error);
    }
}

/**
 * Imports tabs from a selected text file and displays them in the UI.
 * @param {TabManager} tabManager - The instance managing tab operations.
 * @param {UIManager} uiManager - The instance managing UI operations.
 */
function importTabs(tabManager, uiManager) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.onchange = async event => {
        try {
            const file = event.target.files[0];
            const tabUrls = await tabManager.importTabs(file);
            uiManager.displaySavedTabs(tabUrls);
        } catch (error) {
            console.error('Failed to import tabs:', error);
        }
    };
    input.click();
}

document.getElementById('resizeButton').addEventListener('click', () => {
    const sizeInput = document.getElementById('sizeInput');
    const newSize = sizeInput.value;
    resizePopup(newSize);
});

function resizePopup(size) {
    const app = document.getElementById('app');
    const whiteBox = document.getElementById('whiteBox'); // Get the white box element

    app.style.width = `${size}px`;
    app.style.height = `${size}px`;

    whiteBox.style.width = `${size}px`; // Set the width of the white box
    whiteBox.style.height = `${size}px`; // Set the height of the white box
}