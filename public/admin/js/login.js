// public/admin/js/login.js v1.1.1 (Revisão de armazenamento de token)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/auth/login/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // O servidor de admin DEVE retornar o token no corpo da resposta
                // (além de configurá-lo no cookie) para que o dashboard.js possa usá-lo no header.
                // Se o seu backend foi corrigido para retornar o token no JSON, esta linha está correta:
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                
                window.location.href = '/dashboard/admin';
            } else {
                errorMessage.textContent = data.message || 'Erro ao fazer login.';
            }
        } catch (error) {
            errorMessage.textContent = 'Não foi possível conectar ao servidor.';
            console.error('Erro de conexão:', error);
        }
    });
});
