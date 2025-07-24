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
    // Ambil nama dan varian dari hash (format: #/detail/{name}--{variant})
    let itemName = '';
    let itemVariant = '';
    if (hash[2] && hash[2].includes('--')) {
      [itemName, itemVariant] = hash[2].split('--').map(decodeURIComponent);
    } else {
      itemName = decodeURIComponent(hash[2]);
      itemVariant = '';
    }

    let item = details.find(
      (detail) =>
        detail.name === itemName &&
        (itemVariant ? detail.variant === itemVariant : true)
    );

    // Helper untuk generate image url dari name & variant
    const getImageUrl = (name, variant) =>
      `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/photo/${name
        .replace(/\s+/g, '-')
        .toLowerCase()}-${variant
        .replace(/\s+/g, '-')
        .toLowerCase()}?t=${Date.now()}`;

    // Jika tidak ditemukan di details.json, cari di Supabase
    if (!item) {
      // Query ke Supabase
      let query = supabase.from('flowry').select('*').eq('flower', itemName);
      if (itemVariant) query = query.eq('varian', itemVariant);
      const { data, error } = await query.single();

      if (!error && data) {
        // Format harga dan gambar
        const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');
        item = {
          name: data.flower,
          variant: data.varian,
          price: formatRupiah(data.harga),
          image: getImageUrl(data.flower, data.varian),
          description: data.deskripsi,
        };
      }
    } else {
      // Jika ditemukan di details.json, cek juga ke Supabase
      let query = supabase
        .from('flowry')
        .select('flower, varian')
        .eq('flower', item.name)
        .eq('varian', item.variant);
      const { data: bouquetData } = await query.single();

      if (!bouquetData) {
        item = null;
      } else {
        item.image = getImageUrl(item.name, item.variant);
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
        <img class="detail-image" loading="lazy" src="${item.image}" alt="${item.name}">
        <div class="detail-info">
          <h1>${item.name}</h1>
          <h2>${item.variant}</h2>
          <h3>${item.price}</h3>
          <p>${item.description}</p>
          <div class="detail-buttons">
          <button id="buy-via-instagram" class="buy-instagram">Beli di IG</button>
          <button id="buy-via-whatsapp" class="buy-whatsapp">Beli di WA</button>
          <button id="buy-via-facebook" class="buy-facebook">Beli di FB</button>
          <button id="add-to-wishlist" class="wishlist-button">Wishlist</button>
          <button id="feedback-btn" class="feedback-button">Feedback</button>
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
      .getElementById('buy-via-facebook')
      .addEventListener('click', () => this.buyViaFacebook(item));

    document
      .getElementById('buy-via-instagram')
      .addEventListener('click', () => this.buyViaInstagram(item));

    document.getElementById('feedback-btn').addEventListener('click', () => {
      localStorage.setItem(
        'feedback_autofill',
        JSON.stringify({ name: item.name, variant: item.variant })
      );
      window.location.hash = '#/feedback';
    });
  },

  addToWishlist(item) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const alreadyInWishlist = wishlist.some(
      (wishlistItem) =>
        wishlistItem.name === item.name && wishlistItem.variant === item.variant
    );

    if (!alreadyInWishlist) {
      wishlist.push(item);
      alert('Item berhasil ditambahkan ke wishlist!');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  },

  buyViaWhatsApp(item) {
    const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER;
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

  buyViaFacebook() {
    const facebookPage = 'fitri.maldalifani.7'; // Ganti dengan username Facebook tujuan
    const facebookURL = `https://facebook.com/${facebookPage}`;

    window.open(facebookURL);
  },
};

export default Detail;
