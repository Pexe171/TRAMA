// TRAMA Portal - public/js/login.js v1.7.0
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

            // Se for admin/editor, redireciona para o dashboard
            if (data.role === 'admin' || data.role === 'editor') {
                window.location.href = '/dashboard/admin';
            } else {
                // Se for leitor, redireciona para a home
                window.location.href = '/';
            }

        } catch (err) {
            errorMessageDiv.textContent = err.message;
            errorMessageDiv.classList.remove('hidden');
        }
    });
});
