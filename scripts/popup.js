import {
  select,
  selectAll,
  append,
  setStorage,
  getStorage,
  create,
} from './common/util.js';

const tabs = await chrome.tabs.query({
  url: ['https://velog.io/write'],
});

const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';

const { velog_preview_template } = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);

const deleteBtns = document.querySelectorAll('#delete');
deleteBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(
        tab.id,
        { action: 'modify' },
        function (response) {},
      );
    });
  });
});
