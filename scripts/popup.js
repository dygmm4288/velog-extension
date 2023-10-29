import {
  append,
  create,
  getStorage,
  setStorage,
  select,
  selectAll,
} from './common/util.js';

const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';

// template card 생성
const createTemplateCard = async () => {
  const { velog_preview_template } = await getStorage(
    VELOG_PREVIEW_TEMPLATE_KEY,
  );
  const $container = select()('.container');
  const $templateCards = select()('.template-cards');
  $templateCards.innerHTML = '';
  JSON.parse(velog_preview_template).forEach((template, index) => {
    //
    // tamplate wrapper 생성
    const $templateWrapper = create('div');
    $templateWrapper.classList.add('template-card');
    $templateWrapper.dataset.index = index;
    $templateWrapper.innerHTML = `
        <section class="template-card__text-wrapper">
          <h1>${index + 1}번째 템플릿</h1>
        </section>
        <section class="template-card__button-wrapper">
          <button data-id="${template.id}" class="del">삭제</button>
        </section>
  `;
    append($templateCards, [$templateWrapper]);
  });
  append($container, [$templateCards]);
  btnAddEvent();
};

const CHROME_OPTIONS = { active: true, currentWindow: true };

async function setTemplate(event) {
  event.stopPropagation();
  const sendData = getSendData(event, 'set');
  sendMessage(sendData);
}

async function delTemplate(event) {
  event.stopPropagation();
  const { velog_preview_template } = await getStorage(
    VELOG_PREVIEW_TEMPLATE_KEY,
  );
  const templateId = parseInt(event.target.dataset.id);
  const newTemplate = JSON.parse(velog_preview_template).filter((item) => {
    return item.id !== templateId;
  });

  await setStorage(VELOG_PREVIEW_TEMPLATE_KEY, newTemplate);
  createTemplateCard();
}

const getSendData = (event, type) => {
  const index =
    type === 'set'
      ? event.target.parentNode.dataset.index
      : event.target.dataset.index;
  const message = { index, type };
  return { message };
};

const sendMessage = (sendData) => {
  chrome.tabs.query(CHROME_OPTIONS, function (activeTabs) {
    chrome.tabs.sendMessage(activeTabs[0].id, sendData);
  });
};

const btnAddEvent = () => {
  // 적용할 템플릿 버튼 찾아오기
  const setTemplateBtns = selectAll()('.template-card');
  // 템플릿 삭제 버튼 찾아오기
  setTemplateBtns.forEach(async (btn) => {
    btn.addEventListener('click', await setTemplate, { capture: false });
  });

  const delTemplateBtns = selectAll()('.del');
  delTemplateBtns.forEach(async (btn) => {
    btn.addEventListener('click', await delTemplate, { capture: false });
  });
};

createTemplateCard();
