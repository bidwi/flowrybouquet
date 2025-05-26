import supabase from '../../globals/supabaseClient';

const FeedbackPage = {
  async render() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.hash = '#/login';
      return '';
    }

    return `
      <main class="feedback-page" style="margin: 2rem;">
        <h2 style="color: #4D869C; font-weight: bold;">Data Buket</h2>
        
        <button id="tambah-btn" style="margin: 1rem 0; padding: 0.5rem 1rem; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
          Tambah Data
        </button>

        <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; margin-top: 1rem;">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th>ID</th>
              <th>Nama Buket</th>
              <th>Gambar</th>
              <th>Varian</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="feedback-table-body"></tbody>
        </table>

        <button id="logout-btn" style="margin-top: 1.5rem; padding: 0.5rem 1rem; background-color: #ff4d4d; color: white; border: none; cursor: pointer;">
          Logout
        </button>

        <!-- Modal -->
        <div id="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5);">
          <div style="background:white; padding:2rem; margin:5% auto; width:400px; border-radius:8px;">
            <h3 id="modal-title">Tambah Data Buket</h3>
            <form id="form-tambah">
              <input type="hidden" id="edit-id">
              <label>Nama Buket:</label><br>
              <input type="text" id="flower" required style="width:100%"><br><br>

              <label>Varian:</label><br>
              <input type="text" id="varian" required style="width:100%"><br><br>

              <label>Harga:</label><br>
              <input type="number" id="harga" required style="width:100%"><br><br>

              <label>Deskripsi:</label><br>
              <textarea id="deskripsi" required style="width:100%"></textarea><br><br>

              <label>Gambar:</label><br>
              <input type="file" id="gambar" accept="image/*"><br><br>

              <button type="submit" style="padding:0.5rem 1rem;">Simpan</button>
              <button type="button" id="close-modal" style="margin-left:1rem;">Batal</button>
            </form>
          </div>
        </div>
      </main>
    `;
  },

  async afterRender() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const modal = document.getElementById('modal');
    const tambahBtn = document.getElementById('tambah-btn');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');

    const form = document.getElementById('form-tambah');
    const flowerInput = document.getElementById('flower');
    const varianInput = document.getElementById('varian');
    const hargaInput = document.getElementById('harga');
    const deskripsiInput = document.getElementById('deskripsi');
    const gambarInput = document.getElementById('gambar');
    const editIdInput = document.getElementById('edit-id');

    const openModal = (editData = null) => {
      form.reset();
      gambarInput.value = ''; // reset file input secara manual
      if (editData) {
        modalTitle.innerText = 'Edit Data Buket';
        flowerInput.value = editData.flower;
        varianInput.value = editData.varian;
        hargaInput.value = editData.harga;
        deskripsiInput.value = editData.deskripsi;
        editIdInput.value = editData.id;
      } else {
        modalTitle.innerText = 'Tambah Data Buket';
        editIdInput.value = '';
      }
      modal.style.display = 'block';
    };

    tambahBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => (modal.style.display = 'none'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const flower = flowerInput.value.trim();
      const varian = varianInput.value.trim();
      const harga = parseFloat(hargaInput.value);
      const deskripsi = deskripsiInput.value.trim();
      const gambarFile = gambarInput.files[0];
      const editId = editIdInput.value;

      let photo_url = null;

      if (gambarFile) {
        const fileName = `${Date.now()}-${flower.replace(/\s+/g, '-')}`;
        const { error: uploadError } = await supabase.storage
          .from('photo')
          .upload(fileName, gambarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          alert('Gagal mengupload gambar: ' + uploadError.message);
          return;
        }

        photo_url = `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/photo/${fileName}`;
      }

      if (editId) {
        const updateData = { flower, varian, harga, deskripsi };
        if (photo_url) updateData.photo_url = photo_url;

        const { error } = await supabase
          .from('flowry')
          .update(updateData)
          .eq('id', editId);
        if (error) {
          alert('Gagal mengedit data: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('flowry')
          .insert([{ flower, varian, harga, deskripsi, photo_url }]);
        if (error) {
          alert('Gagal menyimpan data: ' + error.message);
          return;
        }
      }

      modal.style.display = 'none';
      window.location.reload();
    });

    document
      .getElementById('logout-btn')
      ?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.hash = '#/login';
      });

    const { data: feedbacks, error } = await supabase
      .from('flowry')
      .select('*');
    const tableBody = document.getElementById('feedback-table-body');
    if (!tableBody) return;

    if (error || feedbacks.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data buket.</td></tr>`;
    } else {
      tableBody.innerHTML = feedbacks
        .map(
          (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.flower}</td>
          <td>
            ${
              item.photo_url
                ? `<img src="${item.photo_url}" style="max-width:80px; max-height:80px;" alt="${item.flower}" />`
                : 'Tidak ada gambar'
            }
          </td>
          <td>${item.varian}</td>
          <td>${item.harga}</td>
          <td>${item.deskripsi}</td>
          <td>
            <button class="edit-btn" data-id="${item.id}">Edit</button>
            <button class="delete-btn" data-id="${item.id}">Hapus</button>
          </td>
        </tr>
      `
        )
        .join('');

      document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const { data } = await supabase
            .from('flowry')
            .select('*')
            .eq('id', id)
            .single();
          openModal(data);
        });
      });

      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const confirmDelete = confirm(
            `Yakin ingin menghapus data dengan ID: ${id}?`
          );
          if (!confirmDelete) return;

          const { error } = await supabase.from('flowry').delete().eq('id', id);
          if (error) {
            alert('Gagal menghapus: ' + error.message);
          } else {
            window.location.reload();
          }
        });
      });
    }
  },
};

export default FeedbackPage;
