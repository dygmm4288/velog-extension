const UTIL_SRC = chrome.runtime.getURL('scripts/common/util.js');
const PREVIEW_TOGGLE_BTN_SRC = chrome.runtime.getURL(
  'scripts/previewToggleBtn.js',
);
const TEMPLATE_SRC = chrome.runtime.getURL('scripts/template.js');
const THEME_BTN_SRC = chrome.runtime.getURL('scripts/themeBtn.js');
const TEMPLATE_BTN_SRC = chrome.runtime.getURL('scripts/templateBtn.js');

function setDisplay(element) {
  return (str) => (element.style.display = str);
}

(async () => {
  const { select } = await import(UTIL_SRC);
  const { appendToggleButton } = await import(PREVIEW_TOGGLE_BTN_SRC);
  const { appendSaveTemplateBtn, templateWrapper, pasteTemplate } =
    await import(TEMPLATE_SRC);
  const { appendThemeBtn } = await import(THEME_BTN_SRC);
  const { appendTemplateBtn } = await import(TEMPLATE_BTN_SRC);

  let observer;

  function appendFunctions() {
    const $toolbar = select()('#toolbar');
    $toolbar.style.transition = 'none';

    setDisplay(templateWrapper)('block');
    appendToggleButton();
    appendSaveTemplateBtn();
    appendThemeBtn($toolbar);
    appendTemplateBtn($toolbar);
  }

  chrome.runtime.onMessage.addListener((obj) => {
    const {
      isMatched,
      message: { index, type },
    } = obj;

    if (type === 'set') {
      pasteTemplate(index);
      return;
    }

    if (!isMatched) {
      setDisplay(templateWrapper)('none');
      return;
    }
    const codeMirror = select()('.CodeMirror');

    if (!codeMirror) {
      observer = new MutationObserver(function () {
        if (select()('.CodeMirror')) {
          appendFunctions();
          observer.disconnect();
        }
      });

      setDisplay(templateWrapper)('none');
      const target = select()('#root');
      const config = { childList: true };
      observer.observe(target, config);
      return;
    }
    appendFunctions();
  });
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  if (url.pathname === '/write') {
    appendFunctions();
  }

  document.addEventListener('click', (e) => {
    console.log(e.target.matches('.template-wrapper *'), e.target);
    if (e.target.matches('.template-wrapper *')) return;

    const ul = select()('.template-list-wrapper');
    if (ul && ul.classList.contains('active')) {
      ul.classList.remove('active');
    }
  });
})();
