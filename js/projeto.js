const url = 'http://localhost:3000';

axios.defaults.withCredentials = true;

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

  async function excluirProjeto(id) {
    if (!confirm('Deseja realmente excluir este projeto?')) return;
    try {
      await axios.delete(`${url}/projetos/apagar/${id}`);
      alert('Projeto excluído com sucesso!');
      carregarProjetos();
    } catch (error) {
      alert('Erro ao excluir o projeto: ' + (error.response?.data?.mensagem || error.message));
    }
  }

  function editarProjeto(id) {
    window.location.href = `editar.html?id=${id}`;
  }

  async function carregarProjetos() {
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

        let botoesAcoes = '';
        if (projeto.usuario === usuario.nome) {
          botoesAcoes = `
            <button class="btn btn-primary btn-sm me-2 editar-btn" data-id="${projeto.id}">Editar</button>
            <button class="btn btn-danger btn-sm excluir-btn" data-id="${projeto.id}">Excluir</button>
          `;
        }

        const section = document.createElement('section');
        section.className = 'bg-white p-4 rounded shadow mx-auto mb-4';
        section.style.maxWidth = '700px';
        section.innerHTML = `
          <h2 class="h5 fw-bold mb-3">${projeto.nome}</h2>
          <p><strong>Usuário:</strong> ${projeto.usuario}</p>
          <p><strong>Descrição:</strong> ${projeto.descricao}</p>
          <p><strong>Data de entrega:</strong> ${formatarData(projeto.entrega)}</p>
          <p>
            <strong>Status:</strong>
            <span class="badge ${statusClasse}">${statusTexto}</span>
          </p>
          <div>${botoesAcoes}</div>
        `;

        main.appendChild(section);
      });

      document.querySelectorAll('.excluir-btn').forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          excluirProjeto(id);
        });
      });

      document.querySelectorAll('.editar-btn').forEach(button => {
        button.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          editarProjeto(id);
        });
      });

    } catch (error) {
      alert('Erro ao carregar os projetos: ' + (error.response?.data?.mensagem || error.message));
    }
  }

  function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function timestampParaDataInput(ts) {
    if (!ts) return '';
    if (ts._seconds) {
      const date = new Date(ts._seconds * 1000);
      return date.toISOString().substring(0, 10);
    }
    if (typeof ts === 'string') {
      return ts.substring(0, 10);
    }
    if (ts instanceof Date) {
      return ts.toISOString().substring(0, 10);
    }
    return '';
  }

  async function carregarProjeto(id) {
    try {
      const response = await axios.get(`${url}/projetos/mostrar/${id}`);
      const projeto = response.data.projeto;

      document.getElementById('nome').value = projeto.nome || '';
      document.getElementById('descricao').value = projeto.descricao || '';
      document.getElementById('inicio').value = timestampParaDataInput(projeto.inicio);
      document.getElementById('entrega').value = timestampParaDataInput(projeto.entrega);
      document.getElementById('status').checked = projeto.status === true;
    } catch (error) {
      alert('Erro ao carregar o projeto: ' + (error.response?.data?.mensagem || error.message));
    }
  }

  async function editarProjetoSubmit(event) {
    event.preventDefault();

    const id = getProjectId();
    if (!id) {
      alert('ID do projeto não informado!');
      return;
    }

    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const inicio = document.getElementById('inicio').value;
    const entrega = document.getElementById('entrega').value;
    const status = document.getElementById('status').checked;

    if (!nome || !descricao || !inicio || !entrega) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      await axios.put(`${url}/projetos/editar/${id}`, {
        nome,
        descricao,
        inicio,
        entrega,
        status,
        usuario: usuario.nome

      });
      alert('Projeto atualizado com sucesso!');
      window.location.href = 'home.html';
    } catch (error) {
      alert('Erro ao atualizar projeto: ' + (error.response?.data?.mensagem || error.message));
    }
  }

  const formProjeto = document.getElementById('formProjeto');
  if (formProjeto) {
    formProjeto.addEventListener('submit', async function (event) {
      event.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const descricao = document.getElementById('descricao').value.trim();
      const inicio = document.getElementById('inicio').value;
      const entrega = document.getElementById('entrega').value;
      const status = document.getElementById('status').checked;

      if (!nome || !descricao || !inicio || !entrega) {
        alert('Preencha todos os campos.');
        return;
      }

      try {
        await axios.post(`${url}/projetos/criar`, {
          nome,
          descricao,
          inicio,
          entrega,
          status,
          usuario: usuario.nome
        });
        alert('Projeto criado com sucesso!');
        window.location.href = 'home.html';
      } catch (error) {
        alert('Erro ao criar projeto: ' + (error.response?.data?.mensagem || error.message));
      }
    });
  }

  if (window.location.pathname.endsWith('editar.html')) {
    const id = getProjectId();
    if (!id) {
      alert('ID do projeto não informado na URL.');
      window.location.href = 'home.html';
      return;
    }
    carregarProjeto(id);

    const formEditar = document.getElementById('formEditarProjeto');
    if (formEditar) {
      formEditar.addEventListener('submit', editarProjetoSubmit);
    }
  }

  if (window.location.pathname.endsWith('home.html')) {
    carregarProjetos();
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
