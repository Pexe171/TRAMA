// public/admin/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Se o login for bem-sucedido e o usuário for admin, redireciona
                if (data.role === 'admin') {
                    window.location.href = '/dashboard/admin';
                } else {
                    errorMessage.textContent = 'Acesso negado. Apenas administradores.';
                }
            } else {
                errorMessage.textContent = data.message || 'Erro ao fazer login.';
            }
        } catch (error) {
            errorMessage.textContent = 'Não foi possível conectar ao servidor.';
        }
    });
});
