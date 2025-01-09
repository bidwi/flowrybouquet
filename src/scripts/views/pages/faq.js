const Faq = {
  async render() {
    return `
        <h1 class="faq-judul">Frequently Asked Questions</h1>
        <div class="faq-container">
          <div class="card-faq">
            <h3>Apa Itu Flowry Bouquet?</h3>
            <p class="faq-deskripsi">Flowry Bouquet adalah layanan pembuatan buket dengan berbagai variasi, seperti buket snack, buket uang, dan buket bunga.</p>
          </div>
          <div class="card-faq">
            <h3>Apakah Ada Gratis Ongkir?</h3>
            <p class="faq-deskripsi">Kami menyediakan gratis ongkir untuk setiap pemesanan buket di atas Rp100.000.</p>
          </div>
          <div class="card-faq">
            <h3>Bagaimana Cara Pemesanan?</h3>
            <p class="faq-deskripsi">Pemesanan bisa dilakukan melalui media sosial kami atau langsung melalui website ini.</p>
          </div>
        </div>
      `;
  },

  async afterRender() {
    // Fungsi ini akan dipanggil setelah render()
  },
};

export default Faq;
