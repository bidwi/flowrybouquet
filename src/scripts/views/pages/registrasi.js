import supabase from '../../globals/supabaseClient';

const RegistrasiFlowry = {
  async render() {
    return `
      <main class="register-container">
        <h1 class="register-title">Registrasi</h1>
        <form id="registerForm" class="register-form">
          <label for="email" class="register-label">Email</label>
          <input type="email" id="email" name="email" class="register-input" placeholder="Masukkan email">

          <label for="password" class="register-label">Password</label>
          <input type="password" id="password" name="password" class="register-input" placeholder="Masukkan password">

          <button type="submit" class="register-button">Daftar</button>
        </form>
        <p class="register-redirect">Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </main>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!email || !password) {
        alert('Email dan password wajib diisi!');
        return;
      }

      if (password.length < 8) {
        alert('Password minimal harus 8 karakter!');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(`Gagal daftar: ${error.message}`);
        return;
      }

      alert('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
      window.location.hash = '#/login';
    });
  },
};

export default RegistrasiFlowry;
