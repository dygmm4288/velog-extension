const UTIL_SRC = chrome.runtime.getURL('scripts/common/util.js');
const FOOTER_CONTAINER_SELECTOR =
  '[data-testid="codemirror"] > div:last-child > div';
const PREVIEW_DIV_SELECTOR = '[data-testid="right"]';

const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';
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
    return setStorage(VELOG_PREVIEW_TEMPLATE_KEY, saveTemplate);
  }

  const appendSaveTemplateBtn = () => {
    const button = create('button');
    button.innerText = '템플릿 저장';
    templateWrapper.innerHTML = '';
    append(body, append(templateWrapper, button));

    button.addEventListener('click', handlerAddTemplate);
  };

  async function handlerAddTemplate() {
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
    const { velog_preview_template } = await getStorage(
      VELOG_PREVIEW_TEMPLATE_KEY,
    );

    const storgedTemplate = JSON.parse(velog_preview_template) ?? [];
    const saveTemplate = [...storgedTemplate, template];

    setTemplate(saveTemplate);
  }
  const setDisplay = (element) => {
    return (str) => (element.style.display = str);
  };

  const pasteTemplate = async (index) => {
    const { velog_preview_template } = await getStorage(
      VELOG_PREVIEW_TEMPLATE_KEY,
    );
    const storagedTemplate = JSON.parse(velog_preview_template) ?? [];

    const textArea = select()('.CodeMirror textarea');

    const clipboard = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });

    clipboard.clipboardData.items.add(
      storagedTemplate[index].content,
      'text/plain',
    );

    textArea.dispatchEvent(clipboard);
  };

  select()('#toolbar').style.transition = 'none';
  function createModeChangeBtn() {
    const $toolbar = select()('#toolbar');
    const $modeChangeBtn = create('button');
    $modeChangeBtn.innerHTML = `
    <div class="ThemeToggleButton_positional__neE4C"><div class="ThemeToggleButton_svgWrapper__Yr6R3"><div><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M4.069 13H0v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312L4.222 2.807 2.808 4.221l2.881 2.881a8.019 8.019 0 0 1 1.414-1.414zm11.209 1.414 2.881-2.881-1.414-1.414-2.881 2.881a8.121 8.121 0 0 1 1.414 1.414zM12 4c.339 0 .672.028 1 .069V0h-2v4.069A8.047 8.047 0 0 1 12 4zm0 16c-.339 0-.672-.028-1-.069V24h2v-4.069A8.047 8.047 0 0 1 12 20zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1H24v-2h-4.069zm-3.033 7.312 2.88 2.88 1.415-1.414-2.88-2.88a8.127 8.127 0 0 1-1.415 1.414zm-11.21-1.415-2.88 2.88 1.414 1.414 2.88-2.88a8.053 8.053 0 0 1-1.414-1.414zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path></svg></div></div></div>
    `;
    $modeChangeBtn.classList.add(
      'ThemeToggleButton_block__V9gIU',
      'change-mode-btn',
      'ixiTKc',
    );
    const templateWrapper_modeChange = create('div');

    const $toolbarAreaDiv = create('div');
    $toolbarAreaDiv.classList.add('sc-kHOZwM', 'jvqdVW');

    templateWrapper_modeChange.style.cssText = `
      width:auto;
      height: auto;
    `;

    const addToolbar = [
      $toolbarAreaDiv,
      append(templateWrapper_modeChange, $modeChangeBtn),
    ];

    append($toolbar, addToolbar);
    $modeChangeBtn.addEventListener('click', modeChangeHandler);
  }

  function modeChangeHandler() {
    const $body = select()('body');
    const currentMode = $body.dataset['theme'];
    const $codeMirror = select()('.CodeMirror');
    const $svg = select()('.ThemeToggleButton_svgWrapper__Yr6R3 svg');

    console.log($svg);
    if (currentMode === 'dark') {
      $body.dataset['theme'] = 'light';
      $codeMirror.classList.remove('cm-s-one-dark');
      $codeMirror.classList.add('cm-s-one-light');
      $svg.innerHTML = `<path d="M4.069 13H0v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312L4.222 2.807 2.808 4.221l2.881 2.881a8.019 8.019 0 0 1 1.414-1.414zm11.209 1.414 2.881-2.881-1.414-1.414-2.881 2.881a8.121 8.121 0 0 1 1.414 1.414zM12 4c.339 0 .672.028 1 .069V0h-2v4.069A8.047 8.047 0 0 1 12 4zm0 16c-.339 0-.672-.028-1-.069V24h2v-4.069A8.047 8.047 0 0 1 12 20zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1H24v-2h-4.069zm-3.033 7.312 2.88 2.88 1.415-1.414-2.88-2.88a8.127 8.127 0 0 1-1.415 1.414zm-11.21-1.415-2.88 2.88 1.414 1.414 2.88-2.88a8.053 8.053 0 0 1-1.414-1.414zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path>`;
      $svg.parentElement.animate(
        {
          transform: ['none', 'scale(1) rotate(90deg) translateZ(0px)'],
        },
        {
          duration: 500,
          fill: 'forwards',
          easing: 'ease',
        },
      );
    } else if (currentMode === 'light') {
      $body.dataset['theme'] = 'dark';
      $codeMirror.classList.remove('cm-s-one-light');
      $codeMirror.classList.add('cm-s-one-dark');
      $svg.parentElement.style.transform = 'none';
      $svg.innerHTML = `<path fill-rule="evenodd" d="M20.614 14.614A9 9 0 0 1 9.385 3.386a9 9 0 1 0 11.229 11.229Z" clip-rule="evenodd"></path>`;
      $svg.parentElement.animate(
        {
          transform: ['scale(1) rotate(90deg) translateZ(0px)', 'none'],
        },
        {
          duration: 500,
          fill: 'forwards',
          easing: 'ease',
        },
      );
    }
  }

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

    console.log(isMatched);
    if (!isMatched) {
      setDisplay(templateWrapper)('none');
      return;
    }
    const codeMirror = select()('.CodeMirror');
    if (!codeMirror) {
      observer = new MutationObserver(function () {
        if (select()('.CodeMirror')) {
          setDisplay(templateWrapper)('block');
          toggleButtonExecute();
          appendSaveTemplateBtn();
          createModeChangeBtn();
          observer.disconnect();
        }
      });

      setDisplay(templateWrapper)('none');
      const target = select()('#root');
      const config = { childList: true };
      observer.observe(target, config);
      return;
    }
    setDisplay(templateWrapper)('block');
    toggleButtonExecute();
    appendSaveTemplateBtn();
    createModeChangeBtn();
  });
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  if (url.pathname === '/write') {
    setDisplay(templateWrapper)('block');
    toggleButtonExecute();
    appendSaveTemplateBtn();
    createModeChangeBtn();
  }
})();
