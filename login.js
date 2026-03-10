const form = document.getElementById('login-form');
const statusElement = document.getElementById('login-status');
const submitButton = document.getElementById('login-submit');

const setStatus = (message, type = '') => {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.className = `login-status${type ? ` is-${type}` : ''}`;
};

const redirectToAdmin = () => {
  window.location.replace('admin.html');
};

const checkExistingSession = async () => {
  try {
    const response = await fetch('/api/auth/session', { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.authenticated) redirectToAdmin();
  } catch (error) {
    console.error(error);
    setStatus('No se pudo conectar con el servidor. Abre la web desde http://localhost:3000/login.html.', 'error');
  }
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('login-username')?.value?.trim() || '';
  const password = document.getElementById('login-password')?.value || '';

  if (!username || !password) {
    setStatus('Debes completar usuario y contrasena.', 'error');
    return;
  }

  try {
    submitButton.disabled = true;
    setStatus('Validando acceso...');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(payload.error || 'No se pudo iniciar sesion.', 'error');
      submitButton.disabled = false;
      return;
    }

    setStatus('Acceso correcto. Redirigiendo...', 'success');
    window.setTimeout(redirectToAdmin, 250);
  } catch (error) {
    console.error(error);
    setStatus('Error al conectar con el servidor. Abre la web desde http://localhost:3000/login.html.', 'error');
    submitButton.disabled = false;
  }
});

checkExistingSession();