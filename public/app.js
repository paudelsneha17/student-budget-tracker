const money = n => '$' + n.toFixed(2);

async function loadCategories() {
  const res = await fetch('/api/categories');
  const cats = await res.json();
  document.getElementById('category').innerHTML =
    cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

async function refresh() {
  const [txRes, sumRes] = await Promise.all([fetch('/api/transactions'), fetch('/api/summary')]);
  const transactions = await txRes.json();
  const summary = await sumRes.json();

  document.getElementById('income').textContent = money(summary.income);
  document.getElementById('expenses').textContent = money(summary.expenses);
  document.getElementById('balance').textContent = money(summary.balance);

  const list = document.getElementById('list');
  list.innerHTML = '';
  transactions.slice().reverse().forEach(t => {
    const row = document.createElement('tr');
    const sign = t.type === 'income' ? '+' : '-';
    row.innerHTML = `<td>${t.date}</td><td></td><td>${t.category}</td>
      <td class="right ${t.type === 'income' ? 'pos' : 'neg'}">${sign}${money(t.amount)}</td>
      <td><button class="del" title="Delete">✕</button></td>`;
    row.children[1].textContent = t.description;
    row.querySelector('.del').onclick = async () => {
      await fetch('/api/transactions/' + t.id, { method: 'DELETE' });
      refresh();
    };
    list.appendChild(row);
  });
  document.getElementById('empty').style.display = transactions.length ? 'none' : 'block';

  const cats = Object.entries(summary.byCategory);
  const max = Math.max(...cats.map(c => c[1]), 1);
  document.getElementById('categories').innerHTML = cats.length
    ? cats.map(([name, amt]) => `<div class="bar"><span class="label">${name}</span>
        <div class="track"><div class="fill" style="width:${(amt / max) * 100}%"></div></div>
        <span>${money(amt)}</span></div>`).join('')
    : '<p class="muted">No expenses yet.</p>';
}

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value || undefined
  };
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const err = document.getElementById('error');
  if (!res.ok) {
    err.textContent = (await res.json()).error;
    return;
  }
  err.textContent = '';
  e.target.reset();
  refresh();
});

loadCategories().then(refresh);
