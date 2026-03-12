/* ============================================================
   modules/auth.js — GOLAZO STORE
   Autenticación, perfil de usuario, contacto
   ============================================================ */

import { APP, saveUser } from '../state/app.js';
import { isValidEmail } from './utils.js';
import { showPage, showToast } from './ui.js';
import { updateCartBadge } from './cart.js';

/* ── Autenticación ───────────────────────────────────────── */

export function initAuth() {
  // Tabs login / registro
  document.getElementById('tabLogin')   ?.addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('tabRegister')?.addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('goRegister') ?.addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('goLogin')    ?.addEventListener('click', () => switchAuthTab('login'));

  // Mostrar / ocultar contraseña
  document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type  = input.type === 'password' ? 'text' : 'password';
      btn.textContent = input.type === 'password' ? '👁' : '🙈';
    });
  });

  // Formularios
  document.getElementById('formLogin')   ?.addEventListener('submit', handleLogin);
  document.getElementById('formRegister')?.addEventListener('submit', handleRegister);
}

function switchAuthTab(tab) {
  document.getElementById('tabLogin')   ?.classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister')?.classList.toggle('active', tab === 'register');
  document.getElementById('formLogin')  ?.classList.toggle('active', tab === 'login');
  document.getElementById('formRegister')?.classList.toggle('active', tab === 'register');
}

export function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  clearAuthError('loginEmail', 'loginEmailErr');
  clearAuthError('loginPass',  'loginPassErr');

  let valid = true;
  if (!isValidEmail(email)) { showAuthError('loginEmail', 'loginEmailErr', 'Ingresa un correo válido'); valid = false; }
  if (pass.length < 6)      { showAuthError('loginPass',  'loginPassErr',  'Mínimo 6 caracteres');     valid = false; }
  if (!valid) return;

  const stored = JSON.parse(localStorage.getItem('golazo_users') || '[]');
  const user   = stored.find(u => u.email === email && u.pass === pass);
  const demo   = (email === 'demo@golazo.co' && pass === '123456');

  if (user || demo) {
    APP.user = user || { nombre: 'Usuario Demo', apellido: '', email, tel: '', ciudad: '' };
    saveUser();
    updateUserUI();
    showAuthAlert('loginAlert', `¡Bienvenido de nuevo, ${APP.user.nombre || 'Usuario'}! 🎉`, 'success');
    setTimeout(() => showPage('home'), 1200);
  } else {
    showAuthAlert('loginAlert', 'Correo o contraseña incorrectos.', 'error');
  }
}

export function handleRegister(e) {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value.trim();
  const email  = document.getElementById('regEmail').value.trim();
  const pass   = document.getElementById('regPass').value;
  const pass2  = document.getElementById('regPass2').value;
  const terms  = document.getElementById('regTerms').checked;

  clearAuthError('regNombre', 'regNombreErr');
  clearAuthError('regEmail',  'regEmailErr');
  clearAuthError('regPass',   'regPassErr');
  clearAuthError('regPass2',  'regPass2Err');

  let valid = true;
  if (!nombre)              { showAuthError('regNombre', 'regNombreErr', 'El nombre es requerido');         valid = false; }
  if (!isValidEmail(email)) { showAuthError('regEmail',  'regEmailErr',  'Ingresa un correo válido');       valid = false; }
  if (pass.length < 6)      { showAuthError('regPass',   'regPassErr',   'Mínimo 6 caracteres');            valid = false; }
  if (pass !== pass2)       { showAuthError('regPass2',  'regPass2Err',  'Las contraseñas no coinciden');   valid = false; }
  if (!terms) { showAuthAlert('regAlert', 'Debes aceptar los términos y condiciones.', 'error'); return; }
  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('golazo_users') || '[]');
  if (users.find(u => u.email === email)) {
    showAuthAlert('regAlert', 'Este correo ya está registrado.', 'error');
    return;
  }

  const newUser = {
    nombre,
    apellido: document.getElementById('regApellido')?.value.trim() || '',
    email, pass, tel: '', ciudad: '',
  };
  users.push(newUser);
  localStorage.setItem('golazo_users', JSON.stringify(users));

  APP.user = newUser;
  saveUser();
  updateUserUI();
  showAuthAlert('regAlert', '¡Cuenta creada con éxito! Bienvenido a GOLAZO. 🎉', 'success');
  setTimeout(() => showPage('home'), 1500);
}

/* ── Perfil de Usuario ───────────────────────────────────── */

export function loadProfileData() {
  if (!APP.user) return;
  const u = APP.user;

  // Avatar y datos del sidebar
  const avatar  = document.getElementById('profileAvatar');
  const nameEl  = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  if (avatar)  avatar.textContent  = (u.nombre || 'U').charAt(0).toUpperCase();
  if (nameEl)  nameEl.textContent  = `${u.nombre || ''} ${u.apellido || ''}`.trim() || 'Usuario';
  if (emailEl) emailEl.textContent = u.email || '';

  // Formulario de datos
  const fields = {
    profNombre: 'nombre', profApellido: 'apellido',
    profEmail:  'email',  profTel: 'tel', profCiudad: 'ciudad',
  };
  Object.entries(fields).forEach(([inputId, key]) => {
    const el = document.getElementById(inputId);
    if (el) el.value = u[key] || '';
  });

  // Tabs del perfil
  document.querySelectorAll('.profile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });

  // Guardar perfil
  document.getElementById('profileForm')?.addEventListener('submit', saveProfileData);

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}

function saveProfileData(e) {
  e.preventDefault();
  APP.user.nombre   = document.getElementById('profNombre')?.value.trim()   || '';
  APP.user.apellido = document.getElementById('profApellido')?.value.trim() || '';
  APP.user.email    = document.getElementById('profEmail')?.value.trim()    || '';
  APP.user.tel      = document.getElementById('profTel')?.value.trim()      || '';
  APP.user.ciudad   = document.getElementById('profCiudad')?.value.trim()   || '';
  saveUser();

  const users = JSON.parse(localStorage.getItem('golazo_users') || '[]');
  const idx   = users.findIndex(u => u.email === APP.user.email);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...APP.user };
    localStorage.setItem('golazo_users', JSON.stringify(users));
  }

  updateUserUI();
  loadProfileData();
  const successEl = document.getElementById('profileSuccess');
  if (successEl) {
    successEl.classList.remove('hidden');
    setTimeout(() => successEl.classList.add('hidden'), 3000);
  }
  showToast('Perfil actualizado correctamente ✓', 'success');
}

export function handleLogout() {
  APP.user = null;
  saveUser();
  updateUserUI();
  showToast('Sesión cerrada. ¡Hasta pronto!', 'info');
  showPage('home');
}

/** Actualiza el label del botón de usuario en el navbar */
export function updateUserUI() {
  const userLabel = document.getElementById('userLabel');
  const userBtn   = document.getElementById('userBtn');
  if (APP.user) {
    if (userLabel) userLabel.textContent = APP.user.nombre || 'Perfil';
    if (userBtn)   userBtn.dataset.page  = 'profile';
  } else {
    if (userLabel) userLabel.textContent = 'Entrar';
    if (userBtn)   userBtn.dataset.page  = 'login';
  }
}

/* ── Contacto ────────────────────────────────────────────── */

export function initContact() {
  document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('ctxNombre')?.value.trim();
    const email  = document.getElementById('ctxEmail')?.value.trim();
    const msg    = document.getElementById('ctxMsg')?.value.trim();

    if (!nombre || !email || !msg) {
      showAuthAlert('contactSuccess', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showAuthAlert('contactSuccess', 'Ingresa un correo válido.', 'error');
      return;
    }

    showAuthAlert('contactSuccess', '✓ ¡Mensaje enviado! Te responderemos en menos de 24 horas.', 'success');
    this.reset();
  });
}

/* ── Helpers de UI para formularios ─────────────────────── */

function showAuthError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  input?.closest('.field-group')?.classList.add('has-error');
  if (err) err.textContent = msg;
}

function clearAuthError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  input?.closest('.field-group')?.classList.remove('has-error');
  if (err) err.textContent = '';
}

function showAuthAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className   = `auth-alert ${type}`;
  el.classList.remove('hidden');
}
