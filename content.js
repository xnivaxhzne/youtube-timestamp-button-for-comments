window.onload = function() {
    const addTimeStamp = () => {
        const inputField = document.querySelector(
            "#creation-box #labelAndInputContainer #contenteditable-root"
        );
        if (inputField) {
            const video = document.querySelector("video");
            const currentTime = video.currentTime;
            let formattedTime = new Date(currentTime * 1000)
                .toISOString()
                .slice(11, 19);
            const currentText = inputField.innerText;
            if (currentText.length && currentText[currentText.length - 1] !== " ") {
                formattedTime = " " + formattedTime;
            }
            inputField.innerText += formattedTime;
        }
    };
    const addButton = (container, isPlaceholder = false) => {
        if (container && !document.querySelector("#timestampButton")) {
            const button = document.createElement("button");
            button.id = "timestampButton";
            button.innerText = "00:12";

            const style = document.createElement("style");
            style.textContent = `
                #timestampButton {
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
                #timestampButton::after {
                    content: "+";
                    position: absolute;
                    padding: 0 0 0 3px;
                    font-size: 14px;
                    background: black;
                    right: -5px;
                    z-index: 1;
                    bottom: 40%;
                }
                #timestampButton:hover {
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
                    setTimeout(() => addTimeStamp());
                } else {
                    addTimeStamp();
                }
            };
        }
    };

    const observer = new MutationObserver(() => {
        const placeholderComments = document.querySelector("#placeholder-area");
        const comments = document.querySelector(
            "#creation-box #labelAndInputContainer"
        );
        if (comments) {
            const button = document.querySelector("#timestampButton");
            if (button && placeholderComments.contains(button)) {
                placeholderComments.removeChild(button); // Remove from placeholderComments if present
            }
            addButton(comments); // Add button to comments
        } else if (placeholderComments) {
            addButton(placeholderComments, true); // Add button to placeholderComments if it exists
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};