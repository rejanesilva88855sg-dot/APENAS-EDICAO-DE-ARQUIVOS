function detectCardFields() {
    const numberField = document.querySelector("input[name*='card'], input[id*='card'], input[autocomplete='cc-number']");
    const dateField = document.querySelector("input[name*='exp'], input[id*='exp'], input[autocomplete='cc-exp']");
    const cvvField  = document.querySelector("input[name*='cvv'], input[name*='cvc'], input[id*='cvv'], input[id*='cvc'], input[autocomplete='cc-csc']");

    if (!numberField) return;

    if (!document.getElementById("autoFillBTN")) {
        const btn = document.createElement("button");
        btn.id = "autoFillBTN";
        btn.innerText = "Usar Cartão Salvo";
        btn.style.cssText = `
            padding: 6px 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 8px 0;
            display: block;
        `;
        numberField.parentNode.insertBefore(btn, numberField);

        btn.onclick = async () => {
            chrome.runtime.sendMessage({ action: "getCards" }, cards => {
                if (!cards.length) {
                    alert("Nenhum cartão salvo.");
                    return;
                }

                const name = prompt("Selecione o número do cartão:\n" + cards.map(c => `${c.id} - ${c.name}`).join("\n"));

                if (!name) return;

                chrome.runtime.sendMessage({ action: "fillCard", id: name }, card => {
                    if (!card) return;

                    if (numberField) numberField.value = card.number;
                    if (dateField) dateField.value = card.exp;
                    if (cvvField) cvvField.value = card.cvv;

                    numberField.dispatchEvent(new Event("input", { bubbles: true }));
                    dateField?.dispatchEvent(new Event("input", { bubbles: true }));
                    cvvField?.dispatchEvent(new Event("input", { bubbles: true }));
                });
            });
        };
    }
}

setInterval(detectCardFields, 1200);
