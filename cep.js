function buscarCep() {
    const input = document.getElementById('inputCep');
    const cep = input.value.replace(/\D/g, '');
    const resultado = document.getElementById('resultado');

    if (cep.length !== 8) {
        resultado.innerHTML = '<p style="color: red;">CEP deve ter 8 números.</p>';
        return;
}
resultado.innerHTML = '<p>Buscando...</p>';

fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function(response) {
        return response.json();
    })
    .then(function(dados) {
        if (dados.erro) {
            resultado.innerHTML = '<p style="color: red;">CEP não encontrado.</p>';
            return;
    }
    resultado.innerHTML =
    '<div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px;">' +
    '<p><strong>CEP:</strong> ' + dados.cep + '</p>' +
    '<p><strong>Logradouro:</strong> ' + dados.logradouro + '</p>' +
    '<p><strong>Bairro:</strong> ' + dados.bairro + '</p>' +
    '<p><strong>Cidade:</strong> ' + dados.localidade + '</p>' +
    '<p><strong>Estado:</strong> ' + dados.uf + '</p>' +
    '</div>';
})
.catch(function() {
    resultado.innerHTML = '<p style="color: red;">Erro na conexão. Tente novamente.</p>';
});
}