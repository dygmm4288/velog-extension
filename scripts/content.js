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

    templateWrapper.append(templateWrapper);
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
  chrome.runtime.onMessage.addListener((obj) => {
    const { isMatched } = obj;
    // 여기서 어떻게 기다려
    // 여기가 문제 : 1. 처음에 페이지가 로딩이 될때 에디터가 없으면 제대로 동작하지 않는다
    // 나가기했다가 다시 들어오면 에디터가 이미 로딩이 돼있기 때문에 제대로 동작함
    // 그렇다면 해결방법
    // 1. 유저한테 다시 리로드하라고 지시한다.
    // 2. 저 에디터가 로딩이 완료될 때 까지 기다린다 (약... 3초?) -> 이걸 목표로 하는데 안될경우 1번
    // 3. 새로고침한다.
    // 4. 나가기를 했다가 다시 들어온다.
    if (!isMatched) return;
    //window.location.reload();
    setDisplay(templateWrapper)('block');
    console.log(!select()('.CodeMirror'));
    toggleButtonExecute();
    appendSaveTemplateBtn();
  });
  console.log('prev : ');
  const codeMirror = select()('.CodeMirror');
  console.log('next : ', codeMirror);
  setDisplay(templateWrapper)('none');
  if (!codeMirror) return;
  setDisplay(templateWrapper)('block');
  toggleButtonExecute();
  appendSaveTemplateBtn();
})();
