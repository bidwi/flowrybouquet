import supabase from '../../globals/supabaseClient';

const AdminBouquet = {
  async render() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.hash = '#/login';
      return '';
    }

    return `
      <main class="bouquet-page">
        <div class="bouquet-header">
          <h2 class="bouquet-title">Data Buket</h2>
          <a class="bouquet-feedback-link" id="bouquet-feedback-link">/ Data feedback</a>
        </div>
        
        <button id="tambah-btn" class="bouquet-tambah-btn">
          Tambah Data
        </button>

        <div class="bouquet-search-row">
          <input type="text" id="bouquet-search" class="bouquet-search-input" placeholder="Cari buket...">
          <button id="bouquet-search-btn" class="bouquet-search-btn">Cari</button>
        </div>

        <table class="bouquet-table">
          <thead>
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
          <tbody id="bouquet-table-body"></tbody>
        </table>

        <button id="logout-btn" class="bouquet-logout-btn">
          Logout
        </button>

        <!-- Modal -->
        <div id="modal" class="bouquet-modal">
          <div class="bouquet-modal-content" id="modal-content">
            <h3 id="modal-title">Tambah Data Buket</h3>
            <form id="form-tambah">
              <input type="hidden" id="edit-id">
              <input type="hidden" id="old-flower">

              <label>Nama Buket:</label>
              <input type="text" id="flower" required class="bouquet-input">

              <label>Varian:</label>
              <input type="text" id="varian" required class="bouquet-input">

              <label>Harga:</label>
              <input type="number" id="harga" required class="bouquet-input">

              <label>Deskripsi:</label>
              <textarea id="deskripsi" required class="bouquet-input bouquet-textarea"></textarea>

              <label>Gambar:</label>
              <div class="bouquet-file-preview-row">
                <input type="file" id="gambar" accept="image/*" class="bouquet-input" style="margin-bottom:0;">
                <img id="preview-gambar" src="" class="bouquet-preview-gambar" style="display:none;">
              </div>

              <div style="margin-top: 1rem;">
                <button type="submit" class="bouquet-submit-btn">Simpan</button>
                <button type="button" id="close-modal" class="bouquet-cancel-btn">Batal</button>
              </div>
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

    // Feedback link
    const feedbackLink = document.getElementById('bouquet-feedback-link');
    feedbackLink?.addEventListener('click', () => {
      window.location.hash = '#/admin-feedback';
    });

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

    const getImageUrl = (flower, varian) => {
      // Gunakan nama file: nama-buket-varian (agar unik per varian)
      return `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/${bucketName}/${flower
        .replace(/\s+/g, '-')
        .toLowerCase()}-${varian.replace(/\s+/g, '-').toLowerCase()}`;
    };

    const openModal = async (editData = null) => {
      if (
        !modal ||
        !modalTitle ||
        !form ||
        !flowerInput ||
        !varianInput ||
        !hargaInput ||
        !deskripsiInput ||
        !editIdInput ||
        !oldFlowerInput ||
        !previewGambar
      )
        return;

      if (editData) {
        modalTitle.innerText = 'Edit Data Buket';
        flowerInput.value = editData.flower;
        varianInput.value = editData.varian;
        hargaInput.value = editData.harga;
        deskripsiInput.value = editData.deskripsi;
        editIdInput.value = editData.id;
        oldFlowerInput.value = editData.flower;

        // Coba download gambar dan preview (jika ada)
        const filePath = `${editData.flower
          .replace(/\s+/g, '-')
          .toLowerCase()}-${editData.varian
          .replace(/\s+/g, '-')
          .toLowerCase()}`;
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
      modal.style.display = 'flex';
    };

    if (tambahBtn) tambahBtn.addEventListener('click', () => openModal());
    if (closeModal)
      closeModal.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });

    // Close modal when clicking outside modal-content
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }

    if (gambarInput) {
      gambarInput.addEventListener('change', () => {
        const file = gambarInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (previewGambar) {
              previewGambar.src = e.target.result;
              previewGambar.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        } else if (previewGambar) {
          previewGambar.src = '';
          previewGambar.style.display = 'none';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const flower = flowerInput.value.trim();
        const varian = varianInput.value.trim();
        const harga = parseFloat(hargaInput.value);
        const deskripsi = deskripsiInput.value.trim();
        const gambarFile = gambarInput.files[0];
        const editId = editIdInput.value;
        const oldFlower = oldFlowerInput.value;

        // Tambah validasi gambar wajib diisi saat tambah data
        if (!editId && !gambarFile) {
          alert('Gambar wajib diisi!');
          gambarInput.focus();
          return;
        }

        // Cek duplikasi nama + varian (hanya saat tambah, bukan edit)
        if (!editId) {
          const { data: existing, error: checkError } = await supabase
            .from('flowry')
            .select('id')
            .eq('flower', flower)
            .eq('varian', varian)
            .maybeSingle();
          if (existing) {
            alert('Data buket dengan nama dan varian tersebut sudah ada!');
            return;
          }
        }

        // Nama file gambar: nama-buket-varian
        const newFileName = `${flower
          .replace(/\s+/g, '-')
          .toLowerCase()}-${varian.replace(/\s+/g, '-').toLowerCase()}`;
        const oldFileName = editId
          ? `${oldFlower.replace(/\s+/g, '-').toLowerCase()}-${varianInput.value
              .trim()
              .replace(/\s+/g, '-')
              .toLowerCase()}`
          : '';

        // Jika edit dan nama buket/varian berubah, rename gambar di storage
        if (editId) {
          if (oldFlower !== flower || oldFileName !== newFileName) {
            // Download file lama
            const { data: oldBlob, error: downloadError } =
              await supabase.storage.from(bucketName).download(oldFileName);

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
    }

    // Fetch data awal
    const { data: bouquets } = await supabase.from('flowry').select('*');
    const tableBody = document.getElementById('bouquet-table-body');
    const searchInput = document.getElementById('bouquet-search');
    const searchBtn = document.getElementById('bouquet-search-btn');

    // Helper for Rupiah formatting
    const formatRupiah = (angka) => {
      return 'Rp' + angka.toLocaleString('id-ID');
    };

    // Render function untuk tabel, menerima array data dan keyword search
    function renderTable(filteredBouquets, keyword = '') {
      if (!tableBody) return;
      if (!filteredBouquets || filteredBouquets.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data buket.</td></tr>`;
        return;
      }
      tableBody.innerHTML = filteredBouquets
        .map((item, idx) => {
          const imageUrl = getImageUrl(item.flower, item.varian);
          let deskripsi = item.deskripsi || '';
          let showSeeMore = false;
          let fullDeskripsi = deskripsi;

          // Show all if searching "see more"
          if (
            keyword &&
            'see more'.includes(keyword) &&
            deskripsi.length > 30
          ) {
            // show full
          } else if (deskripsi.length > 30) {
            deskripsi =
              deskripsi.slice(0, 30) +
              `... <span class="see-more" data-idx="${idx}">see more</span>`;
            // eslint-disable-next-line no-unused-vars
            showSeeMore = true;
          }

          return `
            <tr>
              <td>${item.id}</td>
              <td>${item.flower}</td>
              <td>
                <div class="bouquet-img-center">
                  <img src="${imageUrl}" alt="${
            item.flower
          }" class="bouquet-table-img" />
                </div>
              </td>
              <td>${item.varian}</td>
              <td>${formatRupiah(item.harga)}</td>
              <td>
                <span class="bouquet-deskripsi" data-idx="${idx}" data-full="${encodeURIComponent(
            fullDeskripsi
          )}">${deskripsi}</span>
              </td>
              <td>
                <div class="bouquet-action-center">
                  <button class="edit-btn bouquet-action-btn bouquet-edit-btn" data-id="${
                    item.id
                  }">Edit</button>
                  <button class="delete-btn bouquet-action-btn bouquet-delete-btn" data-id="${
                    item.id
                  }" data-flower="${item.flower}">Hapus</button>
                </div>
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
          const varian =
            e.target.closest('tr').querySelector('td:nth-child(4)')
              ?.textContent || '';
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
          const fileName = `${flower
            .replace(/\s+/g, '-')
            .toLowerCase()}-${varian.replace(/\s+/g, '-').toLowerCase()}`;
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

      // See more event
      document.querySelectorAll('.see-more').forEach((el) => {
        // eslint-disable-next-line no-unused-vars
        el.addEventListener('click', (e) => {
          const idx = el.getAttribute('data-idx');
          const span = document.querySelector(
            `.bouquet-deskripsi[data-idx="${idx}"]`
          );
          if (span) {
            span.innerHTML = decodeURIComponent(span.getAttribute('data-full'));
          }
        });
      });
    }

    // Render tabel pertama kali
    renderTable(bouquets);

    // Search as you type or button
    function doSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        renderTable(bouquets);
        return;
      }
      const filtered = bouquets.filter((item) => {
        return (
          (item.flower && item.flower.toLowerCase().includes(keyword)) ||
          (item.varian && item.varian.toLowerCase().includes(keyword)) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(keyword)) ||
          (item.harga && String(item.harga).toLowerCase().includes(keyword)) ||
          (item.id && String(item.id).toLowerCase().includes(keyword)) ||
          (keyword === 'see more' &&
            item.deskripsi &&
            item.deskripsi.length > 20)
        );
      });
      renderTable(filtered, keyword);
    }
    searchInput.addEventListener('input', doSearch);
    searchBtn.addEventListener('click', doSearch);
  },
};

export default AdminBouquet;
