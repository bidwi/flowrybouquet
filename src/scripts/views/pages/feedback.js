import supabase from '../../globals/supabaseClient';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

const FeedbackPage = {
  async render() {
    // Ambil data flowry untuk dropdown
    const { data: bouquets } = await supabase.from('flowry').select('*');

    // Buat list nama buket unik
    const uniqueFlowers = [];
    const flowerMap = {};
    bouquets?.forEach((b) => {
      if (!flowerMap[b.flower]) {
        flowerMap[b.flower] = [];
        uniqueFlowers.push(b.flower);
      }
      flowerMap[b.flower].push(b.varian);
    });

    // Buat opsi nama buket (hanya satu kali per nama)
    const options =
      uniqueFlowers.length > 0
        ? uniqueFlowers
            .map((flower) => `<option value="${flower}">${flower}</option>`)
            .join('')
        : '';

    // Buat mapping varian per flower
    const bouquetsByFlower = {};
    bouquets?.forEach((b) => {
      if (!bouquetsByFlower[b.flower]) bouquetsByFlower[b.flower] = [];
      bouquetsByFlower[b.flower].push({ id: b.id, varian: b.varian });
    });

    // Simpan mapping ke window untuk afterRender
    window.__bouquetsByFlower = bouquetsByFlower;

    // Ambil parameter dari hash jika ada (untuk autofill)
    let autofillName = '';
    let autofillVarian = '';
    const hash = window.location.hash.split('/');
    if (hash[1] === 'detail' && hash[2]) {
      const itemName = decodeURIComponent(hash[2]);
      if (itemName.includes('--')) {
        [autofillName, autofillVarian] = itemName.split('--');
      }
    }

    // Ambil session untuk email user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.hash = '#/login';
      return '';
    }
    const userEmail = session.user?.email || '';

    return `
      <main class="feedback-page">
        <div class="feedback-header">
          <h2 class="feedback-title">
            <span class="part-kirim">Kirim</span>
            <span class="part-feedback"><em>Feedback</em></span>
          </h2>
          <button id="logout-btn" class="bouquet-logout-btn feedback-logout-btn" style="margin-top:-10px">Logout</button>
        </div>
        <form id="feedback-form" class="feedback-form" enctype="multipart/form-data" autocomplete="off">
          <label for="nama-buket">Nama Buket <span style="color:red">*</span></label>
          <select id="nama-buket" name="nama-buket" required ${
            autofillName ? 'disabled' : ''
          }>
            <option value="">Pilih buket...</option>
            ${options}
          </select>

          <div id="varian-buket-wrapper"></div>

          <label>Rating <span style="color:red">*</span></label>
          <div id="rating-stars" class="rating-stars">
            ${[1, 2, 3, 4, 5]
              .map(
                (i) =>
                  `<img data-src="../icons/star.png" data-rate="${i}" class="star-icon lazyload" alt="star" />`
              )
              .join('')}
          </div>
          <input type="hidden" id="rating" name="rating" required />

          <label for="feedback">Deskripsi <span style="color:red">*</span></label>
          <textarea id="feedback" name="feedback" maxlength="256" required placeholder="Tulis feedback Anda..."></textarea>

          <label for="gambar">Gambar (Maksimal 4MB) <span style="color:red">*</span></label>
          <input type="file" id="gambar" name="gambar" accept="image/*" required />
          <img id="preview-gambar" data-src="" class="lazyload" style="max-width:120px;display:none;margin:8px 0;" alt="Preview Gambar" />

          <div id="feedback-loading" style="display:none;color:blue;margin-top:0.5rem;">Tunggu sebentar..</div>
          <div id="feedback-success" style="display:none;color:green;margin-top:1rem;">Feedback berhasil dikirim!</div>
          
          <button type="submit" class="feedback-submit-btn">Submit Form</button>
        </form>
      </main>
    `;
  },

  async afterRender() {
    const bouquetsByFlower = window.__bouquetsByFlower || {};
    const namaBuket = document.getElementById('nama-buket');
    const varianWrapper = document.getElementById('varian-buket-wrapper');
    // Autofill dari hash jika ada
    let autofillName = '';
    let autofillVarian = '';
    const hash = window.location.hash.split('/');
    if (hash[1] === 'detail' && hash[2]) {
      const itemName = decodeURIComponent(hash[2]);
      if (itemName.includes('--')) {
        [autofillName, autofillVarian] = itemName.split('--');
      }
    }
    let selectedFlower = autofillName || '';
    let selectedVarian = autofillVarian || '';
    let selectedIdFlowry = '';

    function renderVarianInput(flower) {
      varianWrapper.innerHTML = '';
      if (!flower || !bouquetsByFlower[flower]) return;
      const variants = bouquetsByFlower[flower];
      if (variants.length === 1) {
        // Satu varian, readonly input
        varianWrapper.innerHTML = `
          <label for="varian-buket">Varian Buket <span style="color:red">*</span></label>
          <input type="text" id="varian-buket" name="varian-buket" value="${variants[0].varian}" readonly required />
        `;
        selectedVarian = variants[0].varian;
        selectedIdFlowry = variants[0].id;
      } else {
        // Banyak varian, jika autofill, langsung pilih varian spesifik
        if (autofillVarian) {
          const match = variants.find((v) => v.varian === autofillVarian);
          if (match) {
            varianWrapper.innerHTML = `
              <label for="varian-buket">Varian Buket <span style="color:red">*</span></label>
              <input type="text" id="varian-buket" name="varian-buket" value="${match.varian}" readonly required />
            `;
            selectedVarian = match.varian;
            selectedIdFlowry = match.id;
            return;
          }
        }
        // Jika tidak autofill, tampilkan dropdown
        varianWrapper.innerHTML = `
          <label for="varian-buket">Varian Buket <span style="color:red">*</span></label>
          <select id="varian-buket" name="varian-buket" required>
            <option value="">Pilih varian...</option>
            ${variants
              .map(
                (v) =>
                  `<option value="${v.varian}" data-id="${v.id}">${v.varian}</option>`
              )
              .join('')}
          </select>
        `;
        selectedVarian = '';
        selectedIdFlowry = '';
      }
    }

    // Set nama buket dan varian jika autofill
    if (autofillName && namaBuket) {
      namaBuket.value = autofillName;
      renderVarianInput(autofillName);
      namaBuket.disabled = true;
    } else if (namaBuket) {
      namaBuket.addEventListener('change', function () {
        selectedFlower = namaBuket.value;
        renderVarianInput(selectedFlower);

        // Jika dropdown, listen perubahan varian
        const varianSelect = document.getElementById('varian-buket');
        if (varianSelect && varianSelect.tagName === 'SELECT') {
          varianSelect.addEventListener('change', function () {
            selectedVarian = varianSelect.value;
            selectedIdFlowry =
              varianSelect.options[varianSelect.selectedIndex].getAttribute(
                'data-id'
              ) || '';
          });
        } else if (varianSelect && varianSelect.tagName === 'INPUT') {
          selectedVarian = varianSelect.value;
          selectedIdFlowry = bouquetsByFlower[selectedFlower][0].id;
        }
      });
    }

    // Jika autofill varian, set selectedIdFlowry
    if (autofillName && autofillVarian && bouquetsByFlower[autofillName]) {
      const match = bouquetsByFlower[autofillName].find(
        (v) => v.varian === autofillVarian
      );
      if (match) {
        selectedVarian = match.varian;
        selectedIdFlowry = match.id;
      }
    }

    // Preview gambar
    const gambarInput = document.getElementById('gambar');
    const previewGambar = document.getElementById('preview-gambar');
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

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        window.location.href = '#/login'; // redirect ke login page
      } else {
        console.error('Logout gagal:', error.message);
      }
    });

    // Rating bintang
    let rating = 0;
    const ratingInput = document.getElementById('rating');
    const stars = document.querySelectorAll('.star-icon');
    function updateStars(val) {
      stars.forEach((star, idx) => {
        star.src = idx < val ? '../icons/star-filled.png' : '../icons/star.png';
      });
    }
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        rating = Number(star.getAttribute('data-rate'));
        ratingInput.value = rating;
        updateStars(rating);
      });
    });

    // Submit form
    const form = document.getElementById('feedback-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validasi manual semua input
        const gambarFile = gambarInput.files[0];
        const namaBuketVal = namaBuket.value;
        const varianInput = document.getElementById('varian-buket');
        const varianVal = varianInput ? varianInput.value : '';
        const ratingVal = ratingInput.value;
        const feedbackVal = document.getElementById('feedback').value.trim();
        const feedbackLoading = document.getElementById('feedback-loading');
        if (feedbackLoading) feedbackLoading.style.display = 'block';

        if (!gambarFile) {
          alert('Gambar wajib diisi!');
          gambarInput.focus();
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (
          gambarFile.type !== 'image/jpeg' &&
          gambarFile.type !== 'image/png'
        ) {
          alert('Format gambar harus JPG/JPEG atau PNG!');
          gambarInput.value = '';
          previewGambar.src = '';
          previewGambar.style.display = 'none';
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (!namaBuketVal) {
          alert('Nama buket wajib dipilih!');
          namaBuket.focus();
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (!varianVal) {
          alert('Varian buket wajib dipilih!');
          varianInput?.focus();
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (!ratingVal) {
          alert('Pilih rating terlebih dahulu!');
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (!feedbackVal) {
          alert('Deskripsi wajib diisi!');
          document.getElementById('feedback').focus();
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }
        if (gambarFile.size > 4 * 1024 * 1024) {
          alert('Ukuran gambar maksimal 4MB!');
          if (feedbackLoading) feedbackLoading.style.display = 'none';
          return;
        }

        // Pastikan id_flowry benar
        let id_flowry = selectedIdFlowry;
        if (!id_flowry) {
          // fallback jika user belum memilih varian setelah memilih nama buket
          if (varianInput && varianInput.tagName === 'SELECT') {
            const selected = varianInput.options[varianInput.selectedIndex];
            id_flowry = selected?.getAttribute('data-id') || '';
          } else if (varianInput && varianInput.tagName === 'INPUT') {
            id_flowry = bouquetsByFlower[namaBuketVal][0].id;
          }
        }
        if (!id_flowry) {
          alert('Varian buket tidak valid!');
          return;
        }

        // Simpan ke tabel feedback
        const { data: insertData, error: insertError } = await supabase
          .from('feedback')
          .insert([
            {
              id_flowry: id_flowry,
              rating: Number(ratingVal),
              feedback: feedbackVal,
            },
          ])
          .select('id_feedback');

        if (insertError) {
          alert('Gagal mengirim feedback: ' + insertError.message);
          return;
        }

        // Dapatkan id_feedback dari hasil insert
        const id_feedback = insertData && insertData[0]?.id_feedback;
        if (!id_feedback) {
          alert('Gagal mendapatkan ID feedback.');
          return;
        }

        // Nama file gambar: id_feedback.ext (ambil ekstensi dari file asli)
        const ext = gambarFile.name.split('.').pop();
        const fileName = `${id_feedback}.${ext}`;

        // Upload gambar ke bucket "feedback" dengan nama id_feedback.ext (overwrite jika ada)
        const { error: uploadError } = await supabase.storage
          .from('feedback')
          .upload(fileName, gambarFile, { upsert: true });
        if (uploadError) {
          alert('Gagal upload gambar: ' + uploadError.message);
          return;
        }

        if (feedbackLoading) feedbackLoading.style.display = 'none';
        form.reset();
        updateStars(0);
        if (previewGambar) previewGambar.style.display = 'none';
        const feedbackSuccess = document.getElementById('feedback-success');
        if (feedbackSuccess) feedbackSuccess.style.display = 'block';
        setTimeout(() => {
          const feedbackSuccess = document.getElementById('feedback-success');
          if (feedbackSuccess) feedbackSuccess.style.display = 'none';
        }, 3000);
      });
    }
  },
};

export default FeedbackPage;
