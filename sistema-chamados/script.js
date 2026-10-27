
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
const pesquisaChamados = document.querySelector("#pesquisaChamados");

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

const ordemPrioridade = {
  "Alta": 1,
  "Média": 2,
  "Baixa": 3
};


  

  const termoPesquisa = pesquisaChamados.value.trim().toLowerCase();

const chamadosFiltrados = chamados
  .filter((chamado) => filtro === "Todos" || chamado.status === filtro)
  .filter((chamado) =>
    chamado.titulo.toLowerCase().includes(termoPesquisa) ||
    chamado.descricao.toLowerCase().includes(termoPesquisa)
  )
  .sort((a, b) => {
    const diferencaPrioridade =
      ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];

    if (diferencaPrioridade !== 0) {
      return diferencaPrioridade;
    }

    return new Date(a.dataCadastro) - new Date(b.dataCadastro);
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

    if (chamado.prioridade === "Alta") {
  cartao.classList.add("prioridade-alta");
}

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


let textoData = "Data de cadastro indisponível";

if (chamado.dataCadastro) {
  const data = new Date(chamado.dataCadastro);

  if (!Number.isNaN(data.getTime())) {
    textoData = `Cadastrado em: ${data.toLocaleString("pt-BR")}`;
  }
}

const dataCadastro = criarTexto(
  "p",
  textoData,
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
    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.className = "botao-editar";

    botaoExcluir.addEventListener("click", () => {
      excluirChamado(chamado.id);
    });


botaoEditar.addEventListener("click", () => {
  const formularioEdicao = document.createElement("form");
  formularioEdicao.className = "formulario-edicao";

  const campoTituloEdicao = document.createElement("input");
  campoTituloEdicao.type = "text";
  campoTituloEdicao.value = chamado.titulo;
  campoTituloEdicao.required = true;
  campoTituloEdicao.placeholder = "Título do chamado";

  const campoDescricaoEdicao = document.createElement("textarea");
  campoDescricaoEdicao.value = chamado.descricao;
  campoDescricaoEdicao.required = true;
  campoDescricaoEdicao.placeholder = "Descrição do chamado";

  const campoCategoriaEdicao = document.createElement("select");

  const categorias = [
  "Hardware",
  "Software",
  "Rede / Internet",
  "Acesso / Senha",
  "Outro"
  ];

  categorias.forEach((categoria) => {
    const opcao = document.createElement("option");
    opcao.value = categoria;
    opcao.textContent = categoria;
    campoCategoriaEdicao.appendChild(opcao);
  });

  campoCategoriaEdicao.value = chamado.categoria;

  const campoPrioridadeEdicao = document.createElement("select");

  ["Baixa", "Média", "Alta"].forEach((prioridade) => {
    const opcao = document.createElement("option");
    opcao.value = prioridade;
    opcao.textContent = prioridade;
    campoPrioridadeEdicao.appendChild(opcao);
  });

  campoPrioridadeEdicao.value = chamado.prioridade;

  const botaoSalvarEdicao = document.createElement("button");
  botaoSalvarEdicao.type = "submit";
  botaoSalvarEdicao.textContent = "Salvar alterações";

  const botaoCancelarEdicao = document.createElement("button");
  botaoCancelarEdicao.type = "button";
  botaoCancelarEdicao.textContent = "Cancelar";

  formularioEdicao.append(
    campoTituloEdicao,
    campoDescricaoEdicao,
    campoCategoriaEdicao,
    campoPrioridadeEdicao,
    botaoSalvarEdicao,
    botaoCancelarEdicao
  );

  const cartao = botaoEditar.closest(".chamado");

  if (!cartao) {
    alert("Não foi possível encontrar o chamado para editar.");
    return;
  }

  cartao.appendChild(formularioEdicao);
  botaoEditar.disabled = true;

  botaoCancelarEdicao.addEventListener("click", () => {
    formularioEdicao.remove();
    botaoEditar.disabled = false;
  });

  formularioEdicao.addEventListener("submit", (evento) => {
    evento.preventDefault();

    chamado.titulo = campoTituloEdicao.value.trim();
    chamado.descricao = campoDescricaoEdicao.value.trim();
    chamado.categoria = campoCategoriaEdicao.value;
    chamado.prioridade = campoPrioridadeEdicao.value;

    salvarChamados();
    renderizarChamados();
  });
});


    acoes.append(botaoStatus, botaoExcluir, botaoEditar);
    cartao.append(titulo, descricao, detalhes, dataCadastro, acoes);
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
  dataCadastro: new Date().toISOString(),
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
pesquisaChamados.addEventListener("input", renderizarChamados);

// 11. Mostrar os chamados ao abrir a página
renderizarChamados();
