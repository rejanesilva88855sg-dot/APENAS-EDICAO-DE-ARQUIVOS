function loadCards() {
    chrome.storage.local.get(["cards"], res => {
        const list = res.cards || [];
        const container = document.getElementById("cards");
        container.innerHTML = "";

        list.forEach(c => {
            let div = document.createElement("div");
            div.className = "card-item";
            div.innerHTML = `
                <strong>${c.name}</strong><br>
                **** **** **** ${c.number.slice(-4)}
            `;
            container.appendChild(div);
        });
    });
}

document.getElementById("save").onclick = () => {
    let name = document.getElementById("cardName").value.trim();
    let number = document.getElementById("cardNumber").value.trim();
    let exp = document.getElementById("cardExp").value.trim();
    let cvv = document.getElementById("cardCVV").value.trim();

    if (!name || !number || !exp || !cvv) {
        alert("Preencha todos os campos!");
        return;
    }

    chrome.storage.local.get(["cards"], res => {
        let cards = res.cards || [];

        cards.push({
            id: Date.now().toString(),
            name,
            number,
            exp,
            cvv
        });

        chrome.storage.local.set({ cards }, () => {
            loadCards();
            alert("Cartão salvo!");
        });
    });
};

loadCards();
