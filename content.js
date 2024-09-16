const TIME_STAMP_BTN_CLASS = "timestampButton";
const PLACEHOLDER_TIME_STAMP = "00:12";

const addTimeStamp = (container) => {
  const inputField = container.querySelector(
    "#creation-box #labelAndInputContainer #contenteditable-root"
  );
  if (!inputField) return;

  const video = document.querySelector("video");
  const currentTime = video.currentTime;
  const formattedTime = new Date(currentTime * 1000)
    .toISOString()
    .slice(11, 19);

  const selection = window.getSelection();
  if (selection.rangeCount <= 0) return;

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
};

const addButton = (container, isPlaceholder = false) => {
  const hasContainTheTimeStampButton = container.querySelector(
    "." + TIME_STAMP_BTN_CLASS
  );
  if (!hasContainTheTimeStampButton) {
    const button = document.createElement("button");
    button.className = TIME_STAMP_BTN_CLASS;
    button.innerText = PLACEHOLDER_TIME_STAMP;

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

const addStyles = (isDarkTheme) => {
  const style = document.createElement("style");
  const themeBasedFontColor = isDarkTheme ? "#fff" : "#000";
  const themeBasedBgColor = isDarkTheme ? "#000" : "#fff";
  style.textContent = `
              .timestampButton {
                  background: transparent;
                  color: #bab5b5;
                  border: 1px solid #bab5b5;
                  padding: 3px 6px;
                  outline: none;
                  cursor: pointer;
                  flex-shrink: 0;
                  font-size: 10px;
                  margin-bottom: 5px;
                  position: relative;
              }
              .timestampButton::after {
                  content: "+";
                  position: absolute;
                  padding: 0 0 0 3px;
                  font-size: 14px;
                  background: ${themeBasedBgColor};
                  right: -5px;
                  z-index: 1;
                  bottom: 40%;
              }
              .timestampButton:hover {
                  color: ${themeBasedFontColor};
                  border: 1px solid ${themeBasedFontColor};
              }
              #creation-box #labelAndInputContainer, #simple-box #placeholder-area {
                  display: flex;
                  gap: 10px;
                  align-items: flex-start;
              }
          `;
  document.head.appendChild(style);
};

const isDarkTheme = () => {
  const metaName = "theme-color";
  const metaTag = document.querySelector(`meta[name="${metaName}"]`);
  if (!metaTag) return true;

  const content = metaTag.getAttribute("content");
  return !content.includes("255, 255, 255");
};

const observer = new MutationObserver(() => {
  const nestedReplyComments = document.querySelectorAll(
    "#reply-dialog #creation-box #labelAndInputContainer"
  );
  const placeholderReplyComment = document.querySelector("#placeholder-area");
  const replyComment = document.querySelector(
    "#creation-box #labelAndInputContainer"
  );

  if (nestedReplyComments.length) {
    nestedReplyComments.forEach((nestedReplyComment) =>
      addButton(nestedReplyComment)
    );
  } else if (replyComment) {
    addButton(replyComment);
  } else if (placeholderReplyComment) {
    addButton(placeholderReplyComment, true);
  }
});

window.onload = function () {
  const isDarkThemeUsed = isDarkTheme();
  addStyles(isDarkThemeUsed);
  observer.observe(document.body, { childList: true, subtree: true });
};
