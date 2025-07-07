-- Tambahkan 5 data dari details.json ke tabel flowry, hanya yang belum ada (cek kombinasi flower+varian)
-- Data yang sudah ada: 
-- 1. Bouquet Bunga | Mawar
-- 2. Bouquet Coklat | Purple
-- 3. Bouquet Bunga | Black & White

INSERT INTO flowry (flower, varian, harga, deskripsi)
VALUES
  ('Bouquet Snack', 'Stik Wafer', 150000, 'Nikmati sensasi menyantap stik wafer berkualitas yang dipilih khusus untuk menjadi isi dalam bouquet snack ini. Bouquet ini cocok untuk berbagai acara, mulai dari perayaan kecil hingga pesta besar, memberikan sentuhan manis dengan tekstur wafer yang renyah dan lezat.'),
  ('Bouquet Boneka', 'Teddy Bear', 100000, 'Bouquet yang unik ini menggabungkan boneka teddy bear lucu dengan bunga yang indah, menciptakan hadiah yang sempurna untuk pasangan atau wisudawan. Keistimewaan bouquet ini adalah kombinasi antara kelembutan boneka dan keindahan bunga yang menyentuh hati penerimanya.'),
  ('Bouquet Kemasan', 'Susu Coklat Saset', 120000, 'Dengan kombinasi susu coklat saset dalam bouquet ini, kamu bisa memberikan kejutan yang menyenangkan bagi orang tersayang. Bouquet ini dipenuhi dengan kemasan saset susu coklat yang bisa dinikmati kapan saja, memberikan sentuhan manis di setiap kesempatan.'),
  ('Bouquet Polaroid', 'Polaroid & Bunga', 100000, 'Bouquet ini menggabungkan keindahan bunga dengan kenangan manis dalam bentuk polaroid. Setiap polaroid yang disertakan memberikan kesan pribadi, menjadikannya pilihan tepat untuk memberi hadiah yang penuh makna dan kenangan tak terlupakan.'),
  ('Bouquet Uang', 'Uang Lima Ribu', 100000, 'Bouquet ini mengandung uang pecahan Rp5.000 yang disusun dengan cermat, memberikan hadiah yang praktis namun tetap berkesan. Cocok untuk berbagai acara, bouquet uang ini akan memberi kebahagiaan dan manfaat langsung bagi penerimanya.');
-- Pastikan setelah insert, upload gambar ke bucket "photo" dengan nama file:
-- bouquet-snack-stik-wafer
-- bouquet-boneka-teddy-bear
-- bouquet-kemasan-susu-coklat-saset
-- bouquet-polaroid-polaroid-&-bunga
-- bouquet-uang-uang-lima-ribu
-- (semua lowercase, spasi jadi -, sesuai logic getImageUrl di landing page)
