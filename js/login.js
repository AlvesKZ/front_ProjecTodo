const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      axios.post(`${url}/login/registrar`, { nome, email, senha })
        .then(response => {
          alert('Usuário registrado com sucesso!');
          window.location.href = 'entrar.html';
        })
        .catch(error => {
          alert('Erro ao registrar usuário: ' + (error.response?.data?.mensagem || error.message));
        });
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      axios.post(`${url}/login/entrar`, { email, senha })
        .then(response => {
          const usuario = response.data.usuario; 

          localStorage.setItem('usuario', JSON.stringify(usuario)); 
          alert('Login realizado com sucesso!');
          window.location.href = '../projeto/home.html';
        })
        .catch(error => {
          alert('Erro ao fazer login: ' + (error.response?.data?.mensagem || error.message));
        });
    });
  }
});
