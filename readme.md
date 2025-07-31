# Flowry Bouquet Web Application

Selamat datang di repositori aplikasi web Flowry Bouquet! Aplikasi ini adalah platform untuk mengelola dan menampilkan berbagai jenis karangan bunga, dengan fitur-fitur seperti manajemen admin, umpan balik pengguna, detail produk, FAQ, halaman landing, otentikasi pengguna (login dan registrasi), serta daftar keinginan.

## Fitur Utama

* **Admin Dashboard:**
    * `admin-bouquet.js`: Mengelola data karangan bunga (tambah, edit, hapus).
    * `admin-feedback.js`: Mengelola umpan balik dari pengguna.
* **User Interface:**
    * `detail.js`: Menampilkan detail lengkap karangan bunga.
    * `faq.js`: Halaman pertanyaan yang sering diajukan.
    * `feedback.js`: Form untuk mengirimkan umpan balik.
    * `landing-page.js`: Halaman utama/landing page aplikasi.
    * `login.js`: Halaman untuk login pengguna.
    * `registrasi.js`: Halaman untuk registrasi pengguna baru.
    * `wishlist.js`: Fitur daftar keinginan pengguna.

## Persyaratan Sistem

Pastikan Anda memiliki Node.js dan npm (Node Package Manager) terinstal di sistem Anda.

* [Node.js](https://nodejs.org/) (disarankan versi LTS)

## Cara Menjalankan Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi Flowry Bouquet di lingkungan pengembangan lokal Anda.

1.  **Clone Repositori:**
    Pertama, clone repositori ini ke mesin lokal Anda menggunakan Git:

    ```bash
    git clone https://github.com/bidwi/flowrybouquet.git
    cd <NAMA_FOLDER_PROJECT>
    ```
    *(Ganti `<NAMA_FOLDER_PROJECT>` dengan nama folder project setelah di-clone.)*

2.  **Instal Dependensi:**
    Navigasikan ke direktori project di terminal Anda dan instal semua dependensi yang diperlukan:

    ```bash
    npm install
    ```
    Perintah ini akan membaca `package.json` dan mengunduh semua paket yang dibutuhkan.

3.  **Build Project:**
    Setelah dependensi terinstal, Anda perlu membuat (build) project. Ini akan mengkompilasi file-file JavaScript Anda menjadi bundel yang siap untuk dijalankan.

    ```bash
    npm run build
    ```

4.  **Jalankan Aplikasi dalam Mode Pengembangan:**
    Untuk menjalankan aplikasi dalam mode pengembangan dengan fitur seperti hot-reloading (jika dikonfigurasi dalam project Anda) dan debugging, gunakan perintah berikut:

    ```bash
    npm run start-dev
    ```
    Biasanya, aplikasi akan berjalan di `http://localhost:9000` atau port lainnya yang tertera di output terminal Anda. Buka browser web Anda dan akses alamat tersebut.