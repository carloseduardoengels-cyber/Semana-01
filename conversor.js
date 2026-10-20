
function converter() {
  var valor = Number(document.getElementById('valor').value);
  var origem = document.getElementById('moedaOrigem').value;
  var destino = document.getElementById('moedaDestino').value;
  var resultado = document.getElementById('resultado');

  if (!Number.isFinite(valor) || valor <= 0) {
    resultado.innerHTML =
      '<p style="color: red;">Digite um valor válido.</p>';
    return;
  }

  if (origem === destino) {
    resultado.innerHTML =
      '<p>' + valor.toFixed(2) + ' ' + origem +
      ' = ' + valor.toFixed(2) + ' ' + destino + '</p>';
    return;
  }

  resultado.innerHTML = '<p>Buscando cotação...</p>';

  var url = 'https://api.frankfurter.dev/v1/latest?base=' +
    encodeURIComponent(origem) +
    '&symbols=' + encodeURIComponent(destino);

  fetch(url)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Falha ao consultar a cotação.');
      }
      return response.json();
    })
    .then(function(dados) {
      var taxa = dados.rates && dados.rates[destino];

      if (typeof taxa !== 'number') {
        throw new Error('Moeda não encontrada.');
      }

      var convertido = (valor * taxa).toFixed(2);

      resultado.innerHTML =
        '<div style="background: #2c3e50; color: white; ' +
        'padding: 20px; border-radius: 8px; text-align: center;">' +
        '<p>' + valor.toFixed(2) + ' ' + origem + ' = </p>' +
        '<p style="font-size: 32px; font-weight: bold;">' +
        convertido + ' ' + destino + '</p>' +
        '<p>Taxa: 1 ' + origem + ' = ' +
        taxa.toFixed(4) + ' ' + destino + '</p>' +
        '<p>Data da cotação: ' + dados.date + '</p>' +
        '</div>';
    })
    .catch(function() {
      resultado.innerHTML =
        '<p style="color: red;">Não foi possível obter a cotação. Tente novamente.</p>';
    });
}
