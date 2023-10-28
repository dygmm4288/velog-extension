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
    if (!$button) createButton(); // 버튼이 없을 시에는 버튼을 생성한다.

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

  /**
   * template start
   * save template
   */
  // body 생성 및 template button wrapper
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
    let templateWrapper = select()('#template-btn-wrapper');
    if (!templateWrapper) {
      templateWrapper = create('div');
      templateWrapper.setAttribute('id', 'template-btn-wrapper');
    }
    templateWrapper.innerHTML = '';

    const storgedTemplate = getStorage('template') ?? [];

    storgedTemplate.forEach((_, index) => {
      const button = create('button');
      button.innerText = `${index}번 템플릿`;
      button.dataset.index = index;
      templateWrapper.append(button);
    });

    // 템플릿 버튼 이벤트 등록
    const templateBtns = selectAll()('#template-btn-wrapper button');

    templateBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        // 붙여넣기 대상
        const textArea = select()('.CodeMirror textarea');

        // clipboard 객체 생성
        const clipboard = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer(),
        });

        // cliboard에 데이터 주입
        clipboard.clipboardData.items.add(
          storgedTemplate[index].content,
          'text/plain',
        );

        // clipboard 이벤트 실행
        textArea.dispatchEvent(clipboard);
      });
    });
  };
  let observer;
  chrome.runtime.onMessage.addListener((obj) => {
    const { isMatched } = obj;
    if (!isMatched) return; // 글쓰기 페이지가 아니라면
    const codeMirror = select()('.CodeMirror');
    console.log(codeMirror);
    if (!codeMirror) {
      observer = new MutationObserver(function () {
        if (document.querySelector('.CodeMirror')) {
          // add what you want to do here...
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

    //   //window.location.reload();
  });
  // 이 observer라는 것은 언제 이거를 감지를 해야하냐면
  // 사실 글쓰기에서 찾아야한다.

  // console.log('prev : ');
  // const codeMirror = select()('.CodeMirror');
  // console.log('next : ', codeMirror);
  // setDisplay(templateWrapper)('none');
  // if (!codeMirror) return;
  setDisplay(templateWrapper)('block');
  toggleButtonExecute();
  appendSaveTemplateBtn();
})();
