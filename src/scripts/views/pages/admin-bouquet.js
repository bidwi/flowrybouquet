import supabase from '../../globals/supabaseClient';

// Ambil allowedEmails dari environment variable
const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

const AdminBouquet = {
  async render() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Cek email user
    if (!session) {
      window.location.hash = '#/login';
      return '';
    }
    const userEmail = session.user?.email;
    if (!allowedEmails.includes(userEmail)) {
      window.location.hash = '#/feedback';
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

        <div class="table-responsive">
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
        </div>

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

              <label>Harga: (tanpa titik, contoh: 75000)</label>
              <input type="number" id="harga" required class="bouquet-input">

              <label>Deskripsi:</label>
              <textarea id="deskripsi" required class="bouquet-input bouquet-textarea"></textarea>

              <label>Gambar:</label>
              <div class="bouquet-file-preview-row">
                <input type="file" id="gambar" accept="image/*" class="bouquet-input" style="margin-bottom:0;">
                <img id="preview-gambar" src="" class="bouquet-preview-gambar" style="display:none;" loading="lazy">
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

    // Cek email user
    const userEmail = session.user?.email;
    if (!allowedEmails.includes(userEmail)) {
      window.location.hash = '#/feedback';
      return;
    }

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

    // Helper untuk membuat nama file unik berdasarkan flower & varian
    const getFileName = (flower, varian) => {
      return `${flower.replace(/\s+/g, '-').toLowerCase()}-${varian
        .replace(/\s+/g, '-')
        .toLowerCase()}`;
    };

    // Helper untuk mendapatkan URL gambar
    const getImageUrl = (flower, varian) => {
      // Tambahkan timestamp agar tidak cache
      return `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/${bucketName}/${getFileName(
        flower,
        varian
      )}?t=${Date.now()}`;
    };

    const openModal = async (editData = null) => {
      if (editData) {
        modalTitle.innerText = 'Edit Data Buket';
        flowerInput.value = editData.flower;
        varianInput.value = editData.varian;
        hargaInput.value = editData.harga;
        deskripsiInput.value = editData.deskripsi;
        editIdInput.value = editData.id;
        oldFlowerInput.value = editData.flower + '||' + editData.varian;

        // Coba download gambar dan preview (jika ada)
        const filePath = getFileName(editData.flower, editData.varian);
        // eslint-disable-next-line no-unused-vars
        const { data: blob, error: downloadError } = await supabase.storage
          .from(bucketName)
          .download(filePath);

        if (downloadError) {
          previewGambar.style.display = 'none';
          previewGambar.src = '';
        } else {
          // Gunakan getImageUrl agar ada timestamp
          previewGambar.src = getImageUrl(editData.flower, editData.varian);
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

    tambahBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => (modal.style.display = 'none'));

    // Close modal when clicking outside modal-content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

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
      const oldFlowerVarian = oldFlowerInput.value;

      const newFileName = getFileName(flower, varian);
      let oldFileName = '';
      let oldFlower = '';
      let oldVarian = '';
      if (oldFlowerVarian) {
        [oldFlower, oldVarian] = oldFlowerVarian.split('||');
        oldFileName = getFileName(oldFlower, oldVarian);
      }

      // Jika edit dan nama buket/varian berubah, rename gambar di storage
      if (editId) {
        if (oldFlower !== flower || oldVarian !== varian) {
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
        // Jika edit, hapus gambar lama terlebih dahulu (jika ada dan nama file berbeda)
        if (editId) {
          // Hapus gambar lama jika nama file berubah atau memang ada file lama
          if (oldFileName && oldFileName !== newFileName) {
            await supabase.storage.from(bucketName).remove([oldFileName]);
          } else if (oldFileName && oldFileName === newFileName) {
            // Jika nama file sama, hapus dulu file lama agar tidak duplikat
            await supabase.storage.from(bucketName).remove([oldFileName]);
          }
        }

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

    // Fetch data awal
    const { data: bouquets } = await supabase.from('flowry').select('*');
    const tableBody = document.getElementById('bouquet-table-body');
    const searchInput = document.getElementById('bouquet-search');
    const searchBtn = document.getElementById('bouquet-search-btn');

    // Helper for Rupiah formatting
    const formatRupiah = (angka) => {
      return 'Rp' + angka.toLocaleString('id-ID');
    };

    // Tambahkan data-col pada th
    function patchTableHeader() {
      const ths = document.querySelectorAll('.bouquet-table th');
      const cols = [
        'id',
        'nama_buket',
        'gambar',
        'varian',
        'harga',
        'deskripsi',
        'aksi',
      ];
      ths.forEach((th, idx) => {
        th.setAttribute('data-col', cols[idx]);
      });
    }

    // Sort state
    const sortState = {
      column: null,
      asc: true,
    };

    // Sorting logic
    function sortBouquets(data) {
      if (!sortState.column) return data;
      const arr = [...data];
      arr.sort((a, b) => {
        let valA, valB;
        switch (sortState.column) {
          case 'id':
            valA = Number(a.id);
            valB = Number(b.id);
            break;
          case 'nama_buket':
            valA = (a.flower || '').toLowerCase();
            valB = (b.flower || '').toLowerCase();
            break;
          case 'varian':
            valA = (a.varian || '').toLowerCase();
            valB = (b.varian || '').toLowerCase();
            break;
          case 'harga':
            valA = Number(a.harga);
            valB = Number(b.harga);
            break;
          case 'deskripsi':
            valA = (a.deskripsi || '').toLowerCase();
            valB = (b.deskripsi || '').toLowerCase();
            break;
          default:
            valA = '';
            valB = '';
        }
        if (valA < valB) return sortState.asc ? -1 : 1;
        if (valA > valB) return sortState.asc ? 1 : -1;
        return 0;
      });
      return arr;
    }

    // Render sort icon di header
    function renderSortIcons() {
      const ths = document.querySelectorAll('.bouquet-table th');
      ths.forEach((th) => {
        th.querySelector('.sort-icon')?.remove();
        let col = th.getAttribute('data-col');
        if (!col) return;
        // Hanya render icon di kolom yang bisa sort (bukan gambar/aksi)
        if (['gambar', 'aksi'].includes(col)) return;
        // Wrap th content in a flex container (jika belum)
        if (!th.querySelector('.th-flex')) {
          const flex = document.createElement('div');
          flex.className = 'th-flex';
          flex.style.display = 'flex';
          flex.style.alignItems = 'center';
          flex.style.justifyContent = 'space-between';
          flex.style.width = '100%';
          // flex.style.marginLeft = 'px'; // Untuk mengimbangi padding th
          // Pindahkan semua child ke flex
          while (th.firstChild) flex.appendChild(th.firstChild);
          th.appendChild(flex);
        }
        const flex = th.querySelector('.th-flex');
        // Pastikan teks align left, icon align right
        if (flex.childNodes.length === 1) {
          const textSpan = document.createElement('span');
          textSpan.className = 'th-text';
          textSpan.style.flex = '1';
          textSpan.style.textAlign = 'left';
          textSpan.style.fontWeight = 'inherit';
          textSpan.style.marginLeft = '6.24px'; // Untuk mengimbangi padding th
          textSpan.appendChild(flex.firstChild);
          flex.appendChild(textSpan);
        }
        // Hapus icon lama jika ada
        flex.querySelector('.sort-icon')?.remove();
        // Tambahkan icon sort
        const icon = document.createElement('img');
        icon.src = '../icons/caret-down.png';
        icon.className = 'sort-icon';
        icon.style.width = '11px';
        icon.style.height = '11px';
        icon.style.cursor = 'pointer';
        icon.style.marginLeft = '8px';
        icon.style.marginBottom = '7px';
        icon.style.transition = 'transform 0.18s';
        icon.style.alignSelf = 'flex-end';
        // Rotasi jika descending
        icon.style.transform =
          sortState.column === col && !sortState.asc
            ? 'rotate(180deg)'
            : 'none';
        if (sortState.column === col) {
          icon.style.filter = 'none';
        } else {
          icon.style.filter = 'grayscale(1) opacity(0.6)';
        }
        flex.appendChild(icon);
        icon.onclick = () => {
          if (sortState.column === col) {
            sortState.asc = !sortState.asc;
          } else {
            sortState.column = col;
            sortState.asc = true;
          }
          renderTable(
            sortBouquets(
              searchInput.value.trim()
                ? bouquets.filter((item) => {
                    const keyword = searchInput.value.trim().toLowerCase();
                    return (
                      (item.flower &&
                        item.flower.toLowerCase().includes(keyword)) ||
                      (item.varian &&
                        item.varian.toLowerCase().includes(keyword)) ||
                      (item.deskripsi &&
                        item.deskripsi.toLowerCase().includes(keyword)) ||
                      (item.harga &&
                        String(item.harga).toLowerCase().includes(keyword)) ||
                      (item.id &&
                        String(item.id).toLowerCase().includes(keyword)) ||
                      (keyword === 'see more' &&
                        item.deskripsi &&
                        item.deskripsi.length > 20)
                    );
                  })
                : bouquets
            ),
            searchInput.value.trim().toLowerCase()
          );
          renderSortIcons();
        };
      });
    }

    // Patch header
    patchTableHeader();

    // Render function untuk tabel, menerima array data dan keyword search
    function renderTable(filteredBouquets, keyword = '') {
      if (!tableBody) return;
      // Sort sebelum render
      filteredBouquets = sortBouquets(filteredBouquets);
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
              <td style="text-align:center">${item.id}</td>
              <td>${item.flower}</td>
              <td>
                <div class="bouquet-img-center">
                  <img src="${imageUrl}" loading="lazy" alt="${
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
                  }" data-flower="${item.flower}" data-varian="${
            item.varian
          }">Hapus</button>
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
          const varian = e.target.dataset.varian;
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
          const fileName = getFileName(flower, varian);
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
    renderSortIcons();

    // Search as you type or button
    function doSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      let filtered = bouquets;
      if (keyword) {
        filtered = bouquets.filter((item) => {
          return (
            (item.flower && item.flower.toLowerCase().includes(keyword)) ||
            (item.varian && item.varian.toLowerCase().includes(keyword)) ||
            (item.deskripsi &&
              item.deskripsi.toLowerCase().includes(keyword)) ||
            (item.harga &&
              String(item.harga).toLowerCase().includes(keyword)) ||
            (item.id && String(item.id).toLowerCase().includes(keyword)) ||
            (keyword === 'see more' &&
              item.deskripsi &&
              item.deskripsi.length > 20)
          );
        });
      }
      renderTable(filtered, keyword);
      renderSortIcons();
    }
    searchInput.addEventListener('input', doSearch);
    searchBtn.addEventListener('click', doSearch);
  },
};

export default AdminBouquet;
