function calcular() {
    const valorInicialTexto = document.getElementById('valorInicial').value.trim();
    const aporteMensalTexto = document.getElementById('aporteMensal').value.trim();
    const taxaJurosTexto = document.getElementById('taxaJuros').value.trim();
    const tempoMesesTexto = document.getElementById('tempoMeses').value.trim();

    if (![valorInicialTexto, aporteMensalTexto, taxaJurosTexto, tempoMesesTexto].every(Boolean)) {
        alert('Preencha todos os campos.');
        return;
    }

    const valorInicial = Number(valorInicialTexto);
    const aporteMensal = Number(aporteMensalTexto);
    const taxaJuros = Number(taxaJurosTexto) / 100;
    const tempoMeses = Number(tempoMesesTexto);

    if (![valorInicial, aporteMensal, taxaJuros, tempoMeses].every(Number.isFinite) ||
        valorInicial < 0 || aporteMensal < 0 || taxaJuros < 0 ||
        !Number.isInteger(tempoMeses) || tempoMeses <= 0) {
        alert('Use valores e taxa não negativos, e um prazo inteiro maior que zero.');
        return;
    }

    const montanteInicial = valorInicial * Math.pow(1 + taxaJuros, tempoMeses);
    const montanteAportes = taxaJuros === 0
        ? aporteMensal * tempoMeses
        : aporteMensal * ((Math.pow(1 + taxaJuros, tempoMeses) - 1) / taxaJuros);
    const montanteFinal = montanteInicial + montanteAportes;

    const totalInvestido = valorInicial + (aporteMensal * tempoMeses);
    const totalJuros = montanteFinal - totalInvestido;

    const formatarMoeda = valor => valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    document.getElementById('textoResultado').innerHTML =
        'Valor final: ' + formatarMoeda(montanteFinal) + '<br>' +
        'Total investido: ' + formatarMoeda(totalInvestido) + '<br>' +
        'Total em juros: ' + formatarMoeda(totalJuros);

    document.getElementById('resultado').style.display = 'block';
}
