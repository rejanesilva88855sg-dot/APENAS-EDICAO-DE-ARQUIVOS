function preencherCampos(cartao) {
    if (!cartao) return;

    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        const nome = input.name.toLowerCase();
        const id = input.id.toLowerCase();
        const ph = input.placeholder.toLowerCase();

        if (nome.includes("card") && nome.includes("number")) input.value = cartao.numero;
        if (id.includes("card") && id.includes("number")) input.value = cartao.numero;
        if (ph.includes("número") && ph.includes("cartão")) input.value = cartao.numero;

        if (nome.includes("expiry") || ph.includes("validade")) input.value = cartao.validade;
        if (id.includes("expiry")) input.value = cartao.validade;

        if (nome.includes("cvv") || nome.includes("cvc") || ph.includes("cvv")) input.value = cartao.cvv;
        if (id.includes("cvv") || id.includes("cvc")) input.value = cartao.cvv;
    });
}

function verificarPreenchimento() {
    chrome.runtime.sendMessage({ action: "obterCartaoSelecionado" }, (cartao) => {
        if (cartao) preencherCampos(cartao);
    });
}

setInterval(verificarPreenchimento, 1500);
