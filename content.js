window.onload = function() {
    const addButton = () => {
        const commentSection = document.querySelector(
            "#creation-box #labelAndInputContainer"
        );
        const inputField = document.querySelector(
            "#creation-box #labelAndInputContainer #contenteditable-root"
        );
        if (commentSection && !document.querySelector("#timestampButton")) {
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
                    position: relative
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
                
                #creation-box #labelAndInputContainer {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }
            `;
            document.head.appendChild(style);

            commentSection.prepend(button);

            button.onclick = () => {
                const video = document.querySelector("video");
                const currentTime = video.currentTime;
                const formattedTime = new Date(currentTime * 1000)
                    .toISOString()
                    .slice(11, 19);
                inputField.innerText += formattedTime;
            };
        }
    };

    const observer = new MutationObserver((_mutations, observer) => {
        if (document.querySelector("#creation-box #labelAndInputContainer")) {
            addButton();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};