function separarZpl() {
    const input = document.getElementById("inputZpl").value;

    let textoLimpo = input
      .replace(/^\x10CT~~CD,~CC\^~CT~\s*/m, '')
      .replace(/\^XA~TA000~JSN\^LT0\^MNW\^MTT\^PON\^PMN\^LH0,0\^JMA\^PR2,2~SD22\^JUS\^LRN\^CI0\^XZ\s*/m, '');

    const linhas = textoLimpo.split('\n').map(l => l).filter(l => l.trim());

    let inicio = [], corpo = [], fim = [];

    for (let linha of linhas) {
      const trimmed = linha.trim();
      if (/^\^XA|\^MM|\^PW|\^LL|\^LS/.test(trimmed)) {
        inicio.push(linha);
      } else if (/^\^XZ|\^PQ/.test(trimmed)) {
        fim.push(linha);
      } else {
        corpo.push(linha);
      }
    }

    renderizarBloco("parteInicial", inicio);
    renderizarBloco("parteCorpo", corpo);
    renderizarBloco("parteFinal", fim);
}

function renderizarBloco(id, linhas) {
    const container = document.getElementById(id);
    container.innerHTML = "";

    linhas.forEach(linha => {
      const div = document.createElement("div");
      div.className = "linha";

      if (/^\^FX|^\^\/\/|^\s*\/\//.test(linha)) {
        div.classList.add("comentario");
      }

      div.innerHTML = `<span>${linha}</span><span></span>`;
      div.ondblclick = () => {
        navigator.clipboard.writeText(linha).then(() => {
          // Remove seleção de outras linhas
          document.querySelectorAll(".linha").forEach(l => l.classList.remove("selecionada"));
          div.classList.add("selecionada");
          div.querySelector("span:last-child").textContent = "✅ Copiado!";
        });
      };

      container.appendChild(div);
    });
}

function limparTudo() {
    document.getElementById("inputZpl").value = "";
    ["parteInicial", "parteCorpo", "parteFinal"].forEach(id => {
      document.getElementById(id).innerHTML = "";
    });
}
