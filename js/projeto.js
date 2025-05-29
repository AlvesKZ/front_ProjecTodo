const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async function () {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    alert('Usuário não autenticado!');
    window.location.href = '../login/entrar.html';
    return;
  }

  const nomeEl = document.getElementById('usuario-nome');
  const idEl = document.getElementById('usuario-id');

  if (nomeEl) nomeEl.textContent = usuario.nome.toUpperCase();
  if (idEl) idEl.textContent = usuario.id;

  const formatarData = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'Não definida';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('pt-BR');
  };

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
      const statusTexto = projeto.status ? 'Finalizado' : 'Pendente';
      const statusClasse = projeto.status ? 'bg-success' : 'bg-warning text-dark';

      const section = document.createElement('section');
      section.className = 'bg-white p-4 rounded shadow mx-auto mb-4';
      section.style.maxWidth = '700px';
      section.innerHTML = `
        <h2 class="h5 fw-bold mb-3">${projeto.nome}</h2>
        <p><strong>Usuário responsável:</strong> ${projeto.usuario}</p>
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        <p><strong>Data de entrega:</strong> ${formatarData(projeto.entrega)}</p>
        <p>
          <strong>Status:</strong>
          <span class="badge ${statusClasse}">${statusTexto}</span>
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

  const formProjeto = document.getElementById('formProjeto');
  if (formProjeto) {
    formProjeto.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const descricao = document.getElementById('descricao').value.trim();
      const inicio = document.getElementById('inicio').value;
      const entrega = document.getElementById('entrega').value;
      const status = document.getElementById('status').checked;

      if (!nome || !descricao || !inicio || !entrega) {
        alert('Preencha todos os campos.');
        return;
      }

      const projeto = {
        nome,
        descricao,
        inicio,
        entrega,
        status,
        usuario: usuario.nome,
        usuarioId: usuario.id
      };

      try {
        const res = await axios.post(`${url}/projetos/criar`, projeto);
        alert('Projeto criado com sucesso!');
        window.location.href = 'home.html'; 
      } catch (err) {
        console.error(err);
        alert('Erro ao criar o projeto: ' + (err.response?.data?.mensagem || err.message));
      }
    });
  }
});
