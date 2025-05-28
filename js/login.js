document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
      const response = await fetch('http://localhost:3000/login/entrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha }),
        credentials: 'include' 
      });

      const data = await response.json();

        if (!response.ok) {
            alert(data.errors ? data.errors.join('\n') : 'Erro ao fazer login.');
            return;
        }


      window.location.href = '../../views/projeto/home.html';
    } catch (err) {
      console.error('Erro ao tentar fazer login:', err);
      alert('Erro ao conectar com o servidor.');
    }
  });
});
