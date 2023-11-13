import { create, select, selectAll } from './common/util.js';
const FOOTER_CONTAINER_SELECTOR =
  '[data-testid="codemirror"] > div:last-child > div';
const PREVIEW_DIV_SELECTOR = '[data-testid="right"]';

let $button;

const BUTTON_COTAINER_CLASS = 'jYsOEX';
const BUTTON_FONT_CLASS = 'gRPveD';

function createButton() {
  $button = create('button', [BUTTON_COTAINER_CLASS, BUTTON_FONT_CLASS]);

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

export function appendToggleButton() {
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
