document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({ filters: [] }, ({ filters }) => {
    document.getElementById('filters').value = filters.join('\n');
  });
});

document.getElementById('save').addEventListener('click', () => {
  const filters = document.getElementById('filters').value.split('\n');
  chrome.storage.sync.set({ filters }, () => window.close());
});