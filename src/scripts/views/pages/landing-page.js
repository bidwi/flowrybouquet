import details from '../../data/details.json';
import supabase from '../../globals/supabaseClient';

const LandingPage = {
  async render() {
    document.body.classList.remove('is-wishlist-page');
    return `
      <div class="hero-image">
        <div class="overlay"></div>
        <div class="hero-text">
          <h1 class="judul-landing-page">Buket Murah? Flowry Bouquet Saja!</h1>
          <p class="deskripsi-landing-page">Buket termurah untuk orang yang paling spesial!</p>
        </div>
      </div>

      <h2 class="buket-kami">Katalog Kami</h2>

      <main id="cards-container" class="sort-card">
        <!-- Cards akan dimuat di sini -->
      </main>

      <section class="video-section">
        <div class="video-content">
          <div class="video-text">
            <h2>Buket Spesial untuk Orang yang Paling Spesial</h2>
            <p>Pesan Sekarang Juga!</p>
          </div>
          <div class="video-frame">
            <video autoplay loop muted playsinline>
              <source src="/video_marketing.mp4" type="video/mp4">
              Browser Anda tidak mendukung video HTML5.
            </video>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const cardsContainer = document.getElementById('cards-container');
    // Ambil data dari Supabase
    const { data: bouquets } = await supabase.from('flowry').select('*');
    // Helper untuk format harga
    const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');
    // Helper untuk gambar supabase
    const getImageUrl = (flower) =>
      `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/photo/${flower
        .replace(/\s+/g, '-')
        .toLowerCase()}`;

    // Siapkan array gabungan: details.json + supabase
    const katalog = [
      // Data dari details.json
      ...details.map((item) => ({
        name: item.name,
        variant: item.variant,
        price: item.price,
        image: item.image,
        description: item.description,
        source: 'json',
      })),
      // Data dari supabase
      ...(Array.isArray(bouquets)
        ? bouquets.map((item) => ({
            name: item.flower,
            variant: item.varian,
            price: formatRupiah(item.harga),
            image: getImageUrl(item.flower),
            description: item.deskripsi,
            source: 'supabase',
          }))
        : []),
    ];

    if (katalog.length === 0) {
      cardsContainer.innerHTML =
        '<p style="text-align:center;">Belum ada data buket.</p>';
      return;
    }

    cardsContainer.innerHTML = katalog
      .map((item) =>
        this.createCard(
          item.name,
          item.variant,
          item.price,
          item.image,
          item.description
        )
      )
      .join('');

    // Card klik ke detail
    document.querySelectorAll('.card-wishlist').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Cegah klik tombol wishlist memicu detail
        if (e.target.classList.contains('wishlist-btn')) return;
        const name = card.getAttribute('data-name');
        window.location.hash = `#/detail/${encodeURIComponent(name)}`;
      });
    });
  },

  createCard(name, variant, price, image, description) {
    // Simpan data di attribute agar mudah diambil saat klik wishlist
    return `
      <article class="card-wishlist" data-name="${name}" data-variant="${variant}" data-price="${price}" data-image="${image}" data-description="${description}">
        <section>
          <img class="image-card" src="${image}" alt="${name}">
          <article class="container">
            <h4 class="judul-buket"><b>${name}</b></h4> 
            <p class="varian-buket">Varian: ${variant}</p>
            <button type="button" class="button-card">${price}</button> 
            <!-- <span style="float:right;font-size:0.95em;color:#888;">${price}</span> -->
          </article>
        </section>
      </article>
    `;
  },
};

export default LandingPage;
