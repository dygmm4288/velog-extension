import { append, create } from './common/util.js';
import { createToolbarArea } from './toolbar.js';
class TextAlignBtn {
  constructor(svg, textAlign) {
    this._button = create('button', 'ixiTKc');
    this._button.innerHTML = `
      <button type="button" class="text-color-picker-button ixiTKc">
        ${svg}
      </button>
    `;
    this._button.addEventListener('click', this.handleClick(textAlign));
  }
  get button() {
    return this._button;
  }
  handleClick(textAlign) {
    return () => {
      let outerTimeout = setTimeout(() => {
        const $hiddenTextArea = document.getElementById('hiddenTextArea');
        $hiddenTextArea.dispatchEvent(new Event('keydown'));
        let innerTimeout = setTimeout(() => {
          $hiddenTextArea.value = `<p style='text-align:${textAlign}'>${$hiddenTextArea.value}</p>`;
          clearTimeout(innerTimeout);
        }, 100);
        clearTimeout(outerTimeout);
      });
    };
  }
}
function createTextAlignBtns() {
  const $wrapper = create('div', 'text-align-wrapper');
  const $textAlignBtns = [
    [TextAlignLeftSVG, TEXT_ALIGN_LEFT],
    [TextAlignCenterSVG, TEXT_ALIGN_CENTER],
    [TextAlignRightSVG, TEXT_ALIGN_RIGHT],
  ].map((item) => new TextAlignBtn(...item).button);
  return append($wrapper, $textAlignBtns);
}
export function appendTextAlignBtn($toolbar) {
  return append($toolbar, [createToolbarArea(), createTextAlignBtns()]);
}

const TEXT_ALIGN_CENTER = 'center';
const TEXT_ALIGN_LEFT = 'left';
const TEXT_ALIGN_RIGHT = 'right';

const TextAlignCenterSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 13.4727C17 15.4364 14.5376 14.9455 11.5 14.9455C8.46243 14.9455 6 15.4364 6 13.4727C6 12 8.46243 12 11.5 12C14.5376 12 17 12 17 13.4727Z" fill="#D9D9D9"/>
<path d="M20 7.47273C20 9.43636 16.4183 8.94545 12 8.94545C7.58172 8.94545 4 9.43636 4 7.47273C4 6 7.58172 6 12 6C16.4183 6 20 6 20 7.47273Z" fill="#D9D9D9"/>
<path d="M22 19.5C22 21.5 17.5228 21 12 21C6.47715 21 2 21.5 2 19.5C2 18 6.47715 18 12 18C17.5228 18 22 18 22 19.5Z" fill="#D9D9D9"/>
</svg>`;
const TextAlignLeftSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 13.4727C13 15.4364 10.5376 14.9455 7.5 14.9455C4.46243 14.9455 2 15.4364 2 13.4727C2 12 4.46243 12 7.5 12C10.5376 12 13 12 13 13.4727Z" fill="#D9D9D9"/>
<path d="M10 7.47273C10 9.43636 8.20914 8.94545 6 8.94545C3.79086 8.94545 2 9.43636 2 7.47273C2 6 3.79086 6 6 6C8.20914 6 10 6 10 7.47273Z" fill="#D9D9D9"/>
<path d="M22 19.5C22 21.5 17.5228 21 12 21C6.47715 21 2 21.5 2 19.5C2 18 6.47715 18 12 18C17.5228 18 22 18 22 19.5Z" fill="#D9D9D9"/>
</svg>`;
const TextAlignRightSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 13.4727C22 15.4364 19.5376 14.9455 16.5 14.9455C13.4624 14.9455 11 15.4364 11 13.4727C11 12 13.4624 12 16.5 12C19.5376 12 22 12 22 13.4727Z" fill="#D9D9D9"/>
<path d="M22 7.47273C22 9.43636 20.2091 8.94545 18 8.94545C15.7909 8.94545 14 9.43636 14 7.47273C14 6 15.7909 6 18 6C20.2091 6 22 6 22 7.47273Z" fill="#D9D9D9"/>
<path d="M22 19.5C22 21.5 17.5228 21 12 21C6.47715 21 2 21.5 2 19.5C2 18 6.47715 18 12 18C17.5228 18 22 18 22 19.5Z" fill="#D9D9D9"/>
</svg>`;
