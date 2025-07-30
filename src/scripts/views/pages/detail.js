import details from '../../data/details.json';
import supabase from '../../globals/supabaseClient';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

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

    // Selalu ambil data terbaru dari Supabase jika ada
    let query = supabase.from('flowry').select('*').eq('flower', itemName);
    if (itemVariant) query = query.eq('varian', itemVariant);
    const { data: supaData, error } = await query.single();

    if (!error && supaData) {
      // Format harga dan gambar
      const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');
      item = {
        name: supaData.flower,
        variant: supaData.varian,
        price: formatRupiah(supaData.harga),
        image: getImageUrl(supaData.flower, supaData.varian),
        description: supaData.deskripsi,
      };
    } else if (item) {
      // fallback ke details.json jika Supabase tidak ada
      item.image = getImageUrl(item.name, item.variant);
    }

    if (!item) {
      document.getElementById('detail-container').innerHTML =
        '<p class="empty-message">Item tidak ditemukan.</p>';
      return;
    }

    const detailContainer = document.getElementById('detail-container');
    detailContainer.innerHTML = `
  <div class="detail-content">
    <img class="detail-image lazyload" data-src="${item.image}" alt="${item.name}">
    <div class="detail-info">
      <h1>${item.name}</h1>
      <h2>${item.variant}</h2>
      <h3>${item.price}</h3>
      <p>${item.description}</p>
      <div class="detail-buttons">
        <button id="buy-via-instagram" class="buy-instagram">
          <img src="../../icons/instagram-brands-solid-full.svg" alt="Instagram" class="icons-detail">
        </button>
        <button id="buy-via-whatsapp" class="buy-whatsapp">
          <img src="../../icons/whatsapp-brands-solid-full.svg" alt="WhatsApp" class="icons-detail">
        </button>
        <button id="buy-via-facebook" class="buy-facebook">
          <img src="../../icons/facebook-brands-solid-full.svg" alt="Facebook" class="icons-detail">
        </button>
        <button id="buy-via-tiktok" class="buy-tiktok">
          <img src="../../icons/tiktok-brands-solid-full.svg" alt="TikTok" class="icons-detail">
        </button>
        <button id="add-to-wishlist" class="wishlist-button">Wishlist</button>
        <button id="feedback-btn" class="feedback-button">Feedback</button>
      </div>
    </div>
  </div>
  <div id="feedback-list-container" class="feedback-list"></div>
`;

    // Fetch dan render feedback
    const fetchAndRenderFeedback = async () => {
      const { data: bouquetData } = await supabase
        .from('flowry')
        .select('id')
        .eq('flower', item.name)
        .eq('varian', item.variant)
        .single();

      if (!bouquetData) return;

      const { data: feedbacks } = await supabase
        .from('feedback')
        .select('id_feedback, feedback, rating')
        .eq('id_flowry', bouquetData.id);

      const { data: files } = await supabase.storage
        .from('feedback')
        .list('', { limit: 1000 });

      const container = document.getElementById('feedback-list-container');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        container.innerHTML = `<a href="#/login"><p class="no-feedback" style="text-decoration:none">Login untuk lihat feedback. Klik di sini untuk login.</p></a>`;
        return; // Jangan render feedback kalau belum login
      }
      if (!feedbacks || feedbacks.length === 0) {
        container.innerHTML =
          '<p class="no-feedback">Belum ada feedback. Silakan tambah <a href="#/feedback" style="color: #888">feedback</a>.</p>';
        return;
      }

      const getImage = (id) => {
        const file = files?.find((f) => f.name.startsWith(id));
        return file
          ? `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/feedback/${file.name}`
          : '';
      };

      container.innerHTML = feedbacks
        .map(
          (f) => `
      <div class="feedback-card">
        <div class="feedback-img-wrapper">
          ${
            getImage(f.id_feedback)
              ? `<img data-src="${getImage(
                  f.id_feedback
                )}" class="lazyload" alt="Feedback Image" />`
              : ''
          }
        </div>
        <div class="feedback-content">
          <div class="feedback-rating">
  ${[1, 2, 3, 4, 5]
    .map((i) => {
      const filled = i <= f.rating;
      return `<img data-src="../icons/${
        filled ? 'star-filled' : 'star'
      }.png" alt="star" class="star-icon lazyload" style="width:21px;height:21px;">`;
    })
    .join('')}
</div>

          <p class="feedback-text">${f.feedback}</p>
        </div>
      </div>
    `
        )
        .join('');
    };

    fetchAndRenderFeedback();

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

    document
      .getElementById('buy-via-tiktok')
      .addEventListener('click', () => this.buyViaTikTok(item));

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

  buyViaTikTok() {
    const tiktokUsername = 'flowry.bouquet'; // Ganti dengan username TikTok tujuan
    const tiktokURL = `https://www.tiktok.com/@${tiktokUsername}`;

    window.open(tiktokURL);
  },

  buyViaFacebook() {
    const facebookPage = 'fitri.maldalifani.7'; // Ganti dengan username Facebook tujuan
    const facebookURL = `https://facebook.com/${facebookPage}`;

    window.open(facebookURL);
  },
};

export default Detail;
