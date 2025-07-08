import supabase from '../../globals/supabaseClient';

const Wishlist = {
  async render() {
    // Cek apakah user login
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // if (!session) {
    //   window.location.hash = '#/login';
    //   return '<p style="text-align:center;">Silakan login terlebih dahulu untuk mengakses wishlist.</p>';
    // }
    document.body.classList.add('wishlist-page', 'is-wishlist-page');
    return `
      <h1 class="wishlist-judul">Wishlist Kamu</h1>
      <main class="wishlist-container" id="wishlist-container">
        <!-- Konten wishlist akan dimasukkan di sini -->
      </main>

      <!-- Modal Konfirmasi -->
      <div id="confirmation-modal" class="modal">
        <div class="modal-content">
          <span id="close-modal" class="close">&times;</span>
          <h3>Apakah Anda ingin:</h3>
          <button id="delete-item" class="modal-button">Hapus Item</button>
          <button id="view-info" class="modal-button">Lihat Info</button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    // if (!session) return;

    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Cek ke Supabase untuk validasi item masih ada
    if (wishlist.length > 0) {
      // Ambil semua nama dan varian unik
      // eslint-disable-next-line no-unused-vars
      const names = wishlist.map((item) => item.name);
      // eslint-disable-next-line no-unused-vars
      const variants = wishlist.map((item) => item.variant);

      // Query semua data yang ada di wishlist
      const { data: bouquetData } = await supabase
        .from('flowry')
        .select('flower, varian');

      // Filter wishlist yang masih ada di database
      wishlist = wishlist.filter((item) =>
        bouquetData?.some(
          (row) => row.flower === item.name && row.varian === item.variant
        )
      );
      // Update localStorage jika ada perubahan
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Helper untuk generate image url dari name & variant
    const getImageUrl = (name, variant) =>
      `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/photo/${name
        .replace(/\s+/g, '-')
        .toLowerCase()}-${variant
        .replace(/\s+/g, '-')
        .toLowerCase()}?t=${Date.now()}`;

    // Update semua item wishlist agar image selalu dari supabase storage
    wishlist = wishlist.map((item) => ({
      ...item,
      image: getImageUrl(item.name, item.variant),
    }));

    const modal = document.getElementById('confirmation-modal');
    const closeModal = document.getElementById('close-modal');
    const viewInfoButton = document.getElementById('view-info');
    const deleteItemButton = document.getElementById('delete-item');

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML =
        '<p class="empty-wishlist-message">Tidak ada item di wishlist kamu.</p>';
    } else {
      wishlistContainer.innerHTML = wishlist
        .map(
          (item, index) => `
        <article class="card-wishlist" data-index="${index}" data-name="${item.name}">
          <section>
            <img class="image-card" loading="lazy" src="${item.image}" alt="${item.name}">
            <div class="container">
              <h4><b>${item.name}</b></h4>
              <p>Varian: ${item.variant}</p>
              <button type="button" class="button-card">${item.price}</button>
            </div>
          </section>
        </article>
      `
        )
        .join('');

      // Event listener untuk setiap card wishlist
      document.querySelectorAll('.card-wishlist').forEach((card) => {
        card.addEventListener('click', () => {
          const index = card.getAttribute('data-index');
          const itemName = card.getAttribute('data-name');

          // Tampilkan modal konfirmasi
          modal.style.display = 'block';

          // Klik tombol 'Lihat Info'
          viewInfoButton.onclick = () => {
            window.location.hash = `#/detail/${encodeURIComponent(itemName)}`;
            modal.style.display = 'none';
          };

          // Klik tombol 'Hapus Item'
          deleteItemButton.onclick = () => {
            wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            this.afterRender(); // Update tampilan setelah penghapusan
            modal.style.display = 'none';
          };
        });
      });

      // Tutup modal ketika klik 'X'
      closeModal.onclick = () => {
        modal.style.display = 'none';
      };

      // Tutup modal jika klik di luar modal-content (termasuk background)
      modal.onclick = (event) => {
        // Cek apakah klik terjadi di luar modal-content
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    }
  },
};

export default Wishlist;
