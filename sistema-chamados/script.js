
"use strict";

// 1. Encontrar os elementos do HTML
const formulario = document.querySelector("#formChamado");
const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoCategoria = document.querySelector("#categoria");
const campoPrioridade = document.querySelector("#prioridade");

const listaChamados = document.querySelector("#listaChamados");
const mensagemVazia = document.querySelector("#mensagemVazia");
const filtroStatus = document.querySelector("#filtroStatus");

const totalChamados = document.querySelector("#totalChamados");
const chamadosAbertos = document.querySelector("#chamadosAbertos");
const chamadosResolvidos = document.querySelector("#chamadosResolvidos");

// 2. Carregar os chamados salvos no navegador
function carregarChamados() {
  try {
    const dadosSalvos = localStorage.getItem("chamadosTI");

    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);

      if (Array.isArray(dados)) {
        return dados.filter((chamado) =>
          chamado &&
          typeof chamado.id === "string" &&
          typeof chamado.titulo === "string" &&
          typeof chamado.descricao === "string" &&
          typeof chamado.categoria === "string" &&
          typeof chamado.prioridade === "string" &&
          ["Aberto", "Resolvido"].includes(chamado.status)
        );
      }
    }
  } catch (erro) {
    console.error("Não foi possível carregar os chamados:", erro);
  }

  return [];
}

let chamados = carregarChamados();

// 3. Salvar os chamados no navegador
function salvarChamados() {
  try {
    localStorage.setItem("chamadosTI", JSON.stringify(chamados));
    return true;
  } catch (erro) {
    console.error("Não foi possível salvar os chamados:", erro);
    alert("Não foi possível salvar. Verifique o armazenamento do navegador.");
    return false;
  }
}

// 4. Atualizar os números do painel
function atualizarResumo() {
  totalChamados.textContent = chamados.length;

  chamadosAbertos.textContent = chamados.filter(
    (chamado) => chamado.status === "Aberto"
  ).length;

  chamadosResolvidos.textContent = chamados.filter(
    (chamado) => chamado.status === "Resolvido"
  ).length;
}

// 5. Criar um elemento HTML com texto seguro
function criarTexto(tag, texto, classe = "") {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;

  if (classe) {
    elemento.className = classe;
  }

  return elemento;
}

// 6. Mostrar os chamados na página
function renderizarChamados() {
  listaChamados.replaceChildren();

  const filtro = filtroStatus.value;

  const chamadosFiltrados = chamados.filter((chamado) => {
    return filtro === "Todos" || chamado.status === filtro;
  });

  mensagemVazia.hidden = chamadosFiltrados.length > 0;

  if (chamados.length === 0) {
    mensagemVazia.textContent = "Nenhum chamado cadastrado ainda.";
  } else if (chamadosFiltrados.length === 0) {
    mensagemVazia.textContent = "Não há chamados com esse status.";
  }

  chamadosFiltrados.forEach((chamado) => {
    const cartao = document.createElement("article");
    cartao.className = "chamado";

    if (chamado.status === "Resolvido") {
      cartao.classList.add("resolvido");
    }

    const titulo = criarTexto("h3", chamado.titulo);
    const descricao = criarTexto(
      "p",
      chamado.descricao,
      "descricao-chamado"
    );

    const detalhes = criarTexto(
      "p",
      `Categoria: ${chamado.categoria} | Prioridade: ${chamado.prioridade} | Status: ${chamado.status}`,
      "detalhes-chamado"
    );

    const acoes = document.createElement("div");
    acoes.className = "acoes-chamado";

    const botaoStatus = document.createElement("button");

    if (chamado.status === "Aberto") {
      botaoStatus.textContent = "Resolver chamado";
    } else {
      botaoStatus.textContent = "Reabrir chamado";
    }

    botaoStatus.addEventListener("click", () => {
      alterarStatus(chamado.id);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.className = "botao-excluir";

    botaoExcluir.addEventListener("click", () => {
      excluirChamado(chamado.id);
    });

    acoes.append(botaoStatus, botaoExcluir);
    cartao.append(titulo, descricao, detalhes, acoes);
    listaChamados.appendChild(cartao);
  });

  atualizarResumo();
}

// 7. Cadastrar um novo chamado
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const titulo = campoTitulo.value.trim();
  const descricao = campoDescricao.value.trim();

  if (!titulo || !descricao) {
    alert("Preencha o título e a descrição do chamado.");
    return;
  }

  const novoChamado = {
    id: crypto.randomUUID(),
    titulo: titulo,
    descricao: descricao,
    categoria: campoCategoria.value,
    prioridade: campoPrioridade.value,
    status: "Aberto"
  };

  chamados.unshift(novoChamado);

  if (!salvarChamados()) {
    chamados.shift();
    return;
  }

  formulario.reset();
  filtroStatus.value = "Todos";
  renderizarChamados();
});

// 8. Alterar o status de um chamado
function alterarStatus(id) {
  const chamado = chamados.find((item) => item.id === id);

  if (!chamado) {
    return;
  }

  const statusAnterior = chamado.status;

  chamado.status =
    chamado.status === "Aberto" ? "Resolvido" : "Aberto";

  if (!salvarChamados()) {
    chamado.status = statusAnterior;
    return;
  }

  renderizarChamados();
}

// 9. Excluir um chamado
function excluirChamado(id) {
  const confirmar = confirm(
    "Tem certeza de que deseja excluir este chamado?"
  );

  if (!confirmar) {
    return;
  }

  const indice = chamados.findIndex((item) => item.id === id);

  if (indice === -1) {
    return;
  }

  const removido = chamados.splice(indice, 1)[0];

  if (!salvarChamados()) {
    chamados.splice(indice, 0, removido);
    return;
  }

  renderizarChamados();
}

// 10. Atualizar a lista quando o filtro mudar
filtroStatus.addEventListener("change", renderizarChamados);

// 11. Mostrar os chamados ao abrir a página
renderizarChamados();
