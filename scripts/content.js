const UTIL_SRC = chrome.runtime.getURL('scripts/common/util.js');
const PREVIEW_TOGGLE_BTN_SRC = chrome.runtime.getURL(
  'scripts/previewToggleBtn.js',
);
const TEMPLATE_SRC = chrome.runtime.getURL('scripts/template.js');
const THEME_BTN_SRC = chrome.runtime.getURL('scripts/themeBtn.js');
const TEMPLATE_BTN_SRC = chrome.runtime.getURL('scripts/templateBtn.js');
const COLOR_BTN_SRC = chrome.runtime.getURL('scripts/colorBtn.js');
const TEXT_ALIGN_SRC = chrome.runtime.getURL('scripts/textAlign.js');
const CLASS_CODE_MIRROR = '.CodeMirror';
const ROOT_ELEMENT = '#root';
const ACTIVE_CLASS = 'active';

let initTextColorButton = null;

(async () => {
  const {
    select,
    appendToggleButton,
    pasteTemplate,
    appendThemeBtn,
    appendTemplateBtn,
    appendColorBtn,
    initColorButton,
    appendTextAlignBtn,
  } = await getImportModule([
    UTIL_SRC,
    PREVIEW_TOGGLE_BTN_SRC,
    TEMPLATE_SRC,
    THEME_BTN_SRC,
    TEMPLATE_BTN_SRC,
    COLOR_BTN_SRC,
    TEXT_ALIGN_SRC,
  ]);

  initTextColorButton = initColorButton;

  let observer;

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
    const $codeMirror = select()(CLASS_CODE_MIRROR);

    if (!$codeMirror) {
      observer = new MutationObserver(function () {
        if (select()(CLASS_CODE_MIRROR)) {
          appendFunctions();
          observer.disconnect();
        }
      });
      const target = select()(ROOT_ELEMENT);
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
    const selectors = [
      '.template-wrapper *',
      '.template-btn *',
      '.template-btn',
      '.template-wrapper',
    ];
    if (selectors.some((selector) => !!e.target.matches(selector))) {
      return;
    }

    const $templateContentContainer = select()('.template-content-container');
    if (
      $templateContentContainer &&
      $templateContentContainer.classList.contains(ACTIVE_CLASS)
    ) {
      $templateContentContainer.classList.remove(ACTIVE_CLASS);
    }
  });
  function appendFunctions() {
    const $toolbar = select()('#toolbar');
    $toolbar.style.transition = 'none';

    appendToggleButton();
    appendColorBtn($toolbar);
    appendThemeBtn($toolbar);
    appendTemplateBtn($toolbar);
    appendTextAlignBtn($toolbar);
  }
})().then(() => {
  // colorPicker의 경우 custom 버튼이 추가 된 후 로드 필요
  const $hiddenTextArea = document.querySelectorAll('textarea')[2];
  $hiddenTextArea.id = 'hiddenTextArea';
  initTextColorButton();
});

async function getImportModule(modules) {
  return Promise.all(modules.map((module) => import(module)))
    .then((modules) => {
      return modules.reduce((result, module) => ({ ...result, ...module }), {});
    })
    .catch((err) => {
      console.error('has any errors when import file', err);
    });
}
