import supabase from '../../globals/supabaseClient.js';

const LoginFlowry = {
  async render() {
    localStorage.clear();
    return `
      <main class="login-container">
        <h1 class="login-title">Login</h1>
        <form id="loginForm" class="login-form">
          <label for="email" class="login-label">Email</label>
          <input type="email" id="email" name="email" class="login-input" placeholder="Masukkan email">

          <label for="password" class="login-label">Password</label>
          <input type="password" id="password" name="password" class="login-input" placeholder="Masukkan password">

          <button type="submit" class="login-button">Login</button>
        </form>
        <p class="login-redirect">Belum punya akun? <a href="#/registrasi">Daftar sekarang</a></p>
      </main>
    `;
  },

  async afterRender() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (email === '' || password === '') {
        alert('Email dan password wajib diisi!');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(`Gagal login: ${error.message}`);
        return;
      }

      // Simpan informasi user ke localStorage (opsional)
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('email', data.user.email);

      // Redirect ke halaman utama
      window.location.hash = '#/admin-bouquet';
      window.location.reload();
    });
  },
};

export default LoginFlowry;
