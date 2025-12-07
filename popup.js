document.getElementById("salvar").addEventListener("click", () => {
    const nome = document.getElementById("nome").value;
    const numero = document.getElementById("numero").value;
    const validade = document.getElementById("validade").value;
    const cvv = document.getElementById("cvv").value;

    if (!nome || !numero || !validade || !cvv) {
        alert("Preencha todos os campos!");
        return;
    }

    chrome.storage.local.get(["cartoes"], (data) => {
        const lista = data.cartoes || [];

        lista.push({ nome, numero, validade, cvv });

        chrome.storage.local.set({ cartoes: lista }, () => {
            alert("Cartão salvo!");
            carregarCartoes();
        });
    });
});

/* ======================
   IMPORTAÇÃO CSV
====================== */

document.getElementById("importCsvBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("csvInput");
    
    if (!fileInput.files.length) {
        alert("Escolha um arquivo CSV!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const linhas = e.target.result
            .split("\n")
            .map(l => l.trim())
            .filter(l => l !== "");

        const cartoesImportados = [];

        for (let i = 1; i < linhas.length; i++) {
            const col = linhas[i].split(",");

            if (col.length < 4) continue;

            cartoesImportados.push({
                nome: col[0],
                numero: col[1],
                validade: col[2],
                cvv: col[3]
            });
        }

        chrome.storage.local.get(["cartoes"], (data) => {
            const atual = data.cartoes || [];
            const novo = atual.concat(cartoesImportados);

            chrome.storage.local.set({ cartoes: novo }, () => {
                alert("Cartões importados com sucesso!");
                carregarCartoes();
            });
        });
    };

    reader.readAsText(file);
});

/* EXIBIR LISTA */
function carregarCartoes() {
    chrome.storage.local.get(["cartoes"], (data) => {
        const lista = document.getElementById("listaCartoes");
        lista.innerHTML = "";

        (data.cartoes || []).forEach((c, index) => {
            const li = document.createElement("li");
            li.textContent = `${c.nome} — ${c.numero} — ${c.validade}`;

            li.addEventListener("click", () => {
                chrome.storage.local.set({ cartaoSelecionado: index }, () => {
                    alert("Cartão selecionado! Vá para o checkout que ele será preenchido.");
                });
            });

            lista.appendChild(li);
        });
    });
}

carregarCartoes();
