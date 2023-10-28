const UTIL_SRC = chrome.runtime.getURL("scripts/common/util.js");
(async () => {
  const { select } = await import(UTIL_SRC);
  let $button;
  function createButton() {
    $button = document.createElement("button");
    $button.classList.add("jYsOEX", "gRPveD");

    $button.innerText = "미리보기 토글";
    $button.dataset.toggle = "true";

    return;
  }
  function handlerButtonEvent($previewDiv, $footerContainer, $button) {
    return () => {
      const isToggle = $button.dataset.toggle === "true";
      $previewDiv.style.display = isToggle ? "none" : "";
      $footerContainer.style.width = isToggle ? "100vw" : "100%";
      $button.dataset.toggle = isToggle ? "false" : "true";
    };
  }
  function appendButton($tempStoreButton, $button) {
    $tempStoreButton.parentElement.prepend($button);
  }
  function toggleButtonExecute() {
    if (!$button) createButton(); // 버튼이 없을 시에는 버튼을 생성한다.

    const $previewDiv = document.querySelector('[data-testid="right"]');
    const $tempStoreButton = Array.prototype.slice
      .call(document.querySelectorAll("button"))
      .filter((element) => element.innerText.includes("임시저장"))[0];
    //class="sc-eldieg ldPToJ"
    // class="sc-ctqQKy hzSnZf"
    const $footerContainer =
      document.querySelector(".sc-ctqQKy.hzSnZf") ??
      document.querySelector(".sc-eldieg.ldPToJ");
    console.log({ $previewDiv, $tempStoreButton });
    if (!$previewDiv || !$tempStoreButton) return;

    $button.addEventListener(
      "click",
      handlerButtonEvent($previewDiv, $footerContainer, $button),
    );
    appendButton($tempStoreButton, $button);
  }

  /**
   * template start
   * save template
   */
  // body 생성 및 template button wrapper
  const templateWrapper = document.createElement("div");
  templateWrapper.style.position = "absolute";
  templateWrapper.style.top = "0";
  templateWrapper.style.right = "0";
  templateWrapper.style.width = "300px";
  templateWrapper.style.height = "auto";
  const body = select("body");

  function setLocalStorage(saveTemplate) {
    localStorage.setItem("template", JSON.stringify(saveTemplate));
  }

  const appendSaveTemplateBtn = () => {
    const button = document.createElement("button");

    button.innerText = "템플릿 저장";
    templateWrapper.innerHTML = "";
    templateWrapper.append(button);
    body.append(templateWrapper);

    button.addEventListener("click", (event) => {
      // 템플릿 데이터 가져오기
      const templateTexts = Array.from(
        document.querySelectorAll(".CodeMirror-line"),
      );
      if (templateTexts.length <= 0) {
        alert("템플릿을 입력해 주세요.");
        return;
      }

      function TemplateObject(content) {
        this.id = Date.now();
        this.content = content;
      }

      const templateContent = templateTexts.reduce((acc, cus) => {
        return (acc +=
          cus.innerText.replace(/\u200B/g, "") === ""
            ? `\n`
            : cus.innerText + "\n");
      }, "");

      const template = new TemplateObject(templateContent);
      const getTemplate = localStorage.getItem("template") ?? "[]";
      const saveTemplate = [...JSON.parse(getTemplate), template];

      setLocalStorage(saveTemplate);
      getTemplateBtn();
    });
  };

  const getTemplateBtn = () => {
    let template = document.querySelector("#template-btn-wrapper");
    if (!template) {
      template = document.createElement("div");
      template.setAttribute("id", "template-btn-wrapper");
    }
    template.innerHTML = "";

    const getTemplate = JSON.parse(localStorage.getItem("template") ?? "[]");
    getTemplate.forEach((item, index) => {
      const button = document.createElement("button");
      button.innerText = `${index}번 템플릿`;
      button.dataset.index = index;
      template.append(button);
    });
    templateWrapper.append(template);
    // 템플릿 버튼 이벤트 등록
    const templateBtns = document.querySelectorAll(
      "#template-btn-wrapper button",
    );
    templateBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        // 붙여넣기 대상
        const textArea = document.querySelector(".CodeMirror textarea");

        // clipboard 객체 생성
        const clipboard = new ClipboardEvent("paste", {
          clipboardData: new DataTransfer(),
        });

        // cliboard에 데이터 주입
        clipboard.clipboardData.items.add(
          getTemplate[index].content,
          "text/plain",
        );

        // clipboard 이벤트 실행
        textArea.dispatchEvent(clipboard);
      });
    });
  };

  chrome.runtime.onMessage.addListener((obj) => {
    const { isMatched } = obj;
    if (!isMatched || !select(".CodeMirror")) return;
    toggleButtonExecute();
    appendSaveTemplateBtn();
    getTemplateBtn();
  });

  const codeMirror = select(".CodeMirror");
  if (!codeMirror) return;

  toggleButtonExecute();
  appendSaveTemplateBtn();
  getTemplateBtn();
})();
