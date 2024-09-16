window.onload = function () {
  const addTimeStamp = (container) => {
    const inputField = container.querySelector(
      "#creation-box #labelAndInputContainer #contenteditable-root"
    );
    if (inputField) {
      const video = document.querySelector("video");
      const currentTime = video.currentTime;
      let formattedTime = new Date(currentTime * 1000)
        .toISOString()
        .slice(11, 19);

      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        const newText = document.createTextNode(formattedTime);

        range.insertNode(newText);

        range.setStartAfter(newText);
        range.setEndAfter(newText);

        selection.removeAllRanges();
        selection.addRange(range);

        const event = new Event("input", {
          bubbles: true,
          cancelable: true,
        });

        inputField.dispatchEvent(event);
      }
    }
  };
  const addButton = (container, isPlaceholder = false) => {
    if (container && !container.querySelector(".timestampButton")) {
      const button = document.createElement("button");
      button.className = "timestampButton";
      button.innerText = "00:12";

      const style = document.createElement("style");
      style.textContent = `
                .timestampButton {
                    background: transparent;
                    color: #bab5b5;
                    border: 1px solid #bab5b5;
                    padding: 3px 6px;
                    outline: none;
                    cursor: pointer;
                    flex-shrink: 0;
                    font-size: 100%;
                    margin-bottom: 5px;
                    position: relative;
                }
                .timestampButton::after {
                    content: "+";
                    position: absolute;
                    padding: 0 0 0 3px;
                    font-size: 14px;
                    background: black;
                    right: -5px;
                    z-index: 1;
                    bottom: 40%;
                }
                .timestampButton:hover {
                    color: #fff;
                    border: 1px solid #fff;
                }
                #creation-box #labelAndInputContainer, #simple-box #placeholder-area {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }
            `;
      document.head.appendChild(style);

      container.prepend(button);

      button.onclick = () => {
        if (isPlaceholder) {
          setTimeout(() => addTimeStamp(document));
        } else {
          addTimeStamp(container);
        }
      };
    }
  };

  const observer = new MutationObserver(() => {
    const replyComments = document.querySelectorAll(
      "#reply-dialog #creation-box #labelAndInputContainer"
    );
    const placeholderComments = document.querySelector("#placeholder-area");
    const comments = document.querySelector(
      "#creation-box #labelAndInputContainer"
    );
    if (replyComments.length) {
      replyComments.forEach((replyComment) => addButton(replyComment));
    } else if (comments) {
      addButton(comments);
    } else if (placeholderComments) {
      addButton(placeholderComments, true);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};
