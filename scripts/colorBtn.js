import { append, create, select } from './common/util.js';

// theme
function createColorBtn() {
  const $colorBtn = create('button');
  const $wrapper = create('div', 'theme-wrapper');

  $colorBtn.innerHTML = `
    <div class="ThemeToggleButton_positional__neE4C">
      <div style='position:relative;'>
        <section class="container">
          <button type="button" class="text-color-picker-button ixiTKc">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.78 20.06C11.1933 20.06 9.81334 19.7733 8.64 19.2C7.46667 18.6133 6.56667 17.7867 5.94 16.72C5.31334 15.6533 5 14.4133 5 13C5 11.04 5.36667 9.3 6.1 7.78C6.84667 6.26 7.85334 5.08667 9.12 4.26C10.3867 3.42 11.7933 3 13.34 3C14.78 3 15.8733 3.37333 16.62 4.12C17.3667 4.85333 17.74 5.82667 17.74 7.04C17.74 7.85333 17.5933 8.50667 17.3 9C17.02 9.49333 16.6133 9.74 16.08 9.74C15.7067 9.74 15.4133 9.65333 15.2 9.48C14.9867 9.30667 14.88 9.05333 14.88 8.72C14.88 8.6 14.9067 8.38 14.96 8.06C15.04 7.66 15.08 7.34 15.08 7.1C15.08 5.88667 14.4333 5.28 13.14 5.28C12.26 5.28 11.42 5.56667 10.62 6.14C9.82 6.71333 9.17334 7.56 8.68 8.68C8.18667 9.78667 7.94 11.1067 7.94 12.64C7.94 14.24 8.38667 15.48 9.28 16.36C10.1733 17.2267 11.4933 17.66 13.24 17.66C14.1067 17.66 14.98 17.5533 15.86 17.34C16.7533 17.1133 17.74 16.7733 18.82 16.32C19.02 16.24 19.1867 16.2 19.32 16.2C19.5333 16.2 19.6933 16.28 19.8 16.44C19.9067 16.6 19.96 16.8067 19.96 17.06C19.96 17.8733 19.52 18.4733 18.64 18.86C17.6933 19.2733 16.7067 19.58 15.68 19.78C14.6667 19.9667 13.7 20.06 12.78 20.06Z" fill="#ACACAC"/>
            </svg>
          </button>
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
      textColorButton.style.stroke = hex;
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
