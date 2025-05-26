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
              <input type="hidden" id="old-flower">

              <label>Nama Buket:</label><br>
              <input type="text" id="flower" required style="width:100%"><br><br>

              <label>Varian:</label><br>
              <input type="text" id="varian" required style="width:100%"><br><br>

              <label>Harga:</label><br>
              <input type="number" id="harga" required style="width:100%"><br><br>

              <label>Deskripsi:</label><br>
              <textarea id="deskripsi" required style="width:100%"></textarea><br><br>

              <label>Gambar:</label><br>
              <input type="file" id="gambar" accept="image/*"><br>
              <img id="preview-gambar" src="" style="max-width:100px; max-height:100px; display:none; margin-top:8px;"><br><br>

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

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.hash = '#/login';
    });

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
    const oldFlowerInput = document.getElementById('old-flower');
    const previewGambar = document.getElementById('preview-gambar');

    const bucketName = 'photo';

    const getImageUrl = (flower) => {
      return `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/${bucketName}/${flower
        .replace(/\s+/g, '-')
        .toLowerCase()}`;
    };

    const openModal = async (editData = null) => {
      if (editData) {
        modalTitle.innerText = 'Edit Data Buket';
        flowerInput.value = editData.flower;
        varianInput.value = editData.varian;
        hargaInput.value = editData.harga;
        deskripsiInput.value = editData.deskripsi;
        editIdInput.value = editData.id;
        oldFlowerInput.value = editData.flower;

        // Coba download gambar dan preview (jika ada)
        const filePath = editData.flower.replace(/\s+/g, '-').toLowerCase();
        const { data: blob, error: downloadError } = await supabase.storage
          .from(bucketName)
          .download(filePath);

        if (downloadError) {
          previewGambar.style.display = 'none';
          previewGambar.src = '';
        } else {
          const url = URL.createObjectURL(blob);
          previewGambar.src = url;
          previewGambar.style.display = 'block';
        }
      } else {
        modalTitle.innerText = 'Tambah Data Buket';
        form.reset();
        editIdInput.value = '';
        oldFlowerInput.value = '';
        previewGambar.style.display = 'none';
        previewGambar.src = '';
      }
      modal.style.display = 'block';
    };

    tambahBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => (modal.style.display = 'none'));

    gambarInput.addEventListener('change', () => {
      const file = gambarInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewGambar.src = e.target.result;
          previewGambar.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        previewGambar.src = '';
        previewGambar.style.display = 'none';
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const flower = flowerInput.value.trim();
      const varian = varianInput.value.trim();
      const harga = parseFloat(hargaInput.value);
      const deskripsi = deskripsiInput.value.trim();
      const gambarFile = gambarInput.files[0];
      const editId = editIdInput.value;
      const oldFlower = oldFlowerInput.value;

      const newFileName = flower.replace(/\s+/g, '-').toLowerCase();
      const oldFileName = oldFlower.replace(/\s+/g, '-').toLowerCase();

      // Jika edit dan nama buket berubah, rename gambar di storage
      if (editId) {
        if (oldFlower !== flower) {
          // Rename file di Supabase Storage:
          // Supabase tidak punya rename method, jadi harus copy-download-upload-delete manual

          // Download file lama
          const { data: oldBlob, error: downloadError } = await supabase.storage
            .from(bucketName)
            .download(oldFileName);

          if (!downloadError && oldBlob) {
            // Upload ulang dengan nama baru
            const { error: uploadError } = await supabase.storage
              .from(bucketName)
              .upload(newFileName, oldBlob, { upsert: true });

            if (uploadError) {
              alert('Gagal rename gambar lama: ' + uploadError.message);
              return;
            }

            // Hapus file lama
            const { error: deleteError } = await supabase.storage
              .from(bucketName)
              .remove([oldFileName]);
            if (deleteError) {
              alert('Gagal menghapus gambar lama: ' + deleteError.message);
              return;
            }
          }
        }
      }

      // Upload gambar baru kalau ada file baru
      if (gambarFile) {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(newFileName, gambarFile, { upsert: true });

        if (uploadError) {
          alert('Gagal mengupload gambar: ' + uploadError.message);
          return;
        }
      }

      // Update atau insert data ke table
      if (editId) {
        const { error: updateError } = await supabase
          .from('flowry')
          .update({ flower, varian, harga, deskripsi })
          .eq('id', editId);

        if (updateError) {
          alert('Gagal mengedit data: ' + updateError.message);
          return;
        }
      } else {
        const { error: insertError } = await supabase.from('flowry').insert([
          {
            flower,
            varian,
            harga,
            deskripsi,
          },
        ]);

        if (insertError) {
          alert('Gagal menyimpan data buket: ' + insertError.message);
          return;
        }
      }

      modal.style.display = 'none';
      window.location.reload();
    });

    // Render tabel
    const { data: feedbacks, error } = await supabase
      .from('flowry')
      .select('*');
    const tableBody = document.getElementById('feedback-table-body');

    if (!tableBody) return;

    if (error || feedbacks.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data buket.</td></tr>`;
    } else {
      tableBody.innerHTML = feedbacks
        .map((item) => {
          const imageUrl = getImageUrl(item.flower);
          return `
            <tr>
              <td>${item.id}</td>
              <td>${item.flower}</td>
              <td><img src="${imageUrl}" alt="${item.flower}" style="max-width:80px; max-height:80px;" /></td>
              <td>${item.varian}</td>
              <td>${item.harga}</td>
              <td>${item.deskripsi}</td>
              <td>
                <button class="edit-btn" data-id="${item.id}">Edit</button>
                <button class="delete-btn" data-id="${item.id}" data-flower="${item.flower}">Hapus</button>
              </td>
            </tr>
          `;
        })
        .join('');

      // Edit handler
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

      // Delete handler (hapus data & gambar)
      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const flower = e.target.dataset.flower;
          if (!id) return alert('ID tidak ditemukan!');
          if (!confirm(`Yakin ingin menghapus data dengan ID: ${id}?`)) return;

          // Hapus data di tabel
          const { error: deleteError } = await supabase
            .from('flowry')
            .delete()
            .eq('id', id);
          if (deleteError) {
            alert('Gagal menghapus data: ' + deleteError.message);
            return;
          }

          // Hapus gambar dari storage
          const fileName = flower.replace(/\s+/g, '-').toLowerCase();
          const { error: storageDeleteError } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);

          if (storageDeleteError) {
            alert('Gagal menghapus gambar: ' + storageDeleteError.message);
            return;
          }

          alert('Data dan gambar berhasil dihapus');
          window.location.reload();
        });
      });
    }
  },
};

export default FeedbackPage;
