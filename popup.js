// popup.js

// Utility function to create and return a DOM element with specified attributes
const createElement = (tag, attributes = {}) => {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => element[key] = attributes[key]);
    return element;
};

// Saves the URLs of all open tabs in the current window to local storage
const saveTabs = () => {
    chrome.tabs.query({currentWindow: true}, tabs => {
        const tabUrls = tabs.map(tab => tab.url);
        chrome.storage.local.set({tabUrls}, () => {
            console.log('Tabs saved.');
            displaySavedTabs(tabUrls);
        });
    });
};

// Exports the saved tab URLs from local storage into a downloadable text file
const exportTabs = () => {
    chrome.storage.local.get('tabUrls', result => {
        if (result.tabUrls && result.tabUrls.length > 0) {
            const blob = new Blob([result.tabUrls.join('\n')], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = createElement('a', {
                href: url,
                download: 'tabs.txt'
            });
            a.click();
            console.log('Exporting tabs:', result.tabUrls);
        }
    });
};

// Allows the user to import tab URLs from a text file into local storage
const importTabs = () => {
    const input = createElement('input', {type: 'file', accept: 'text/plain'});
    input.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const urls = reader.result.split('\n');
            chrome.storage.local.set({tabUrls: urls}, () => {
                console.log('Tabs imported.');
                displaySavedTabs(urls);
            });
        };
        reader.readAsText(file);
    };
    input.click();
};

// Displays the saved tab URLs in a list on the popup's DOM
const displaySavedTabs = tabUrls => {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '';
    tabUrls.forEach(url => {
        const listItem = createElement('li');
        const link = createElement('a', {
            href: url,
            target: '_blank',
            textContent: url
        });
        listItem.appendChild(link);
        tabsList.appendChild(listItem);
    });
};

// Event listeners for user interactions
document.getElementById('saveTabs').addEventListener('click', saveTabs);
document.getElementById('exportTabs').addEventListener('click', exportTabs);
document.getElementById('importTabs').addEventListener('click', importTabs);