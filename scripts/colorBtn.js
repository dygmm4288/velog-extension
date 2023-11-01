import { append, create, select } from './common/util.js';

// theme
function createColorBtn() {
  const $colorBtn = create('button');
  const $wrapper = create('div', 'theme-wrapper');

  $colorBtn.innerHTML = `
    <div class="ThemeToggleButton_positional__neE4C">
      <div class="ThemeToggleButton_svgWrapper__Yr6R3" style='position:relative;'>
        <section class="container">
          <button type="button" class="text-color-picker-button ixiTKc">T</button>
        </section>
      </div>
    </div>
  `;

  $colorBtn.classList.add(
    'ThemeToggleButton_block__V9gIU',
    'change-mode-btn',
    'ixiTKc',
  );

  return append($wrapper, $colorBtn);
}

export function initColorButton() {
  const textColorButton = select()('.text-color-picker-button');
  const pickr = Pickr.create({
    el: textColorButton,
    theme: 'nano', // or 'monolith', or 'nano'
    showAlways: false,
    useAsButton: true,
    swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 1)',
      'rgba(156, 39, 176, 1)',
      'rgba(103, 58, 183, 1)',
      'rgba(63, 81, 181, 1)',
      'rgba(33, 150, 243, 1)',
      'rgba(3, 169, 244, 1)',
      'rgba(0, 188, 212, 1)',
      'rgba(0, 150, 136, 1)',
      'rgba(76, 175, 80, 1)',
      'rgba(139, 195, 74, 1)',
      'rgba(205, 220, 57, 1)',
      'rgba(255, 235, 59, 1)',
      'rgba(255, 193, 7, 1)',
    ],
    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,
      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        save: true,
      },
    },
  }).on('save', (color) => {
    setTimeout(() => {
      const $hiddenTextArea = document.getElementById('hiddenTextArea');
      const hex = color.toHEXA().toString(0);
      textColorButton.style.color = hex;
      $hiddenTextArea.dispatchEvent(new Event('keydown'));
      setTimeout(() => {
        $hiddenTextArea.value = `<span style='color: ${hex}'>${$hiddenTextArea.value}</span>`;
      }, 100);
    });
    pickr.hide();
  });
}

export function appendColorBtn($toolbar) {
  return append($toolbar, [createColorBtn()]);
}
