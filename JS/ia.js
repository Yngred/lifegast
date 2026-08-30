// ia.js — módulo de IA do LifeGast (roda local no navegador, sem API key)

let classificador = null;

async function carregarClassificador() {
  if (classificador) return classificador;
  classificador = await window.transformersPipeline(
    'zero-shot-classification',
    'Xenova/distilbert-base-uncased-mnli'
  );
  return classificador;
}

const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Compras',
  'Outros'
];

async function categorizarTransacao(descricao) {
  const modelo = await carregarClassificador();
  const resultado = await modelo(descricao, CATEGORIAS);
  return resultado.labels[0];
}

function gerarInsights(transacoes) {
  const despesas = transacoes.filter(t => t.tipo === 'despesa');

  if (despesas.length === 0) {
    return 'Ainda não há despesas registradas para gerar insights.';
  }

  const totalPorCategoria = {};
  let totalGeral = 0;

  despesas.forEach(t => {
    const cat = t.categoria || 'Outros';
    totalPorCategoria[cat] = (totalPorCategoria[cat] || 0) + t.valor;
    totalGeral += t.valor;
  });

  const categoriasOrdenadas = Object.entries(totalPorCategoria)
    .sort((a, b) => b[1] - a[1]);

  const [categoriaTop, valorTop] = categoriasOrdenadas[0];
  const percentualTop = ((valorTop / totalGeral) * 100).toFixed(0);

  return `Sua maior categoria de gastos é "${categoriaTop}", representando ${percentualTop}% do total gasto (R$ ${valorTop.toFixed(2)} de R$ ${totalGeral.toFixed(2)}).`;
}

// ===== Chat guiado =====

function filtrarPorMesAtual(transacoes) {
  const agora = new Date();
  return transacoes.filter(function (t) {
    const data = new Date(t.date + 'T00:00:00');
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  });
}

function respostaGastoMes(transacoes) {
  const doMes = filtrarPorMesAtual(transacoes).filter(t => t.type === 'expense');
  const total = doMes.reduce((soma, t) => soma + t.amount, 0);
  return `Você gastou R$ ${total.toFixed(2)} esse mês.`;
}

function respostaReceitaMes(transacoes) {
  const doMes = filtrarPorMesAtual(transacoes).filter(t => t.type === 'income');
  const total = doMes.reduce((soma, t) => soma + t.amount, 0);
  return `Você recebeu R$ ${total.toFixed(2)} esse mês.`;
}

function respostaMaiorCategoria(transacoes) {
  const despesas = transacoes.filter(t => t.type === 'expense' && t.categoria);
  if (despesas.length === 0) return 'Ainda não há despesas categorizadas.';

  const totalPorCategoria = {};
  despesas.forEach(t => {
    totalPorCategoria[t.categoria] = (totalPorCategoria[t.categoria] || 0) + t.amount;
  });

  const [categoriaTop, valorTop] = Object.entries(totalPorCategoria).sort((a, b) => b[1] - a[1])[0];
  return `Sua maior categoria de gasto é "${categoriaTop}" (R$ ${valorTop.toFixed(2)}).`;
}

function respostaFechamento(transacoes, rendaBruta) {
  const totalDespesas = transacoes
    .filter(t => t.type === 'expense')
    .reduce((soma, t) => soma + t.amount, 0);

  const diferenca = rendaBruta - totalDespesas;

  if (diferenca >= 0) {
    return `Sim! Vocês contribuíram R$ ${rendaBruta.toFixed(2)} e gastaram R$ ${totalDespesas.toFixed(2)}. Sobrou R$ ${diferenca.toFixed(2)}.`;
  }
  return `Não, faltou R$ ${Math.abs(diferenca).toFixed(2)} — vocês gastaram mais do que contribuíram.`;
}

function respostaContagem(transacoes) {
  return `Você tem ${transacoes.length} transação(ões) registrada(s).`;
}

function respostaRelatorioAnual(transacoes) {
  const agora = new Date();
  const doAno = transacoes.filter(function (t) {
    const data = new Date(t.date + 'T00:00:00');
    return t.type === 'expense' && data.getFullYear() === agora.getFullYear();
  });

  if (doAno.length === 0) {
    return 'Ainda não há despesas registradas esse ano.';
  }

  const totalPorDescricao = {};
  let totalGeral = 0;

  doAno.forEach(t => {
    const chave = t.description.trim().toLowerCase();
    totalPorDescricao[chave] = (totalPorDescricao[chave] || 0) + t.amount;
    totalGeral += t.amount;
  });

  const linhas = Object.entries(totalPorDescricao)
    .sort((a, b) => b[1] - a[1])
    .map(([descricao, valor]) => {
      const pct = ((valor / totalGeral) * 100).toFixed(0);
      return `${descricao}: ${pct}% (R$ ${valor.toFixed(2)})`;
    });

  return `Relatório do ano ${agora.getFullYear()}:\n` + linhas.join('\n');
}

function responderPergunta(chave, transacoes, rendaBruta) {
  switch (chave) {
    case 'maiorCategoria': return respostaMaiorCategoria(transacoes);
    case 'gastoMes': return respostaGastoMes(transacoes);
    case 'receitaMes': return respostaReceitaMes(transacoes);
    case 'fechamento': return respostaFechamento(transacoes, rendaBruta);
    case 'contagem': return respostaContagem(transacoes);
    case 'relatorioAnual': return respostaRelatorioAnual(transacoes);
    default: return 'Pergunta não reconhecida.';
  }
}