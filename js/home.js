document.addEventListener('DOMContentLoaded', async () => {
  const usernameEl = document.getElementById('username');
  const mainEl = document.querySelector('main');

  try {
    const usuarioRes = await fetch('http://localhost:3000/projetos/index', {
      method: 'GET',
      credentials: 'include'
    });

    const projetos = await usuarioRes.json();

    if (!usuarioRes.ok) {
      throw new Error(projetos.errors ? projetos.errors.join(', ') : 'Erro ao buscar projetos');
    }

    if (!Array.isArray(projetos) || projetos.length === 0) {
      mainEl.innerHTML = `
        <div class="text-center text-muted">
          <p>Nenhum projeto encontrado.</p>
        </div>
      `;
      return;
    }

    const nomeUsuario = projetos[0].usuario || 'Usuário';
    usernameEl.textContent = nomeUsuario;

    mainEl.innerHTML = '';

    projetos.forEach(projeto => {
      const statusBadge = projeto.status
        ? '<span class="badge bg-success">Finalizado</span>'
        : '<span class="badge bg-warning text-dark">Em andamento</span>';

      const entrega = new Date(projeto.entrega._seconds * 1000).toLocaleDateString('pt-BR');

      const section = document.createElement('section');
      section.className = 'bg-white p-4 rounded shadow mx-auto mb-4';
      section.style.maxWidth = '700px';
      section.innerHTML = `
        <h2 class="h5 fw-bold mb-3">${projeto.nome}</h2>
        <p><strong>ID:</strong> ${projeto.id}</p>
        <p><strong>Usuário responsável:</strong> ${projeto.usuario}</p>
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        <p><strong>Data de entrega:</strong> ${entrega}</p>
        <p><strong>Status:</strong> ${statusBadge}</p>
      `;

      mainEl.appendChild(section);
    });

  } catch (err) {
    console.error('Erro:', err);
    mainEl.innerHTML = `<p class="text-danger">Erro ao carregar os dados.</p>`;
  }
});
