//tabManager.js
// Constants
const TAB_URLS_KEY = 'tabUrls';
const TEXT_PLAIN = 'text/plain';

/**
 * Manages the operations related to browser tab URLs storage and retrieval.
 */
class TabManager {
    /**
     * Initializes the TabManager with necessary configuration.
     */
    constructor() {
        this.tabUrlsKey = TAB_URLS_KEY; // Key used for storing tab URLs in local storage.
    }

    /**
     * Saves the array of tab URLs to the local storage.
     * @param {Array<string>} tabUrls - Array of URLs to be saved.
     * @throws {Error} Throws an error if saving to local storage fails.
     */
    async saveTabs(tabUrls) {
        try {
            await chrome.storage.local.set({[this.tabUrlsKey]: tabUrls});
        } catch (error) {
            throw new Error(`Failed to save tabs: ${error.message || error}`);
        }
    }

    /**
     * Retrieves the array of tab URLs from the local storage.
     * @returns {Promise<Array<string>>} A promise that resolves to an array of URLs.
     * @throws {Error} Throws an error if retrieving from local storage fails.
     */
    async getTabs() {
        try {
            const result = await chrome.storage.local.get(this.tabUrlsKey);
            return result[this.tabUrlsKey] || [];
        } catch (error) {
            throw new Error(`Failed to retrieve tabs: ${error.message || error}`);
        }
    }

    /**
     * Exports the stored tab URLs as a downloadable text file.
     * @returns {Promise<string>} A promise that resolves to the URL of the created blob object.
     * @throws {Error} Throws an error if the export operation fails.
     */
    async exportTabs() {
        try {
            const tabUrls = await this.getTabs();
            const blob = new Blob([tabUrls.join('\n')], {type: TEXT_PLAIN});
            return URL.createObjectURL(blob);
        } catch (error) {
            throw new Error(`Failed to export tabs: ${error.message || error}`);
        }
    }

    /**
     * Imports tab URLs from a text file and saves them to local storage.
     * @param {File} file - The file from which to import the URLs.
     * @returns {Promise<Array<string>>} A promise that resolves to the array of URLs read from the file.
     * @throws {Error} Throws an error if the file reading or URL import fails.
     */
    async importTabs(file) {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const urls = reader.result.split('\n');
                    await this.saveTabs(urls);
                    resolve(urls);
                } catch (error) {
                    reject(new Error(`Failed to import tabs: ${error.message || error}`));
                }
            };
            reader.onerror = () => reject(new Error(`Error reading file: ${reader.error}`));
            reader.readAsText(file);
        });
    }
}