// TRAMA Portal - public/js/register.js v1.7.0
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById('success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.textContent = '';
        successMessageDiv.classList.add('hidden');
        successMessageDiv.textContent = '';

        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        if (password.length < 6) {
            errorMessageDiv.textContent = 'A senha deve ter no mínimo 6 caracteres.';
            errorMessageDiv.classList.remove('hidden');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Falha ao registrar');
            }
            
            form.reset();
            successMessageDiv.textContent = 'Conta criada com sucesso! Você será redirecionado para o login.';
            successMessageDiv.classList.remove('hidden');

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err) {
            errorMessageDiv.textContent = err.message;
            errorMessageDiv.classList.remove('hidden');
        }
    });
});
