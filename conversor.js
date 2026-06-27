function converter() {
  var valor = document.getElementById('valor').value;
  var origem = document.getElementById('moedaOrigem').value;
  var destino = document.getElementById('moedaDestino').value;
  var resultado = document.getElementById('resultado');

  // Chave de API configurada
  var apikey = '7844d2155ab54561795c695d';

  if (!valor || valor <= 0) {
    resultado.innerHTML = '<p style="color: red;">Digite um valor válido.</p>';
    return;
  }

  resultado.innerHTML = '<p>Buscando cotação...</p>';

  fetch('https://v6.exchangerate-api.com/v6/' + apikey + '/latest/' + origem)
    .then(function(response) {
      return response.json();
    })
    .then(function(dados) {
      var taxa = dados.conversion_rates[destino];
      var convertido = (valor * taxa).toFixed(2);

      resultado.innerHTML =
        '<div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: center;">' +
        '<p style="font-size: 14px;">' + valor + ' ' + origem + ' = </p>' +
        '<p style="font-size: 32px; font-weight: bold;">' + convertido + ' ' + destino + '</p>' +
        '<p style="font-size: 12px; color: #aaa;">Taxa: 1 ' + origem + ' = ' + taxa.toFixed(4) + ' ' + destino + '</p>' +
        '</div>';
    })
    .catch(function(erro) {
      console.error(erro);
      resultado.innerHTML = '<p style="color: red;">Erro ao buscar cotação. Tente novamente.</p>';
    });
}