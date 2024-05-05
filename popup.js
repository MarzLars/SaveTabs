// popup.js

document.getElementById('saveTabs').addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        let tabUrls = tabs.map(tab => tab.url);
        chrome.storage.local.set({tabUrls: tabUrls}, () => {
            console.log('Tabs saved.');
            displaySavedTabs(tabUrls); // Display the saved tabs
        });
    });
});

document.getElementById('exportTabs').addEventListener('click', function() {
    chrome.storage.local.get('tabUrls', function(result) {
        if (result.tabUrls && result.tabUrls.length > 0) {
            // Create a blob with the URLs and download it as a text file
            let blob = new Blob([result.tabUrls.join('\n')], {type: 'text/plain'});
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'tabs.txt';
            a.click();
            console.log('Exporting tabs:', result.tabUrls);
        }
    });
});

document.getElementById('importTabs').addEventListener('click', function() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.onchange = function(event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function() {
            let urls = reader.result.split('\n');
            chrome.storage.local.set({tabUrls: urls}, function() {
                console.log('Tabs imported.');
                displaySavedTabs(urls); // Display the imported tabs
            });
        };
        reader.readAsText(file);
    };
    input.click();
});

// Function to display the saved tabs
function displaySavedTabs(tabUrls) {
    let tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = ''; // Clear the list
    for (let url of tabUrls) {
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        link.href = url;
        link.target = '_blank'; // Open in a new tab
        link.textContent = url;
        listItem.appendChild(link);
        tabsList.appendChild(listItem);
    }
}