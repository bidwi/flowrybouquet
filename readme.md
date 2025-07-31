#  Website Flowry Bouquet

Selamat datang di website Flowry Bouquet! Sebuah platform yang digunakan untuk memberi feedback dan informasi seputar buket yang kamu sukai. Website ini memiliki berbagai fitur, seperti kelola data buket/feedback, kirim review/tanggapan buket tertentu, detail produk, FAQ, otentikasi pengguna (login dan registrasi), dan juga wishlist.

## Fitur Utama

* **Admin Dashboard:**
    * `admin-bouquet.js`: Mengelola data buket (tambah, edit, hapus).
    * `admin-feedback.js`: Mengelola feedback dari pengguna.
* **User Interface:**
    * `detail.js`: Menampilkan detail buket.
    * `faq.js`: Halaman pertanyaan yang sering diajukan.
    * `feedback.js`: Form untuk mengirimkan ulasan/tanggapan.
    * `landing-page.js`: Halaman utama website.
    * `login.js`: Halaman untuk login pengguna.
    * `registrasi.js`: Halaman untuk registrasi pengguna baru.
    * `wishlist.js`: Fitur daftar keinginan pengguna.

## Persyaratan Sistem

Pastikan Anda memiliki Node.js dan npm (Node Package Manager) terinstal di sistem Anda.

* [Node.js](https://nodejs.org/)

## Cara Menjalankan Website Secara Lokal

Ikuti langkah-langkah di bawah ini.

1.  **Clone Repositori:**
    Pertama, clone repositori ini menggunakan Git:

    ```bash
    git clone https://github.com/bidwi/flowrybouquet.git
    cd <NAMA_FOLDER_PROJECT>
    ```
    *(Ganti `<NAMA_FOLDER_PROJECT>` dengan nama folder project setelah di-clone.)*

2.  **Instal Dependensi:**
    Buka terminal Anda dan instal semua dependensi yang diperlukan:

    ```bash
    npm install
    ```
    Perintah ini akan membaca `package.json` dan mengunduh semua paket yang dibutuhkan.

3.  **Build Project:**
    Setelah dependensi terinstal, Anda perlu build project ini. Ini akan menggabungkan file-file JavaScript Anda menjadi bundel yang siap untuk dijalankan.

    ```bash
    npm run build
    ```

4.  **Jalankan Website dalam Mode Development:**
    Untuk menjalankan website dalam mode development, gunakan perintah berikut:

    ```bash
    npm run start-dev
    ```
    Biasanya, website akan berjalan di `http://localhost:9000` atau port lainnya yang tertera di output terminal Anda. Buka browser web Anda dan akses alamat tersebut.