(() => {
  /*

  null
pasteEvent = new ClipboardEvent('paste',{clipboardData: new DataTransfer()})
ClipboardEvent {isTrusted: false, clipboardData: DataTransfer, type: 'paste', target: null, currentTarget: null, …}
pasteEvent.clipboardData.items.add(`# 안녕하세요
# 조심히 가세요`)
VM13626:1 Uncaught TypeError: Failed to execute 'add' on 'DataTransferItemList': parameter 1 is not of type 'File'.
    at <anonymous>:1:32
(anonymous) @ VM13626:1
pasteEvent.clipboardData.items.add(`# 안녕하세요
# 조심히 가세요`,'text/plain')
DataTransferItem {kind: 'string', type: 'text/plain'}
$0.dispatchEvent(pasteEvent)
instrument.ts:113 null
true
   */
  console.log('content script execute');
  let $button;
  function createButton() {
    $button = document.createElement('button');
    $button.classList.add('jYsOEX', 'gRPveD');

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
  function toggleButtonExecute() {
    if (!$button) createButton(); // 버튼이 없을 시에는 버튼을 생성한다.

    const $previewDiv = document.querySelector('[data-testid="right"]');
    const $tempStoreButton = Array.prototype.slice
      .call(document.querySelectorAll('button'))
      .filter((element) => element.innerText.includes('임시저장'))[0];
    const $footerContainer = document.querySelector('.sc-ctqQKy.hzSnZf');

    if (!$previewDiv || !$tempStoreButton) return;

    $button.addEventListener(
      'click',
      handlerButtonEvent($previewDiv, $footerContainer, $button),
    );
    appendButton($tempStoreButton, $button);
  }

  chrome.runtime.onMessage.addListener((obj) => {
    const { isMatched } = obj;
    console.log('herf is executing');
    if (!isMatched) return;
    toggleButtonExecute();
  });
  toggleButtonExecute();
})();
