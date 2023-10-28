const UTIL_SRC = chrome.runtime.getURL('scripts/common/util.js');
const FOOTER_CONTAINER_SELECTOR =
  '[data-testid="codemirror"] > div:last-child > div';
const PREVIEW_DIV_SELECTOR = '[data-testid="right"]';

(async () => {
  const { select, selectAll, append, setStorage, getStorage, create } =
    await import(UTIL_SRC);
  let $button;
  function createButton() {
    $button = document.createElement('button');
    $button.classList.add('jYsOEX', 'gRPveD');

    $button.innerText = '미리보기 토글';
    $button.dataset.toggle = 'true';

    return;
  }
  function handlerButtonEvent($previewDiv, $footerContainer, $button) {
    return () => {
      const isToggle = $button.dataset.toggle === 'true';
      $previewDiv.style.display = isToggle ? 'none' : '';
      $footerContainer.style.width = isToggle ? '100vw' : '100%';
      $button.dataset.toggle = isToggle ? 'false' : 'true';
    };
  }
  function appendButton($tempStoreButton, $button) {
    $tempStoreButton.parentElement.prepend($button);
  }
  function toggleButtonExecute() {
    if (!$button) createButton();

    const $previewDiv = select()(PREVIEW_DIV_SELECTOR);
    const $tempStoreButton = Array.prototype.slice
      .call(selectAll()('button'))
      .filter((element) => element.innerText.includes('임시저장'))[0];
    const $footerContainer = select()(FOOTER_CONTAINER_SELECTOR);
    if (!$previewDiv || !$tempStoreButton) return;

    $button.addEventListener(
      'click',
      handlerButtonEvent($previewDiv, $footerContainer, $button),
    );
    appendButton($tempStoreButton, $button);
  }

  const templateWrapper = document.createElement('div');
  const body = select()('body');

  templateWrapper.style.cssText = `
    position: absolute;
    top : 0;
    right: 0;
    widht: 300px;
    height: auto;
  `;

  function setTemplate(saveTemplate) {
    return setStorage('template', saveTemplate);
  }

  const appendSaveTemplateBtn = () => {
    const button = create('button');
    button.innerText = '템플릿 저장';
    templateWrapper.innerHTML = '';
    append(body, append(templateWrapper, button));

    button.addEventListener('click', handlerAddTemplate);
    getTemplateBtn();
  };

  function handlerAddTemplate() {
    const templateTexts = Array.from(selectAll()('.CodeMirror-line'));

    function TemplateObject(content) {
      this.id = Date.now();
      this.content = content;
    }

    const templateContent = templateTexts.reduce((acc, cur) => {
      return (acc +=
        cur.innerText.replace(/\u200B/g, '') === ''
          ? `\n`
          : cur.innerText + '\n');
    }, '');

    const template = new TemplateObject(templateContent);
    const storgedTemplate = getStorage('template') ?? [];
    const saveTemplate = [...storgedTemplate, template];

    setTemplate(saveTemplate);
    getTemplateBtn();
  }
  const setDisplay = (element) => {
    return (str) => (element.style.display = str);
  };
  const getTemplateBtn = () => {
    let templateBtnWrapper = select()('#template-btn-wrapper');
    if (!templateBtnWrapper) {
      templateBtnWrapper = create('div');
      templateBtnWrapper.setAttribute('id', 'template-btn-wrapper');
    }
    templateBtnWrapper.innerHTML = '';

    const storagedTemplate = getStorage('template') ?? [];

    storagedTemplate.forEach((_, index) => {
      const button = create('button');
      button.innerText = `${index}번 템플릿`;
      button.dataset.index = index;
      templateBtnWrapper.append(button);
    });

    append(templateWrapper, templateBtnWrapper);

    const templateBtns = selectAll()('#template-btn-wrapper button');

    templateBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        const textArea = select()('.CodeMirror textarea');

        const clipboard = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
        });

        clipboard.clipboardData.items.add(
          storagedTemplate[index].content,
          'text/plain',
        );

        textArea.dispatchEvent(clipboard);
      });
    });
  };
  let observer;
  chrome.runtime.onMessage.addListener((obj) => {
    const { isMatched } = obj;
    if (!isMatched) return;
    const codeMirror = select()('.CodeMirror');
    if (!codeMirror) {
      observer = new MutationObserver(function () {
        if (document.querySelector('.CodeMirror')) {
          setDisplay(templateWrapper)('block');
          toggleButtonExecute();
          appendSaveTemplateBtn();
          observer.disconnect();
        }
      });
      const target = document.querySelector('#root');
      const config = { childList: true };
      observer.observe(target, config);
      return;
    }
    setDisplay(templateWrapper)('block');
    toggleButtonExecute();
    appendSaveTemplateBtn();
  });
  setDisplay(templateWrapper)('block');
  toggleButtonExecute();
  appendSaveTemplateBtn();
})();
