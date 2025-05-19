document.getElementById('openTabsButton').addEventListener('click', () => {
    const url = prompt('Enter the URL to open:', 'https://www.example.com');
    const numberOfTabs = prompt('Enter the number of tabs to open:', '10');

    if (url && numberOfTabs !== null && !isNaN(numberOfTabs)) {
        for (let i = 0; i < parseInt(numberOfTabs, 10); i++) {
            window.open(url, '_blank');
        }
    } else {
        alert('Please enter a valid URL and number.');
    }
});
