# Admin Store - Sistem Manajemen Pembelian Toko

Aplikasi admin berbasis web untuk mengelola produk, stok, dan transaksi pembelian toko. Aplikasi ini dibangun menggunakan Node.js, Express.js, EJS, dan SQLite (sql.js).

Database menggunakan file lokal yang akan dibuat secara otomatis beserta 10 data produk siap pakai saat pertama kali server dijalankan.

---

## Fitur Utama

- Dashboard: Menampilkan ringkasan total produk, pembelian aktif, transaksi dibatalkan, total pendapatan, serta peringatan otomatis jika ada stok barang yang menipis.
- Manajemen Produk: Fitur lengkap untuk menambah, mengubah, dan menghapus data produk toko.
- Manajemen Stok: Memantau jumlah stok secara real-time dengan opsi pembaruan (atur langsung, tambah, atau kurangi) melalui sistem modal jendela sembul.
- Input Pembelian: Form transaksi dengan kalkulasi total harga otomatis, validasi batas maksimum stok, dan pembuatan nomor invoice otomatis (INV-00001, dst.).
- Detail & Pembatalan Transaksi: Halaman invoice lengkap beserta fitur pembatalan transaksi. Jika transaksi dibatalkan, stok barang akan otomatis dikembalikan ke gudang.
- Filter & Pencarian: Memudahkan pencarian data transaksi berdasarkan nomor invoice, nama pelanggan, atau status pembelian.

---

## Skema Database

Aplikasi menggunakan SQLite melalui library sql.js yang berjalan murni berbasis JavaScript, sehingga Anda tidak perlu mengunduh atau mengonfigurasi binary software database tambahan di komputer.

1. Tabel products
   Menyimpan informasi utama produk seperti id, nama, kategori, harga, deskripsi, dan waktu pembuatan.

2. Tabel stock
   Menyimpan jumlah stok yang terhubung ke tabel produk lewat product_id.

3. Tabel purchases
   Menyimpan data transaksi termasuk nomor invoice unik, detail produk, jumlah beli, nama pembeli, total harga, status transaksi, hingga alasan pembatalan.

Relasi Antar Tabel:
- Satu produk terhubung ke satu data stok (1:1).
- Satu produk bisa memiliki banyak catatan pembelian (1:N).

---

## Prasyarat Sistem

1. Node.js (Minimal versi 18)
2. npm (Minimal versi 8)

---

## Panduan Instalasi dan Menjalankan

1. Clone repositori ini ke komputer Anda:
   git clone https://github.com/USERNAME/project1-admin-store.git
   cd project1-admin-store

2. Install semua dependensi yang diperlukan:
   npm install

3. Jalankan server aplikasi:
   npm start

4. Buka browser dan akses alamat berikut:
   http://localhost:3000

---

## Panduan Penggunaan Sistem Stok

Tabel stok akan mengurutkan produk dari jumlah paling sedikit di posisi paling atas agar memudahkan pemantauan.

Warna Indikator Stok:
- Hijau: Stok aman (Lebih dari 15 unit).
- Kuning: Stok menipis (Antara 6 sampai 15 unit).
- Merah: Stok kritis atau habis (5 unit atau kurang).

Cara Update Stok:
1. Masuk ke menu Stok di sidebar, lalu klik tombol Update pada produk yang dipilih.
2. Pilih metode pembaruan:
   - Set: Mengubah stok langsung ke angka yang dimasukkan.
   - Tambah: Menambahkan jumlah baru ke stok yang sudah ada.
   - Kurangi: Mengurangi stok berjalan (sistem menolak jika hasil pengurangan di bawah angka 0).
3. Masukkan jumlah angka lalu klik Simpan.

---

## Solusi Masalah (Troubleshooting)

- Error saat menjalankan "npm install":
  Hapus folder node_modules dan file package-lock.json terlebih dahulu dengan perintah "rm -rf node_modules package-lock.json", lalu jalankan kembali perintah "npm install".

- Port 3000 sudah digunakan aplikasi lain:
  Anda bisa menjalankan aplikasi di port lain secara manual dengan mengetik perintah "PORT=3001 npm start" di terminal Anda.

- Ingin mereset ulang seluruh data ke kondisi awal:
  Matikan server, hapus file database di dalam folder db dengan perintah "rm db/store.db", lalu jalankan kembali server dengan "npm start". Sistem akan membuat ulang file database kosong beserta 10 data produk bawaan.

---

## Penulis

Iqbal Dwi Nulhakim
