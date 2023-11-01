const UTIL_SRC = chrome.runtime.getURL('scripts/common/util.js');
const PREVIEW_TOGGLE_BTN_SRC = chrome.runtime.getURL(
  'scripts/previewToggleBtn.js',
);
const TEMPLATE_SRC = chrome.runtime.getURL('scripts/template.js');
const THEME_BTN_SRC = chrome.runtime.getURL('scripts/themeBtn.js');
const TEMPLATE_BTN_SRC = chrome.runtime.getURL('scripts/templateBtn.js');
const COLOR_BTN_SRC = chrome.runtime.getURL('scripts/colorBtn.js');

function setDisplay(element) {
  return (str) => (element.style.display = str);
}

let initTextColorButton = null;

(async () => {
  const { select } = await import(UTIL_SRC);
  const { appendToggleButton } = await import(PREVIEW_TOGGLE_BTN_SRC);
  const { pasteTemplate } = await import(TEMPLATE_SRC);
  const { appendThemeBtn } = await import(THEME_BTN_SRC);
  const { appendTemplateBtn } = await import(TEMPLATE_BTN_SRC);
  const { appendColorBtn, initColorButton } = await import(COLOR_BTN_SRC);
  initTextColorButton = initColorButton;

  let observer;

  function appendFunctions() {
    const $toolbar = select()('#toolbar');
    $toolbar.style.transition = 'none';

    appendToggleButton();
    appendColorBtn($toolbar);
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
    if (
      e.target.matches('.template-wrapper *') ||
      e.target.matches('.template-btn *') ||
      e.target.matches('.template-btn') ||
      e.target.matches('.template-wrapper')
    )
      return;

    const $templateContentContainer = select()('.template-content-container');
    if (
      $templateContentContainer &&
      $templateContentContainer.classList.contains('active')
    ) {
      $templateContentContainer.classList.remove('active');
    }
  });
})().then(() => {
  // colorPicker의 경우 custom 버튼이 추가 된 후 로드 필요
  const $hiddenTextArea = document.querySelectorAll('textarea')[2];
  $hiddenTextArea.id = 'hiddenTextArea';
  initTextColorButton();
});
