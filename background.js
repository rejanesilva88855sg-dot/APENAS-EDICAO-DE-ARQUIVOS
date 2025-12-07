chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getCards") {
        chrome.storage.local.get(["cards"], res => {
            sendResponse(res.cards || []);
        });
        return true;
    }

    if (msg.action === "fillCard") {
        chrome.storage.local.get(["cards"], res => {
            let card = res.cards.find(c => c.id === msg.id);
            sendResponse(card);
        });
        return true;
    }
});
