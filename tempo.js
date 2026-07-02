var chave = '2d017d499f925e140663134486c23188';

function buscarTempo() {
    var cidade = document.getElementById('inputCidade').value;
    var resultado = document.getElementById('resultado');

    if (!cidade) {
        resultado.innerHTML = '<p style="color: red;">Digite o nome de uma cidade.</p>';
        return;
    }

    resultado.innerHTML = '<p>Buscando...</p>';

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cidade + '&appid=' + chave + '&units=metric&lang=pt_br')
        .then(function(response) {
            return response.json();
        })
        .then(function(dados) {
            if (dados.cod === '404') {
                resultado.innerHTML = '<p style="color: red;">"Cidade não encontrada.</p>';
                return;
        }

        var icone = dados.weather[0].icon;
        var descricao = dados.weather[0].description;
        var temp = dados.main.temp.toFixed(1);
        var sensacao = dados.main.feels_like.toFixed(1);
        var umidade = dados.main.humidity;
        var vento = dados.wind.speed;

        resultado.innerHTML =
        '<div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px; text-align: center;">' +
        '<h2>' + dados.name + ', ' + dados.sys.country + '</h2>' +
        '<img src="https://openweathermap.org/img/wn/' + icone + '@2x.png">' +
        '<p style="font-size: 48px; font-weight: bold;">' + temp + '°C</p>' +
        '<p style="text-transform: capitalize;">' + descricao + '</p>' +
        '<p>Sensação térmica: ' + sensacao + '°C</p>' +
        '<p>Umidade: ' + umidade + '%</p>' +
        '<p>Vento: ' + vento + ' m/s</p>' +
        '</div>';

    })
    .catch(function() {
        resultado.innerHTML = '<p style="color: red;">Erro ao buscar dados. tente novamente.</p>';
    });
}