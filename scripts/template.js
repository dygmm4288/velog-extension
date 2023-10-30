import {
  append,
  create,
  getStorage,
  select,
  selectAll,
  setStorage,
} from './common/util.js';

const VELOG_PREVIEW_TEMPLATE_KEY = 'velog_preview_template';

export const templateWrapper = create('div');

templateWrapper.style.cssText = `
    position: absolute;
    top : 0;
    right: 0;
    widht: 300px;
    height: auto;
  `;
/**
 *
 * @param {string} saveTemplate
 * @returns json string
 * 로컬스토리지에 템플릿을 저장하는 함수
 */
function setTemplate(saveTemplate) {
  return setStorage(VELOG_PREVIEW_TEMPLATE_KEY, saveTemplate);
}

async function handleAddTemplate() {
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
}
/**
 *
 * @param {number} index
 * index가 주어지면 에디어테 저장된 템플릿을 붙여넣는 함수
 */
export async function pasteTemplate(index) {
  const velog_preview_template = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);
  const storagedTemplate = velog_preview_template ?? [];

  const textArea = select()('.CodeMirror textarea');

  const clipboard = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
  });

  clipboard.clipboardData.items.add(
    storagedTemplate[index].content,
    'text/plain',
  );

  textArea.dispatchEvent(clipboard);
}
export function appendSaveTemplateBtn() {
  const button = create('button');
  const body = select()('body');
  button.innerText = '템플릿 저장';
  templateWrapper.innerHTML = '';
  append(body, append(templateWrapper, button));

  button.addEventListener('click', handleAddTemplate);
}
