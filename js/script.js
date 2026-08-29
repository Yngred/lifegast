// ===== TRANSAÇÕES =====

const addButton = document.getElementById("addTransaction");
const cancelButton = document.getElementById("cancelTransaction");
const form = document.getElementById("transactionForm");
const formEl = document.getElementById("form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const balanceEl = document.getElementById("balance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Guarda o total de despesas calculado, pra usar na comparação com a renda
let totalDespesasAtual = 0;

addButton.addEventListener("click", function () {
    form.style.display = "block";
});

cancelButton.addEventListener("click", function () {
    form.style.display = "none";
});

formEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const newTransaction = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: dateInput.value
    };

    transactions.push(newTransaction);

    salvarTransacoes();
    renderizarTudo();

    formEl.reset();
    form.style.display = "none";
});

function salvarTransacoes() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function apagarTransacao(id) {
    transactions = transactions.filter(function (t) {
        return t.id !== id;
    });

    salvarTransacoes();
    renderizarTudo();
}

function renderizarLista() {
    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>Nenhuma transação cadastrada.</p>";
        return;
    }

    transactionList.innerHTML = "";

    transactions.forEach(function (t) {
        const item = document.createElement("div");
        item.className = "transaction-item";

        const sinal = t.type === "income" ? "+" : "-";
        const cor = t.type === "income" ? "green" : "red";

        item.innerHTML = `
            <span>${t.description} (${t.date})</span>
            <span style="color: ${cor}">${sinal} R$ ${t.amount.toFixed(2)}</span>
            <button onclick="apagarTransacao(${t.id})">🗑️</button>
        `;

        transactionList.appendChild(item);
    });
}

function renderizarResumo() {
    let receitas = 0;
    let despesas = 0;

    transactions.forEach(function (t) {
        if (t.type === "income") {
            receitas += t.amount;
        } else {
            despesas += t.amount;
        }
    });

    const saldo = receitas - despesas;

    balanceEl.textContent = "R$ " + saldo.toFixed(2);
    totalIncomeEl.textContent = "R$ " + receitas.toFixed(2);
    totalExpenseEl.textContent = "R$ " + despesas.toFixed(2);

    totalDespesasAtual = despesas;
}

function renderizarTudo() {
    renderizarLista();
    renderizarResumo();
    renderizarDivisao();
}


// ===== CONFIGURAÇÕES (nome + membros que contribuem com a renda) =====

const navConfig = document.getElementById("navConfig");
const settingsSection = document.getElementById("settingsSection");
const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const addMemberBtn = document.getElementById("addMemberBtn");
const membersList = document.getElementById("membersList");
const userNameInput = document.getElementById("userName");

const greetingEl = document.getElementById("greeting");
const grossIncomeEl = document.getElementById("grossIncome");
const divisionStatusEl = document.getElementById("divisionStatus");
const divisionTextEl = document.getElementById("divisionText");

// settings guarda o nome do usuário e a lista de membros (cada um com o valor que contribui)
let settings = JSON.parse(localStorage.getItem("settings")) || { name: "", members: [] };

navConfig.addEventListener("click", function (event) {
    event.preventDefault();
    userNameInput.value = settings.name;
    renderizarMembros();
    settingsSection.style.display = "block";
});

cancelSettingsBtn.addEventListener("click", function () {
    settingsSection.style.display = "none";
});

addMemberBtn.addEventListener("click", function () {
    settings.members.push({ id: Date.now(), name: "", value: 0 });
    renderizarMembros();
});

function removerMembro(id) {
    settings.members = settings.members.filter(function (m) {
        return m.id !== id;
    });
    renderizarMembros();
}

function renderizarMembros() {
    membersList.innerHTML = "";

    settings.members.forEach(function (m) {
        const row = document.createElement("div");
        row.className = "member-row";
        row.setAttribute("data-id", m.id);

        row.innerHTML = `
            <input type="text" class="member-name" placeholder="Nome" value="${m.name}">
            <input type="number" class="member-value" placeholder="Quanto contribui" step="0.01" value="${m.value}">
            <button type="button" onclick="removerMembro(${m.id})">🗑️</button>
        `;

        membersList.appendChild(row);
    });
}

saveSettingsBtn.addEventListener("click", function () {
    settings.name = userNameInput.value;

    const rows = membersList.querySelectorAll(".member-row");

    settings.members = Array.from(rows).map(function (row) {
        const id = Number(row.getAttribute("data-id"));
        const name = row.querySelector(".member-name").value;
        const value = parseFloat(row.querySelector(".member-value").value) || 0;

        return { id: id, name: name, value: value };
    });

    localStorage.setItem("settings", JSON.stringify(settings));

    renderizarSaudacaoERenda();
    renderizarDivisao();
    settingsSection.style.display = "none";
});

// Atualiza a saudação e o card de Renda bruta
function renderizarSaudacaoERenda() {
    greetingEl.textContent = settings.name ? `Olá, ${settings.name}! 👋` : "Olá! 👋";

    const rendaBruta = calcularRendaBruta();
    grossIncomeEl.textContent = "R$ " + rendaBruta.toFixed(2);
}

function calcularRendaBruta() {
    return settings.members.reduce(function (soma, m) {
        return soma + m.value;
    }, 0);
}

// Compara quanto os membros contribuíram com quanto foi gasto (despesas das transações)
function renderizarDivisao() {
    if (settings.members.length === 0) {
        divisionStatusEl.className = "division-status";
        divisionTextEl.textContent = "Cadastre os membros em Configurações pra ver se o dinheiro fechou.";
        return;
    }

    const rendaBruta = calcularRendaBruta();
    const diferenca = rendaBruta - totalDespesasAtual;

    if (diferenca >= 0) {
        divisionStatusEl.className = "division-status positive";
        divisionTextEl.textContent =
            `Vocês contribuíram R$ ${rendaBruta.toFixed(2)} e gastaram R$ ${totalDespesasAtual.toFixed(2)}. Sobrou R$ ${diferenca.toFixed(2)}.`;
    } else {
        const faltou = Math.abs(diferenca);
        divisionStatusEl.className = "division-status negative";
        divisionTextEl.textContent =
            `Vocês contribuíram R$ ${rendaBruta.toFixed(2)} e gastaram R$ ${totalDespesasAtual.toFixed(2)}. Faltou R$ ${faltou.toFixed(2)} — foi preciso tirar de outros gastos pessoais.`;
    }
}


// ===== INICIALIZAÇÃO =====

renderizarTudo();
renderizarSaudacaoERenda();