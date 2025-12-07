function preencher(campo, valor) {
    if (!campo) return;
    campo.value = valor;
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));
}

function normalizar(texto) {
    return texto.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/\s+/g, "");
}

function detectarCampos() {
    const inputs = document.querySelectorAll("input, select");

    let campos = {
        nomeTitular: null,
        numero: null,
        validade: null,
        mes: null,
        ano: null,
        cvv: null,
        cpf: null
    };

    inputs.forEach(input => {
        const id = normalizar(input.id || "");
        const name = normalizar(input.name || "");
        const ph = normalizar(input.placeholder || "");
        const aria = normalizar(input.getAttribute("aria-label") || "");

        const txt = id + name + ph + aria;

        // NOME TITULAR
        if (
            txt.includes("nome") ||
            txt.includes("cardname") ||
            txt.includes("holder") ||
            txt.includes("cardholder")
        ) {
            campos.nomeTitular = input;
        }

        // NÚMERO
        if (
            txt.includes("cardnumber") ||
            txt.includes("numerocartao") ||
            txt.includes("number") && txt.includes("card") ||
            txt.includes("cardnumber")
        ) {
            campos.numero = input;
        }

        // MÊS
        if (
            (txt.includes("exp") || txt.includes("validade") || txt.includes("venc")) &&
            (txt.includes("mes") || txt.includes("month") || txt.match(/mm/))
        ) {
            campos.mes = input;
        }

        // ANO
        if (
            (txt.includes("exp") || txt.includes("validade") || txt.includes("venc")) &&
            (txt.includes("ano") || txt.includes("year") || txt.match(/yy/))
        ) {
            campos.ano = input;
        }

        // VALIDADE COMPLETA
        if (
            txt.includes("exp") ||
            txt.includes("validade") ||
            txt.includes("vencimento")
        ) {
            campos.validade = input;
        }

        // CVV
        if (
            txt.includes("cvv") ||
            txt.includes("cvc") ||
            txt.includes("codigoseguranca") ||
            txt.includes("securitycode")
        ) {
            campos.cvv = input;
        }

        // CPF
        if (
            txt.includes("cpf") ||
            txt.includes("document") ||
            txt.includes("tax") ||
            txt.includes("cpfnumber")
        ) {
            campos.cpf = input;
        }
    });

    return campos;
}

function aplicarCartao(cartao) {
    const campos = detectarCampos();

    if (campos.nomeTitular) preencher(campos.nomeTitular, cartao.nome);
    if (campos.numero) preencher(campos.numero, cartao.numero);

    const validadeFormatada = `${cartao.mes}${cartao.ano.toString().slice(-2)}`;

    if (campos.validade) preencher(campos.validade, validadeFormatada);
    if (campos.mes) preencher(campos.mes, cartao.mes);
    if (campos.ano) preencher(campos.ano, cartao.ano);

    if (campos.cvv) preencher(campos.cvv, cartao.cvv);

    if (campos.cpf) preencher(campos.cpf, cartao.cpf || "");
}

// VERIFICA A CADA 1 SEGUNDO
setInterval(() => {
    chrome.runtime.sendMessage({ action: "obterCartaoSelecionado" }, (cartao) => {
        if (cartao) aplicarCartao(cartao);
    });
}, 1000);
