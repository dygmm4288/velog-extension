import {
  append,
  create,
  getStorage,
  select,
  selectAll,
  setStorage,
} from './common/util.js';

const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';

const createTemplateCard = async () => {
  const velog_preview_template = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);
  const $container = select()('.container');
  const $templateCards = select()('.template-cards');

  $templateCards.innerHTML = '';
  velog_preview_template.forEach((template, index) => {
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
  const velog_preview_template = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);
  const templateId = parseInt(event.target.dataset.id);
  const newTemplate = velog_preview_template.filter((item) => {
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
  const setTemplateBtns = selectAll()('.template-card');
  setTemplateBtns.forEach((btn) => {
    btn.addEventListener('click', setTemplate, { capture: false });
  });

  const delTemplateBtns = selectAll()('.del');
  delTemplateBtns.forEach((btn) => {
    btn.addEventListener('click', delTemplate, { capture: false });
  });
};

createTemplateCard();
