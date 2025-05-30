import details from '../../data/details.json';
import supabase from '../../globals/supabaseClient';

const Detail = {
  async render() {
    return `
      <main id="detail-container">
        <div class="loading">Loading...</div>
      </main>
    `;
  },

  async afterRender() {
    const hash = window.location.hash.split('/');
    const itemName = decodeURIComponent(hash[2]);
    let item = details.find((detail) => detail.name === itemName);

    // Jika tidak ditemukan di details.json, cari di Supabase
    if (!item) {
      // Query ke Supabase
      const { data, error } = await supabase
        .from('flowry')
        .select('*')
        .eq('flower', itemName)
        .single();

      if (!error && data) {
        // Format harga dan gambar
        const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');
        const getImageUrl = (flower) =>
          `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/photo/${flower
            .replace(/\s+/g, '-')
            .toLowerCase()}`;
        item = {
          name: data.flower,
          variant: data.varian,
          price: formatRupiah(data.harga),
          image: getImageUrl(data.flower),
          description: data.deskripsi,
        };
      }
    }

    if (!item) {
      document.getElementById('detail-container').innerHTML =
        '<p class="empty-message">Item tidak ditemukan.</p>';
      return;
    }

    const detailContainer = document.getElementById('detail-container');
    detailContainer.innerHTML = `
      <div class="detail-content">
        <img class="detail-image" src="${item.image}" alt="${item.name}">
        <div class="detail-info">
          <h1>${item.name}</h1>
          <h2>${item.variant}</h2>
          <h3>${item.price}</h3>
          <p>${item.description}</p>
          <div class="detail-buttons">
            <button id="add-to-wishlist" class="wishlist-button">Tambah ke Wishlist</button>
            <button id="buy-via-instagram" class="buy-instagram">Beli via Instagram</button>
            <button id="buy-via-whatsapp" class="buy-whatsapp">Beli via WhatsApp</button>
          </div>
        </div>
      </div>
    `;

    document
      .getElementById('add-to-wishlist')
      .addEventListener('click', () => this.addToWishlist(item));

    document
      .getElementById('buy-via-whatsapp')
      .addEventListener('click', () => this.buyViaWhatsApp(item));

    document
      .getElementById('buy-via-instagram')
      .addEventListener('click', () => this.buyViaInstagram(item));
  },

  addToWishlist(item) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const alreadyInWishlist = wishlist.some(
      (wishlistItem) => wishlistItem.name === item.name
    );

    if (!alreadyInWishlist) {
      wishlist.push(item);
      alert('Item berhasil ditambahkan ke wishlist!');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  },

  buyViaWhatsApp(item) {
    const phoneNumber = process.env.VITE_WHATSAPP_PHONE_NUMBER;
    const message = `Halo, saya ingin membeli ${item.name}, varian ${item.variant}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, '_blank');
  },

  buyViaInstagram() {
    const instagramUsername = 'flowry.bouquet'; // Ganti dengan username Instagram tujuan
    const instagramURL = `https://ig.me/m/${instagramUsername}`;

    window.open(instagramURL);
  },
};

export default Detail;
