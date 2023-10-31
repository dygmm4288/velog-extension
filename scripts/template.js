import { getStorage, select, selectAll, setStorage } from './common/util.js';
import { createTemplateList } from './templateBtn.js';

export const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';

/* export const templateWrapper = create('div');

templateWrapper.style.cssText = `
    position: absolute;
    top : 0;
    right: 0;
    widht: 300px;
    height: auto;
  `; */
function setTemplate(saveTemplate) {
  return setStorage(VELOG_PREVIEW_TEMPLATE_KEY, saveTemplate);
}

export async function handleAddTemplate() {
  const templateTexts = Array.from(selectAll()('.CodeMirror-line'));

  class TemplateObject {
    constructor(content) {
      this.id = Date.now();
      this.content = content;
    }
  }
  const templateContent = templateTexts.reduce((acc, cur) => {
    return (acc +=
      cur.innerText.replace(/\u200B/g, '') === ''
        ? `\n`
        : cur.innerText + '\n');
  }, '');

  const template = new TemplateObject(templateContent);

  const velog_preview_template =
    (await getStorage(VELOG_PREVIEW_TEMPLATE_KEY)) ?? [];
  const saveTemplate = [...velog_preview_template, template];
  setTemplate(saveTemplate);

  const $templateContentContainer = select()('.template-content-container');
  if (
    $templateContentContainer &&
    $templateContentContainer.classList.contains('active')
  ) {
    createTemplateList();
  }
}
/**
 *
 * @param {number} index
 * index가 주어지면 에디어테 저장된 템플릿을 붙여넣는 함수
 */
export async function pasteTemplate(index, prevContent) {
  const clipboard = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
  });
  let storagedTemplate = [];
  if (prevContent) {
    storagedTemplate[index] = { content: prevContent };
  } else {
    const velog_preview_template = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);
    storagedTemplate = velog_preview_template ?? [];
  }
  clipboard.clipboardData.items.add(
    storagedTemplate[index].content,
    'text/plain',
  );

  const textArea = select()('.CodeMirror textarea');
  textArea.dispatchEvent(clipboard);
}
