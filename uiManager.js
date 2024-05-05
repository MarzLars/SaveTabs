//uiManager.js
class UIManager {
    /**
     * Constructs the UIManager object with a reference to a tabManager and initializes the tabs list element.
     * @param {Object} tabManager - An instance of TabManager to manage tab operations.
     */
    constructor(tabManager) {
        this.tabManager = tabManager; // Stores the reference to the tab manager
        this.tabsListElement = document.getElementById('tabsList'); // Gets the DOM element for listing tabs
    }

    /**
     * Creates an HTML element with specified attributes and appends it to a parent element.
     * @param {string} tag - The tag name of the element to create.
     * @param {Object} attributes - An object containing key-value pairs of attributes.
     * @param {HTMLElement} parent - The parent element to which the new element will be appended.
     * @returns {HTMLElement} The newly created element.
     */
    createAndAppendElement(tag, attributes, parent) {
        const element = document.createElement(tag); // Creates a new element of the specified tag
        this.setAttributes(element, attributes); // Sets attributes on the element
        parent.appendChild(element); // Appends the element to the parent
        return element; // Returns the newly created element
    }

    /**
     * Sets attributes on an element, including adding event listeners for events.
     * @param {HTMLElement} element - The element on which to set attributes.
     * @param {Object} attributes - An object containing key-value pairs of attributes.
     */
    setAttributes(element, attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            if (key.startsWith('on') && typeof value === 'function') {
                // If the attribute is an event listener, add it properly
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else if (key === 'textContent') {
                // If the attribute is textContent, set it directly on the element
                element.textContent = value;
            } else {
                // Otherwise, set it as a regular attribute
                element.setAttribute(key, value);
            }
        }
    }

    /**
     * Displays a list of saved tabs as clickable links in a list.
     * @param {Array<string>} tabUrls - An array of URLs to display as list items.
     */
    displaySavedTabs(tabUrls) {
        this.tabsListElement.innerHTML = ''; // Clears the current list
        const fragment = document.createDocumentFragment(); // Creates a document fragment to avoid multiple reflows
        tabUrls.forEach(url => {
            const listItem = this.createAndAppendElement('li', {}, fragment); // Creates a list item
            this.createAndAppendElement('a', {
                href: url,
                target: '_blank',
                textContent: url
            }, listItem); // Creates a link and appends it to the list item
        });
        this.tabsListElement.appendChild(fragment); // Appends the fragment to the tabs list element
    }
}