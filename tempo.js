
function buscarTempo() {
  var cidade = document.getElementById('inputCidade').value.trim();
  var resultado = document.getElementById('resultado');

  if (!cidade) {
    resultado.innerHTML =
      '<p style="color: red;">Digite o nome de uma cidade.</p>';
    return;
  }

  resultado.innerHTML = '<p>Buscando previsão...</p>';

  var urlCidade =
    'https://geocoding-api.open-meteo.com/v1/search?name=' +
    encodeURIComponent(cidade) +
    '&count=1&language=pt&format=json';

  fetch(urlCidade)
    .then(function(response) {
      if (!response.ok) throw new Error();
      return response.json();
    })
    .then(function(dadosCidade) {
      if (!dadosCidade.results || dadosCidade.results.length === 0) {
        throw new Error('Cidade não encontrada.');
      }

      var local = dadosCidade.results[0];

      var urlClima =
        'https://api.open-meteo.com/v1/forecast?latitude=' +
        local.latitude +
        '&longitude=' + local.longitude +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
        '&timezone=auto';

      return fetch(urlClima)
        .then(function(response) {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then(function(dados) {
          return { local: local, clima: dados.current };
        });
    })
    .then(function(dados) {
      var local = dados.local;
      var clima = dados.clima;

      resultado.innerHTML =
        '<div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: center;">' +
        '<h2>' + local.name +
        (local.country ? ', ' + local.country : '') + '</h2>' +
        '<p style="font-size: 48px; font-weight: bold;">' +
        clima.temperature_2m + '°C</p>' +
        '<p>Sensação térmica: ' +
        clima.apparent_temperature + '°C</p>' +
        '<p>Umidade: ' + clima.relative_humidity_2m + '%</p>' +
        '<p>Vento: ' + clima.wind_speed_10m + ' km/h</p>' +
        '<p>Código meteorológico: ' + clima.weather_code + '</p>' +
        '</div>';
    })
    .catch(function() {
      resultado.innerHTML =
        '<p style="color: red;">Não foi possível consultar o clima. Verifique a cidade e tente novamente.</p>';
    });
}
