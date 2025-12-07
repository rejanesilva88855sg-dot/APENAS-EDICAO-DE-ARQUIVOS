function preencherCampo(input, valor) {
    try {
        input.focus();
        input.value = valor;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(new Event("blur", { bubbles: true }));
    } catch (e) {}
}

function match(texto, termos) {
    texto = texto.toLowerCase();
    return termos.some(t => texto.includes(t));
}

function detectarCampos() {
    const inputs = document.querySelectorAll("input, select, textarea");

    let campos = {
        nome: null,
        numero: null,
        mes: null,
        ano: null,
        validade: null,
        cvv: null,
        cpf: null
    };

    inputs.forEach(el => {
        const txt = (
            (el.id || "") +
            " " +
            (el.name || "") +
            " " +
            (el.placeholder || "") +
            " " +
            (el.getAttribute("aria-label") || "")
        ).toLowerCase();

        // NOME DO TITULAR
        if (!campos.nome && match(txt, ["nome", "holder", "card name", "cardholder"])) {
            campos.nome = el;
        }

        // NÚMERO
        if (!campos.numero && match(txt, [
                "num", "number", "cc", "card", "pan", "cardnumber",
                "creditcard", "card-number", "cc-number", "payment"
        ])) {
            campos.numero = el;
        }

        // CVV
        if (!campos.cvv && match(txt, ["cvv", "cvc", "security", "cod", "code"])) {
            campos.cvv = el;
        }

        // MES
        if (!campos.mes && match(txt, ["mes", "month", "mm", "exp"])) {
            if (el.maxLength === 2 || el.placeholder.includes("MM")) {
                campos.mes = el;
            }
        }

        // ANO
        if (!campos.ano && match(txt, ["ano", "year", "yy", "aaaa", "exp"])) {
            if (el.maxLength === 2 || el.placeholder.includes("AA")) {
                campos.ano = el;
            }
        }

        // VALIDADE COMPLETA
        if (!campos.validade && match(txt, ["validade", "venc", "expiry", "exp date"])) {
            campos.validade = el;
        }

        // CPF
        if (!campos.cpf && match(txt, ["cpf", "document", "tax"])) {
            campos.cpf = el;
        }
    });

    return campos;
}

function aplicar(cartao) {
    const campo = detectarCampos();

    if (campo.nome) preencherCampo(campo.nome, cartao.nome);
    if (campo.numero) preencherCampo(campo.numero, cartao.numero);

    const mm = String(cartao.mes).padStart(2, "0");
    const aa = String(cartao.ano).slice(-2);
    const mmaa = mm + aa;

    if (campo.mes) preencherCampo(campo.mes, mm);
    if (campo.ano) preencherCampo(campo.ano, cartao.ano);
    if (campo.validade) preencherCampo(campo.validade, mmaa);
    if (campo.cvv) preencherCampo(campo.cvv, cartao.cvv);
    if (campo.cpf) preencherCampo(campo.cpf, cartao.cpf || "");
}

setInterval(() => {
    chrome.runtime.sendMessage({ action: "obterCartaoSelecionado" }, (cartao) => {
        if (cartao) aplicar(cartao);
    });
}, 1200);
