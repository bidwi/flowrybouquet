import supabase from '../../globals/supabaseClient';

const FeedbackPage = {
  async render() {
    // Ambil data flowry untuk dropdown
    const { data: bouquets } = await supabase.from('flowry').select('*');

    // Buat opsi nama buket
    const options =
      bouquets && bouquets.length
        ? bouquets
            .map(
              (b) =>
                `<option value="${b.id}" data-flower="${b.flower}" data-varian="${b.varian}">${b.flower}</option>`
            )
            .join('')
        : '';

    return `
      <main class="feedback-page">
        <div class="feedback-header">
          <h2 class="feedback-title">Kirim <em>Feedback</em> Buket</h2>
        </div>
        <form id="feedback-form" class="feedback-form" enctype="multipart/form-data">
          <label for="gambar">Gambar (Maksimal 4MB)</label>
          <input type="file" id="gambar" name="gambar" accept="image/*" required />
          <img id="preview-gambar" style="max-width:120px;display:none;margin:8px 0;" />

          <label for="nama-buket">Nama Buket</label>
          <select id="nama-buket" name="nama-buket" required>
            <option value="">Pilih buket...</option>
            ${options}
          </select>

          <label for="varian-buket">Varian Buket</label>
          <input type="text" id="varian-buket" name="varian-buket" readonly placeholder="Varian akan terisi otomatis" />

          <label>Rating</label>
          <div id="rating-stars" class="rating-stars">
            ${[1, 2, 3, 4, 5]
              .map(
                (i) =>
                  `<img src="../icons/star.png" data-rate="${i}" class="star-icon" alt="star" />`
              )
              .join('')}
          </div>
          <input type="hidden" id="rating" name="rating" required />

          <label for="feedback">Deskripsi</label>
          <textarea id="feedback" name="feedback" required placeholder="Tulis feedback Anda..."></textarea>

          <button type="submit" class="feedback-submit-btn">Submit Form</button>
        </form>
        <div id="feedback-success" style="display:none;color:green;margin-top:1rem;">Feedback berhasil dikirim!</div>
      </main>
    `;
  },

  async afterRender() {
    // Isi varian otomatis saat nama buket dipilih
    const namaBuket = document.getElementById('nama-buket');
    const varianBuket = document.getElementById('varian-buket');
    let selectedFlower = '';
    let selectedVarian = '';
    namaBuket.addEventListener('change', () => {
      const selected = namaBuket.options[namaBuket.selectedIndex];
      varianBuket.value = selected.getAttribute('data-varian') || '';
      selectedFlower = selected.getAttribute('data-flower') || '';
      selectedVarian = selected.getAttribute('data-varian') || '';
    });

    // Preview gambar
    const gambarInput = document.getElementById('gambar');
    const previewGambar = document.getElementById('preview-gambar');
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validasi
      if (!ratingInput.value) {
        alert('Pilih rating terlebih dahulu!');
        return;
      }
      const gambarFile = gambarInput.files[0];
      if (!gambarFile) {
        alert('Pilih gambar terlebih dahulu!');
        return;
      }
      if (gambarFile.size > 4 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 4MB!');
        return;
      }

      const id_flowry = namaBuket.value;
      const feedback = document.getElementById('feedback').value.trim();

      // Simpan ke tabel feedback
      const { data: insertData, error: insertError } = await supabase
        .from('feedback')
        .insert([
          {
            id_flowry: id_flowry,
            rating: Number(ratingInput.value),
            feedback: feedback,
          },
        ])
        .select('id_feedback'); // select id_feedback agar dapat id-nya

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

      // Nama file gambar: id_feedback-flower-varian-timestamp-namagambar.ext
      let flower = selectedFlower || '';
      let varian = selectedVarian || '';
      if (!flower) {
        const selected = namaBuket.options[namaBuket.selectedIndex];
        flower = selected?.getAttribute('data-flower') || '';
        varian = selected?.getAttribute('data-varian') || '';
      }
      const clean = (str) =>
        (str || '')
          .toString()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9\-]/g, '')
          .toLowerCase();
      const fileName =
        id_feedback +
        '-' +
        clean(flower) +
        '-' +
        clean(varian) +
        '-' +
        Date.now() +
        '-' +
        gambarFile.name.replace(/\s+/g, '-').toLowerCase();

      // Upload gambar ke bucket "feedback" dengan nama yang mengandung id_feedback
      const { error: uploadError } = await supabase.storage
        .from('feedback')
        .upload(fileName, gambarFile, { upsert: true });
      if (uploadError) {
        alert('Gagal upload gambar: ' + uploadError.message);
        return;
      }

      form.reset();
      updateStars(0);
      previewGambar.style.display = 'none';
      document.getElementById('feedback-success').style.display = 'block';
      setTimeout(() => {
        document.getElementById('feedback-success').style.display = 'none';
      }, 3000);
    });
  },
};

export default FeedbackPage;
