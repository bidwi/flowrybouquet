import supabase from '../../globals/supabaseClient';

const AdminFeedback = {
  async render() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.hash = '#/login';
      return '';
    }

    return `
      <main class="bouquet-page">
        <div class="bouquet-header">
          <h2 class="bouquet-title">Data Feedback</h2>
        </div>
        <table class="admin-feedback-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Buket</th>
              <th>Varian Buket</th>
              <th>Feedback</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody id="admin-feedback-table-body"></tbody>
        </table>
      </main>
    `;
  },

  async afterRender() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    // Example: fetch feedback data from 'feedback' table
    const { data: feedbacks, error } = await supabase
      .from('feedback')
      .select('gambar, nama_buket, varian_buket, feedback, rating');

    const tableBody = document.getElementById('admin-feedback-table-body');

    if (!tableBody) return;

    if (error || !feedbacks || feedbacks.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada data feedback.</td></tr>`;
    } else {
      tableBody.innerHTML = feedbacks
        .map((item) => {
          // If gambar is a file name, adjust the URL as needed
          const imageUrl = item.gambar
            ? `https://agrkvdjeigkdgdjapvuo.supabase.co/storage/v1/object/public/photo/${item.gambar}`
            : '';
          return `
            <tr>
              <td>
                <div class="admin-feedback-img-center">
                  <img src="${imageUrl}" alt="${
            item.nama_buket || ''
          }" class="admin-feedback-table-img" />
                </div>
              </td>
              <td>${item.nama_buket || ''}</td>
              <td>${item.varian_buket || ''}</td>
              <td>${item.feedback || ''}</td>
              <td>${item.rating || ''}</td>
            </tr>
          `;
        })
        .join('');
    }
  },
};

export default AdminFeedback;
