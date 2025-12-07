chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "obterCartaoSelecionado") {
        chrome.storage.local.get(["cartoes", "cartaoSelecionado"], (data) => {
            const cartoes = data.cartoes || [];
            const index = data.cartaoSelecionado;

            if (index === undefined || !cartoes[index]) {
                sendResponse(null);
                return;
            }

            sendResponse(cartoes[index]);
        });

        return true;
    }
});
