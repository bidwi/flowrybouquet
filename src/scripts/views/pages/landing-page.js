import details from '../../data/details.json';

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

    const cardsMarkup = details
      .map((item) =>
        this.createCard(item.name, item.variant, item.price, item.image)
      )
      .join('');

    cardsContainer.innerHTML = cardsMarkup;

    document.querySelectorAll('.card-wishlist').forEach((card) => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-name');
        window.location.hash = `#/detail/${encodeURIComponent(name)}`;
      });
    });
  },

  createCard(name, variant, price, image) {
    return `
      <article class="card-wishlist" data-name="${name}">
        <section>
          <img class="image-card" src="${image}" alt="${name}">
          <article class="container">
            <h4 class="judul-buket"><b>${name}</b></h4> 
            <p class="varian-buket">Varian: ${variant}</p>
            <button type="button" class="button-card">${price}</button>
          </article>
        </section>
      </article>
    `;
  },
};

export default LandingPage;
