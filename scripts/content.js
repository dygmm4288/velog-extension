const previewDiv = document.querySelector('[data-testid="right"]');
const tempStoreButton = Array.prototype.slice
  .call(document.querySelectorAll('button'))
  .filter((element) => element.innerText.includes('임시저장'))[0];
const footerContainer = document.querySelector('.sc-ctqQKy.hzSnZf');

console.log(previewDiv, tempStoreButton);
const appendButtonTag = () => {
  const button = document.createElement('button');

  button.classList.add('jYsOEX', 'gRPveD');

  button.innerText = '미리보기 토글';
  button.dataset.toggle = 'true';

  button.addEventListener('click', () => {
    console.log('아니 왜', button.dataset.toggle, typeof button.dataset.toggle);
    // 아니 왜 true string
    const isToggle = button.dataset.toggle === 'true';
    previewDiv.style.display = isToggle ? 'none' : '';
    footerContainer.style.width = isToggle ? '100vw' : '100%';
    button.dataset.toggle =
      button.dataset.toggle === 'false' ? 'true' : 'false';
  });

  //tempStoreButton.parentElement.insertAdjacentHTML('afterbegin', button);
  tempStoreButton.parentElement.prepend(button);
};
appendButtonTag();
