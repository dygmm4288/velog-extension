import { append, create, getStorage, select } from './common/util.js';
import {
  VELOG_PREVIEW_TEMPLATE_KEY,
  handleAddTemplate,
  pasteTemplate,
} from './template.js';

function createTemplateBtn() {
  const $templateBtn = create('button', 'ixiTKc template-btn');
  $templateBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.8571 4.31915C19.2381 4.39426 19.5207 4.52572 19.7051 4.71351C19.9017 4.90131 20 5.1204 20 5.37079C20 5.78393 19.8833 6.0844 19.6498 6.2722C19.4286 6.45999 19.0722 6.53511 18.5806 6.49755C17.4747 6.40991 16.6083 6.35357 15.9816 6.32854C15.3671 6.29098 14.5561 6.26594 13.5484 6.25342C13.0937 8.55702 12.6759 10.8731 12.2949 13.2018C12.1597 14.0531 12.0184 15.0421 11.871 16.1689C11.7235 17.2831 11.6252 18.1845 11.576 18.8731C11.5515 19.2362 11.404 19.5178 11.1336 19.7182C10.8633 19.906 10.5376 19.9999 10.1567 19.9999C9.75115 19.9999 9.43779 19.8998 9.21659 19.6994C8.99539 19.4991 8.8848 19.2362 8.8848 18.9107C8.8848 18.6102 8.9278 18.1158 9.01383 17.4271C9.11213 16.726 9.22273 15.9936 9.34562 15.2299C9.4808 14.4662 9.58526 13.8027 9.65899 13.2393C9.79416 12.2878 9.94777 11.3426 10.1198 10.4037C10.2919 9.46469 10.4639 8.5758 10.6359 7.73699C10.6728 7.54919 10.7158 7.33636 10.765 7.09849C10.8141 6.8481 10.8694 6.57267 10.9309 6.2722C9.72657 6.30976 8.78034 6.40991 8.09217 6.57267C7.40399 6.73543 6.91245 6.96703 6.61752 7.2675C6.33486 7.55545 6.19355 7.93103 6.19355 8.39426C6.19355 8.81993 6.31643 9.22681 6.56222 9.61492C6.61136 9.70256 6.63595 9.79646 6.63595 9.89661C6.63595 10.1345 6.49462 10.3598 6.21199 10.5727C5.94163 10.773 5.65899 10.8731 5.36406 10.8731C5.15514 10.8731 4.9831 10.8105 4.84793 10.6853C4.60215 10.4725 4.39938 10.172 4.23964 9.78393C4.07988 9.38331 4 8.93261 4 8.43182C4 7.36765 4.33794 6.51633 5.01383 5.87783C5.702 5.22681 6.74039 4.75107 8.12904 4.4506C9.52996 4.15013 11.3241 3.9999 13.5115 3.9999C14.8633 3.9999 15.9385 4.02493 16.7373 4.07501C17.5484 4.1251 18.2549 4.20647 18.8571 4.31915Z" fill="#ACACAC"/>
  </svg>
  `;
  $templateBtn.addEventListener('click', handleClickTemplateButton);
  return $templateBtn;
}
export async function createTemplateList() {
  let $templateList = select()('.template-list-wrapper');
  if (!$templateList) {
    $templateList = create('ul', 'template-list-wrapper');
  }
  $templateList
    .querySelectorAll('li')
    .forEach((listItem) =>
      listItem.removeEventListener('click', handleClickTemplateListItem),
    );
  $templateList.innerHTML = '';
  const template = await getStorage(VELOG_PREVIEW_TEMPLATE_KEY);
  const $templateItems = createTemplateItem(template);
  return append($templateList, $templateItems);
}
function createSaveTemplateBtn() {
  let $button = select()('template-save-btn');
  if (!$button) {
    $button = create('button', 'template-save-btn');
  }
  $button.removeEventListener('click', handleAddTemplate);
  $button.innerText = '템플릿 저장하기';
  $button.addEventListener('click', handleAddTemplate);
  return $button;
}
function createTemplateItem(template) {
  return template.map(({ id, content }, index) => {
    const $templateItem = create('li', 'template-list-item');
    $templateItem.dataset.id = id;
    $templateItem.addEventListener(
      'click',
      handleClickTemplateListItem(index, content),
    );
    $templateItem.innerText = `${index}번째 템플릿`;
    return $templateItem;
  });
}
function handleClickTemplateButton() {
  const $templateContentContainer = select()('.template-content-container');

  if (!$templateContentContainer) return;

  if (!$templateContentContainer.classList.contains('active')) {
    createTemplateList();
  }
  $templateContentContainer.classList.toggle('active');
}
function handleClickTemplateListItem(index, content) {
  return () => {
    pasteTemplate(index, content);
  };
}

export async function appendTemplateBtn($toolbar) {
  const $templateWrapper = create('div', 'template-wrapper');
  let $templateContentContainer = select()('.template-content-container');
  if (!$templateContentContainer) {
    $templateContentContainer = append(
      create('div', 'template-content-container'),
      [createSaveTemplateBtn(), await createTemplateList()],
    );
  }
  return append($toolbar, [
    createTemplateBtn(),
    append($templateWrapper, $templateContentContainer),
  ]);
}
