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
    `;
  },

  async afterRender() {
    const cardsContainer = document.getElementById('cards-container');

    // Menghasilkan kartu dinamis dari details.json
    const cardsMarkup = details
      .map((item) =>
        this.createCard(item.name, item.variant, item.price, item.image)
      )
      .join('');

    cardsContainer.innerHTML = cardsMarkup;

    // Tambahkan event listener untuk navigasi detail
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
