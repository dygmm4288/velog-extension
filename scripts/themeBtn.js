import { append, create, select } from './common/util.js';
import { createToolbarArea } from './toolbar.js';
function createThemeBtn() {
  const $themeBtn = create('button');
  const $wrapper = create('div', 'theme-wrapper');

  $themeBtn.innerHTML = `
    <div class="ThemeToggleButton_positional__neE4C">
      <div class="ThemeToggleButton_svgWrapper__Yr6R3">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M4.069 13H0v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312L4.222 2.807 2.808 4.221l2.881 2.881a8.019 8.019 0 0 1 1.414-1.414zm11.209 1.414 2.881-2.881-1.414-1.414-2.881 2.881a8.121 8.121 0 0 1 1.414 1.414zM12 4c.339 0 .672.028 1 .069V0h-2v4.069A8.047 8.047 0 0 1 12 4zm0 16c-.339 0-.672-.028-1-.069V24h2v-4.069A8.047 8.047 0 0 1 12 20zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1H24v-2h-4.069zm-3.033 7.312 2.88 2.88 1.415-1.414-2.88-2.88a8.127 8.127 0 0 1-1.415 1.414zm-11.21-1.415-2.88 2.88 1.414 1.414 2.88-2.88a8.053 8.053 0 0 1-1.414-1.414zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path>
          </svg>
        </div>
      </div>
    </div>
  `;

  $themeBtn.classList.add(
    'ThemeToggleButton_block__V9gIU',
    'change-mode-btn',
    'ixiTKc',
  );

  $themeBtn.addEventListener('click', handleThemeChange);

  return append($wrapper, $themeBtn);
}

const DARK_MODE_CLASS = 'cm-s-one-dark';
const LIGHT_MODE_CLASS = 'cm-s-one-light';
const DARK_SVG_PATH = `<path d="M4.069 13H0v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312L4.222 2.807 2.808 4.221l2.881 2.881a8.019 8.019 0 0 1 1.414-1.414zm11.209 1.414 2.881-2.881-1.414-1.414-2.881 2.881a8.121 8.121 0 0 1 1.414 1.414zM12 4c.339 0 .672.028 1 .069V0h-2v4.069A8.047 8.047 0 0 1 12 4zm0 16c-.339 0-.672-.028-1-.069V24h2v-4.069A8.047 8.047 0 0 1 12 20zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1H24v-2h-4.069zm-3.033 7.312 2.88 2.88 1.415-1.414-2.88-2.88a8.127 8.127 0 0 1-1.415 1.414zm-11.21-1.415-2.88 2.88 1.414 1.414 2.88-2.88a8.053 8.053 0 0 1-1.414-1.414zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path>`;
const LIGHT_SVG_PATH = `<path fill-rule="evenodd" d="M20.614 14.614A9 9 0 0 1 9.385 3.386a9 9 0 1 0 11.229 11.229Z" clip-rule="evenodd"></path>`;
const DARK = 'dark';
const LIGHT = 'light';

function handleThemeChange() {
  const $body = select()('body');
  const $codeMirror = select()('.CodeMirror');
  const $svg = select()('.ThemeToggleButton_svgWrapper__Yr6R3 svg');
  const currentMode = $body.dataset.theme;

  const keyframesDark = {
    transform: ['none', 'scale(1) rotate(90deg) translateZ(0px)'],
  };
  const keyframesLight = {
    transform: ['scale(1) rotate(90deg) translateZ(0px)', 'none'],
  };
  const animationOptions = {
    duration: 500,
    fill: 'forwards',
    easing: 'ease',
  };
  if (currentMode === DARK) {
    $body.dataset['theme'] = LIGHT;
    $codeMirror.classList.remove(DARK_MODE_CLASS);
    $codeMirror.classList.add(LIGHT_MODE_CLASS);
    $svg.innerHTML = LIGHT_SVG_PATH;
    $svg.parentElement.animate(keyframesLight, animationOptions);
  } else if (currentMode === LIGHT) {
    $body.dataset['theme'] = DARK;
    $codeMirror.classList.remove(LIGHT_MODE_CLASS);
    $codeMirror.classList.add(DARK_MODE_CLASS);
    $svg.innerHTML = DARK_SVG_PATH;
    $svg.parentElement.animate(keyframesDark, animationOptions);
  }
}

export function appendThemeBtn($toolbar) {
  return append($toolbar, [createToolbarArea(), createThemeBtn()]);
}
