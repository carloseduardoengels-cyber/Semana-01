let tarefasSalvas = [];
try {
    tarefasSalvas = JSON.parse(localStorage.getItem('tarefas') || '[]');
} catch (erro) {
    localStorage.removeItem('tarefas');
}
let tarefas = Array.isArray(tarefasSalvas) ? tarefasSalvas : [];
let filtroAtual = 'todas';

function salvar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
function renderizar() {
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';

    let tarefasFiltradas = tarefas;

    if (filtroAtual === 'pendentes') {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
} else if(filtroAtual === 'concluidas') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
}

tarefasFiltradas.forEach(function(tarefa) {
    const li = document.createElement('li');
    li.style.cssText = 'padding: 10px; margin: 5px 0; background: #2c3e50; color: white; border-radius: 5px; display: flex; justify-content: space-between;';
    const texto = document.createElement('span');
    texto.textContent = tarefa.texto;
    texto.style.textDecoration = tarefa.concluida ? 'line-through' : 'none';

    const botoes = document.createElement('div');
    const botaoConcluir = document.createElement('button');
    botaoConcluir.type = 'button';
    botaoConcluir.textContent = '✅';
    botaoConcluir.setAttribute('aria-label', tarefa.concluida ? 'Reabrir tarefa' : 'Concluir tarefa');
    botaoConcluir.addEventListener('click', function() { concluir(tarefa.id); });

    const botaoDeletar = document.createElement('button');
    botaoDeletar.type = 'button';
    botaoDeletar.textContent = '🗑️';
    botaoDeletar.setAttribute('aria-label', 'Apagar tarefa');
    botaoDeletar.style.marginLeft = '5px';
    botaoDeletar.addEventListener('click', function() { deletar(tarefa.id); });

    botoes.append(botaoConcluir, botaoDeletar);
    li.append(texto, botoes);
    lista.appendChild(li);
    });
}

function adicionarTarefa() {
    const input = document.getElementById('inputTarefa');
    const texto = input.value.trim();
    if(texto === '') {
        alert('Digite uma tarefa!');
        return
    }
    tarefas.push({ id: Date.now(), texto: texto, concluida: false });
    input.value = '';
    salvar()
    renderizar();
}

function concluir(id) {
    tarefas = tarefas.map(function(t) {
        if (t.id === id) t.concluida = !t.concluida;
        return t;
    });
    salvar();
    renderizar();
}

function deletar(id) {
    tarefas = tarefas.filter(function(t) {
        return t.id !== id;
    });
    salvar();
    renderizar();
}

function filtrar(tipo) {
    filtroAtual = tipo;
    renderizar();
}
renderizar();
