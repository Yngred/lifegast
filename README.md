# LifeGast 

Aplicação web simples para controle de gastos pessoais, feita com HTML, CSS e JavaScript puro — sem frameworks, sem build tools, rodando direto no navegador.

## Funcionalidades

- Cadastro de transações (receitas e despesas)
- Cadastro de membros que contribuem com a renda (uso individual ou compartilhado)
- Dashboard com saldo, receitas, despesas e renda bruta
- Comparação entre o que foi contribuído e o que foi gasto
- Dados salvos no `localStorage` do navegador (sem backend)

##  IA no LifeGast

O LifeGast conta com um módulo de Inteligência Artificial que roda **100% local no navegador**, sem enviar nenhum dado para servidores externos e sem precisar de chave de API.

### Como funciona

- **Categorização automática de gastos**: ao cadastrar uma despesa, o modelo de IA analisa a descrição digitada (ex: "Mercado", "Uber") e classifica automaticamente em uma categoria (Alimentação, Transporte, Moradia, etc), usando *zero-shot classification*.
- **Chat guiado**: uma interface de chat permite consultar informações sobre os gastos (maior categoria, total do mês, relatório anual por descrição, entre outras) através de perguntas pré-definidas, calculadas em tempo real sobre os dados salvos localmente.

### Tecnologia

- **[Transformers.js](https://github.com/xenova/transformers.js)**: biblioteca que roda modelos de machine learning diretamente no navegador (via WebAssembly), sem backend.
- **Modelo**: `Xenova/distilbert-base-uncased-mnli`, usado para classificação zero-shot das transações.
- Todo o processamento acontece no dispositivo do usuário — privacidade por design.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript 
- Transformers.js (IA local no navegador)
- localStorage

## Como rodar

1. Clona o repositório
2. Abre o `index.html` no navegador (recomendado usar uma extensão tipo Live Server)