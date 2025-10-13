// TRAMA Portal - public/js/login.js v1.7.1
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.textContent = '';

        const email = form.email.value;
        const password = form.password.value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Falha no login');
            }
            
            // Armazena o token no localStorage para ser usado em outras partes do app
            localStorage.setItem('token', data.token);

            // Redireciona para a home, a verificação de auth no main.js vai tratar o resto
            window.location.href = '/';


        } catch (err) {
            errorMessageDiv.textContent = err.message;
            errorMessageDiv.classList.remove('hidden');
        }
    });
});
