function debounce(time, callback) {
  let handle;

  return (...args) => {
    clearTimeout(handle);
    handle = setTimeout(() => callback(...args), time);
  };
}

function convertFiltersToRegex(filterStrings) {
  return filterStrings.filter(Boolean).map(filter => new RegExp(filter, 'i'));
}

function getFiltersFromStorage() {
  return new Promise(resolve => {
    chrome.storage.sync.get({ filters: [] }, ({ filters }) => resolve(filters));
  });
}

function filterAll(filters) {
  for (const node of document.querySelectorAll('.stream-thumbnail')) {
    const content = node.textContent;
    node.hidden = filters.some(filter => content.match(filter));
  }
}

function start(filtersFromStorage) {
  let filters = convertFiltersToRegex(filtersFromStorage);

  chrome.storage.onChanged.addListener(() => {
    getFiltersFromStorage().then(newFiltersFromStorage => {
      filters = convertFiltersToRegex(newFiltersFromStorage);
      filterAll(filters);
    });
  });

  const observer = new MutationObserver(debounce(50, () => filterAll(filters)));

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

Promise.all([
  new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve)),
  getFiltersFromStorage()
]).then(([, filtersFromStorage]) => start(filtersFromStorage));
