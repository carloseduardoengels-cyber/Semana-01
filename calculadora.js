function calcular() {
    const valorInicial = parseFloat(document.getElementById('valorInicial').value);
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value);
    const taxaJuros = parseFloat(document.getElementById('taxaJuros').value) / 100;
    const tempoMeses = parseInt(document.getElementById('tempoMeses').value);

    if (isNaN(valorInicial) || isNaN(aporteMensal) || isNaN(taxaJuros) || isNaN(tempoMeses)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const montanteInicial = valorInicial * Math.pow(1 + taxaJuros, tempoMeses);
    const montanteAportes = aporteMensal * ((Math.pow(1 + taxaJuros, tempoMeses) - 1) / taxaJuros);
    const montanteFinal = montanteInicial + montanteAportes;

    const totalInvestido = valorInicial + (aporteMensal * tempoMeses);
    const totalJuros = montanteFinal - totalInvestido;

    document.getElementById('textoResultado').innerHTML =
        'Valor final: R$ ' + montanteFinal.toFixed(2).replace('.', ',') + '<br>' +
        'Total investido: R$ ' + totalInvestido.toFixed(2).replace('.', ',') + '<br>' +
        'Total em juros: R$ ' + totalJuros.toFixed(2).replace('.', ',');

    document.getElementById('resultado').style.display = 'block';
}   