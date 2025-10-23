async function fetchFeatures() {
  const res = await fetch('/api/features');
  if (!res.ok) throw new Error('Falha ao buscar features');
  return res.json();
}

function renderFeatures(list) {
  const container = document.getElementById('features-list');
  container.innerHTML = '';
  list.forEach(item => {
    const el = document.createElement('article');
    el.className = 'feature';
    el.innerHTML = `
      <h3>${item.Categoria}</h3>
      <p><strong>Funcionalidades:</strong> ${item['Funcionalidades Principais']}</p>
      <p><strong>Tecnologia base:</strong> ${item['Tecnologia Base']}</p>
      <p><strong>Benefícios:</strong> ${item['Benefícios para o Instituto']}</p>
    `;
    container.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const features = await fetchFeatures();
    renderFeatures(features);
  } catch (e) {
    document.getElementById('features-list').textContent = 'Erro ao carregar features.';
    console.error(e);
  }

  const form = document.getElementById('report-form');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const status = document.getElementById('report-status');
    status.textContent = 'Enviando...';
    const data = new FormData(form);

    try {
      const res = await fetch('/api/report', { method: 'POST', body: data });
      if (!res.ok) throw new Error('Falha no servidor');
      const json = await res.json();
      status.textContent = 'Denúncia enviada (id: ' + json.report_id + ')';
      form.reset();
    } catch (err) {
      status.textContent = 'Erro ao enviar denúncia.';
      console.error(err);
    }
  });
});
