import supabase from '../../globals/supabaseClient';

// Ambil allowedEmails dari environment variable
const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

const AdminFeedback = {
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
          <h2 class="bouquet-title">Data Feedback</h2>
          <a class="bouquet-feedback-link" id="feedback-bouquet-link">/ Data buket</a>
        </div>
        <div class="bouquet-search-row">
          <input type="text" id="feedback-search" class="bouquet-search-input" placeholder="Cari feedback...">
          <button id="feedback-search-btn" class="bouquet-search-btn">Cari</button>
        </div>
        <div class="table-responsive">
          <table class="admin-feedback-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gambar</th>
                <th>Buket</th>
                <th>Varian Buket</th>
                <th>Email</th>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="admin-feedback-table-body"></tbody>
          </table>
        </div>
        <!-- Modal Edit Feedback -->
        <div id="modal-feedback" class="bouquet-modal">
          <div class="bouquet-modal-content" id="modal-feedback-content">
            <h3 id="modal-feedback-title">Edit Feedback</h3>
            <form id="form-edit-feedback">
              <input type="hidden" id="edit-id-feedback">
              <label>Nama Buket:</label>
              <input type="text" id="edit-nama-buket" class="bouquet-input" readonly>
              <label>Varian:</label>
              <input type="text" id="edit-varian-buket" class="bouquet-input" readonly>
              <label>Email:</label>
              <input type="text" id="edit-email" class="bouquet-input" readonly>
              <label>Rating:</label>
              <input type="number" id="edit-rating" class="bouquet-input" min="1" max="5" required>
              <label>Feedback:</label>
              <textarea id="edit-feedback" class="bouquet-input bouquet-textarea" required></textarea>
              <div style="margin-top: 1rem;">
                <button type="submit" class="bouquet-submit-btn">Simpan</button>
                <button type="button" id="close-modal-feedback" class="bouquet-cancel-btn">Batal</button>
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

    // Anchor ke Data Buket
    const feedbackBouquetLink = document.getElementById(
      'feedback-bouquet-link'
    );
    feedbackBouquetLink?.addEventListener('click', () => {
      window.location.hash = '#/admin-bouquet';
    });

    // Modal logic
    const modal = document.getElementById('modal-feedback');
    const closeModal = document.getElementById('close-modal-feedback');
    const form = document.getElementById('form-edit-feedback');
    const modalTitle = document.getElementById('modal-feedback-title');
    const editIdInput = document.getElementById('edit-id-feedback');
    const editNamaBuket = document.getElementById('edit-nama-buket');
    const editVarianBuket = document.getElementById('edit-varian-buket');
    const editRating = document.getElementById('edit-rating');
    const editFeedback = document.getElementById('edit-feedback');

    if (closeModal && modal) {
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    // Fetch data awal
    const { data: bouquets } = await supabase
      .from('flowry')
      .select('id, flower, varian');
    let { data: feedbacks } = await supabase
      .from('feedback')
      .select('id_feedback, id_flowry, feedback, rating, email');

    // Ambil daftar file gambar di bucket feedback
    const { data: files } = await supabase.storage
      .from('feedback')
      .list('', { limit: 1000 });

    // Helper mapping
    const getBouquet = (id) =>
      bouquets?.find((b) => String(b.id) === String(id)) || {};

    function findImageFile(id_feedback) {
      if (!files || !Array.isArray(files)) return '';
      // Cari file yang namanya persis id_feedback.ext (bukan sekadar mengandung)
      const found = files.find((f) => {
        const [name] = f.name.split('.');
        return name === String(id_feedback);
      });
      return found ? found.name : '';
    }

    // State untuk sort
    let sortState = {
      column: null,
      asc: true,
    };

    // Search
    const searchInput = document.getElementById('feedback-search');
    const searchBtn = document.getElementById('feedback-search-btn');
    const tableBody = document.getElementById('admin-feedback-table-body');

    // eslint-disable-next-line no-unused-vars
    function renderTable(data = '', keyword = '') {
      if (!tableBody) return;
      let rows = data || [];
      // Sorting
      if (sortState.column) {
        rows = [...rows].sort((a, b) => {
          let valA, valB;
          switch (sortState.column) {
            case 'id_feedback':
              valA = Number(a.id_feedback);
              valB = Number(b.id_feedback);
              break;
            case 'nama_buket':
              valA = (getBouquet(a.id_flowry)?.flower || '').toLowerCase();
              valB = (getBouquet(b.id_flowry)?.flower || '').toLowerCase();
              break;
            case 'varian_buket':
              valA = (getBouquet(a.id_flowry)?.varian || '').toLowerCase();
              valB = (getBouquet(b.id_flowry)?.varian || '').toLowerCase();
              break;
            case 'feedback':
              valA = (a.feedback || '').toLowerCase();
              valB = (b.feedback || '').toLowerCase();
              break;
            case 'rating':
              valA = Number(a.rating);
              valB = Number(b.rating);
              break;
            default:
              valA = '';
              valB = '';
          }
          if (valA < valB) return sortState.asc ? -1 : 1;
          if (valA > valB) return sortState.asc ? 1 : -1;
          return 0;
        });
      }
      if (!rows || rows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada data feedback.</td></tr>`;
        return;
      }
      tableBody.innerHTML = rows
        .map((item) => {
          const bouquet = getBouquet(item.id_flowry);
          const imageFile = findImageFile(item.id_feedback);
          const imageUrl = imageFile
            ? `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/feedback/${imageFile}`
            : '';
          return `
            <tr>
              <td>${item.id_feedback}</td>
              <td>
                <div class="admin-feedback-img-center">
                  ${
                    imageUrl
                      ? `<img src="${imageUrl}" loading="lazy" alt="feedback-img" class="admin-feedback-table-img" />`
                      : '-'
                  }
                </div>
              </td>
              <td>${bouquet.flower || '-'}</td>
              <td>${bouquet.varian || '-'}</td>
              <td>
                <span style="display:inline-block; min-width:180px; max-width:260px; word-break:break-all;">
                  ${item.email || '-'}
                </span>
              </td>
              <td>${item.feedback || ''}</td>
              <td>${item.rating || ''}</td>
              <td>
                <div class="bouquet-action-center">
                  <button class="edit-btn bouquet-action-btn bouquet-edit-btn" data-id="${
                    item.id_feedback
                  }">Edit</button>
                  <button class="delete-btn bouquet-action-btn bouquet-delete-btn" data-id="${
                    item.id_feedback
                  }">Hapus</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('');

      // Edit handler
      document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = feedbacks.find(
            (f) => String(f.id_feedback) === String(id)
          );
          if (!item) return;
          const bouquet = getBouquet(item.id_flowry);
          modalTitle.innerText = 'Edit Feedback';
          editIdInput.value = item.id_feedback;
          editNamaBuket.value = bouquet.flower || '';
          editVarianBuket.value = bouquet.varian || '';
          document.getElementById('edit-email').value = item.email || '';
          editRating.value = item.rating || '';
          editFeedback.value = item.feedback || '';
          if (modal) modal.style.display = 'flex';
        });
      });

      // Delete handler
      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          if (!id) return alert('ID tidak ditemukan!');
          if (!confirm(`Yakin ingin menghapus feedback dengan ID: ${id}?`))
            return;

          // Hapus gambar dari storage terlebih dahulu
          const imageFile = findImageFile(id);
          if (imageFile) {
            const { error: storageDeleteError } = await supabase.storage
              .from('feedback')
              .remove([imageFile]);
            if (storageDeleteError) {
              alert('Gagal menghapus gambar: ' + storageDeleteError.message);
              // Tetap lanjut hapus data di tabel meskipun gambar gagal dihapus
            }
          }

          // Hapus data di tabel
          const { error: deleteError } = await supabase
            .from('feedback')
            .delete()
            .eq('id_feedback', id);
          if (deleteError) {
            alert('Gagal menghapus data: ' + deleteError.message);
            return;
          }

          alert('Data dan gambar feedback berhasil dihapus');
          // Refresh data
          feedbacks = feedbacks.filter(
            (f) => String(f.id_feedback) !== String(id)
          );
          renderTable(feedbacks, searchInput.value.trim().toLowerCase());
        });
      });
    }

    // Edit form submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id_feedback = editIdInput.value;
        const rating = Number(editRating.value);
        const feedbackText = editFeedback.value.trim();

        const { error: updateError } = await supabase
          .from('feedback')
          .update({ rating, feedback: feedbackText })
          .eq('id_feedback', id_feedback);

        if (updateError) {
          alert('Gagal mengedit feedback: ' + updateError.message);
          return;
        }

        // Update data di array lokal
        const idx = feedbacks.findIndex(
          (f) => String(f.id_feedback) === String(id_feedback)
        );
        if (idx !== -1) {
          feedbacks[idx].rating = rating;
          feedbacks[idx].feedback = feedbackText;
        }

        modal.style.display = 'none';
        renderTable(feedbacks, searchInput.value.trim().toLowerCase());
      });
    }

    // Render sort icon di header
    function renderSortIcons() {
      const ths = document.querySelectorAll('.admin-feedback-table th');
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
          renderTable(feedbacks, searchInput.value.trim().toLowerCase());
          renderSortIcons();
        };
      });
    }

    // Tambahkan data-col pada th
    function patchTableHeader() {
      const ths = document.querySelectorAll('.admin-feedback-table th');
      const cols = [
        'id_feedback',
        'gambar',
        'nama_buket',
        'varian_buket',
        'email',
        'feedback',
        'rating',
        'aksi',
      ];
      ths.forEach((th, idx) => {
        th.setAttribute('data-col', cols[idx]);
      });
    }

    // Render tabel pertama kali
    patchTableHeader();
    renderTable(feedbacks);
    renderSortIcons();

    // Search logic
    // Update renderTable di search
    function doSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        renderTable(feedbacks);
        return;
      }
      const filtered = feedbacks.filter((item) => {
        const bouquet = getBouquet(item.id_flowry);
        return (
          (item.id_feedback &&
            String(item.id_feedback).toLowerCase().includes(keyword)) ||
          (bouquet.flower && bouquet.flower.toLowerCase().includes(keyword)) ||
          (bouquet.varian && bouquet.varian.toLowerCase().includes(keyword)) ||
          (item.email && item.email.toLowerCase().includes(keyword)) ||
          (item.feedback && item.feedback.toLowerCase().includes(keyword)) ||
          (item.rating && String(item.rating).toLowerCase().includes(keyword))
        );
      });
      renderTable(filtered, keyword);
      renderSortIcons();
    }
    if (searchInput) searchInput.addEventListener('input', doSearch);
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
  },
};

export default AdminFeedback;
