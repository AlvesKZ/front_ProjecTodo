const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async function () {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    alert('Usuário não autenticado!');
    window.location.href = '../login/entrar.html';
    return;
  }

  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.innerHTML = `${usuario.nome} (ID: ${usuario.id})`;
  }

  try {
    const response = await axios.get(`${url}/projetos/index`);
    const projetos = response.data.projetos; 

    const main = document.querySelector('main');
    main.innerHTML = ''; 

    if (!projetos || projetos.length === 0) {
      main.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
      return;
    }

    projetos.forEach(projeto => {
      const section = document.createElement('section');
      section.className = 'bg-white p-4 rounded shadow mx-auto mb-4';
      section.style.maxWidth = '700px';
      section.innerHTML = `
        <h2 class="h5 fw-bold mb-3">${projeto.nome}</h2>
        <p><strong>Usuário responsável:</strong> ${usuario.nome}</p>
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        <p><strong>Data de entrega:</strong> ${projeto.data_entrega || 'Não definida'}</p>
        <p>
          <strong>Status:</strong>
          <span class="badge ${projeto.status === 'Finalizado' ? 'bg-success' : 'bg-warning'}">
            ${projeto.status}
          </span>
        </p>
      `;
      main.appendChild(section);
    });
  } catch (error) {
    alert('Erro ao carregar os projetos: ' + (error.response?.data?.mensagem || error.message));
  }

  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      try {
        await axios.get(`${url}/login/sair`);
        localStorage.removeItem('usuario');
        window.location.href = '../login/entrar.html';
      } catch (err) {
        alert('Erro ao sair da conta.');
      }
    });
  }
});
