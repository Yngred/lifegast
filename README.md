# LifeGast 

Aplicação web simples para controle de gastos pessoais, feita com HTML, CSS e JavaScript puro — sem frameworks, sem build tools, rodando direto no navegador.

---


### Controle financeiro

* Cadastro de receitas e despesas.
* Cálculo automático de saldo atual.
* Resumo financeiro com:

  * Saldo total
  * Total de receitas
  * Total de despesas
  * Renda bruta familiar

###  Gerenciamento de transações

* Adição de novas transações.
* Exclusão de transações.
* Histórico das últimas movimentações.
* Armazenamento local utilizando **LocalStorage**.

###  Controle de renda familiar

* Cadastro do nome do usuário.
* Cadastro de membros que contribuem com a renda.
* Soma automática da renda bruta familiar.
* Comparação entre renda disponível e gastos realizados.

### Visualização de dados

* Gráfico de gastos por categoria.
* Gráfico de gastos por mês.
* Atualização automática dos gráficos após cada alteração.

---


### Assistente LifeGast 

O Assistente LifeGast é um chat integrado que responde perguntas pré-definidas sobre os dados financeiros do usuário.

Exemplos:

* Qual minha maior categoria de gasto?
* Quanto gastei este mês?
* Quanto recebi este mês?
* O dinheiro fechou?
* Quantas transações tenho?
* Relatório do ano

**Importante:** diferente da categorização automática, o assistente não utiliza modelos de linguagem. As respostas são geradas através de regras e cálculos realizados diretamente sobre os dados armazenados no navegador.

---

##  Modo Simulação

O botão **"Ver simulação com dados de exemplo"** preenche automaticamente o sistema com transações fictícias.

Esse recurso permite:

* Testar o sistema rapidamente.
* Visualizar os gráficos funcionando.
* Experimentar o assistente.
* Demonstrar o projeto sem precisar cadastrar dados manualmente.

---

## Tutorial Interativo

O LifeGast possui um tour guiado desenvolvido com **Intro.js**.

O tutorial apresenta:

1. Onde cadastrar transações.
2. Como visualizar o resumo financeiro.
3. Como interpretar os gráficos.
4. Como utilizar o Assistente LifeGast.

---

##  Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* LocalStorage
* Chart.js
* Intro.js
* Transformers.js

---

## Objetivo

O LifeGast foi desenvolvido para demonstrar habilidades em desenvolvimento Front-End, manipulação do DOM, armazenamento local, visualização de dados e integração de recursos de Inteligência Artificial diretamente no navegador, sem depender de back-end ou serviços externos.
