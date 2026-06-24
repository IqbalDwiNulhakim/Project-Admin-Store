# 🛒 Admin Store — Sistem Manajemen Pembelian Toko

Aplikasi admin berbasis web untuk mengelola **produk**, **stok**, dan **transaksi pembelian** toko. Dibangun dengan Node.js + Express.js + EJS + SQLite (sql.js).

---

## ✨ Fitur Utama

- **Dashboard** — statistik real-time: total produk, pembelian aktif, dibatalkan, total pendapatan, dan peringatan stok menipis
- **Manajemen Produk** — tambah, edit, hapus produk; 10 produk IT sudah tersedia sebagai data awal
- **Manajemen Stok** — lihat stok semua produk, update stok (atur langsung / tambah / kurangi) melalui modal
- **Input Pembelian** — form dengan kalkulasi harga otomatis, validasi stok, nomor invoice otomatis (INV-00001, dst.)
- **Detail & Cancel Pembelian** — lihat invoice lengkap, batalkan transaksi dengan alasan; stok dikembalikan otomatis saat dibatalkan
- **Filter & Pencarian** — filter pembelian berdasarkan status dan pencarian nama pelanggan / nomor invoice

---

## 📁 Struktur Proyek

```
project1-admin-store/
│
├── app.js                      # Entry point — konfigurasi Express & route
│
├── db/
│   └── database.js             # Inisialisasi DB, schema SQL, seed 10 produk
│
├── routes/
│   ├── dashboard.js            # GET /  — halaman dashboard
│   ├── products.js             # GET/POST /products — CRUD produk
│   ├── stock.js                # GET/POST /stock — manajemen stok
│   └── purchases.js            # GET/POST /purchases — input & cancel pembelian
│
├── views/
│   ├── partials/
│   │   ├── header.ejs          # Layout: sidebar + topbar
│   │   └── footer.ejs          # Layout: penutup HTML + script
│   ├── dashboard.ejs
│   ├── products/
│   │   ├── index.ejs           # Daftar produk
│   │   └── form.ejs            # Form tambah / edit produk
│   ├── stock/
│   │   └── index.ejs           # Tabel stok + modal update
│   └── purchases/
│       ├── index.ejs           # Daftar pembelian + filter + modal cancel
│       ├── form.ejs            # Form input pembelian baru
│       └── detail.ejs          # Detail invoice + tombol cancel
│
├── public/
│   └── css/style.css           # Stylesheet custom
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Skema Database

Database menggunakan **SQLite** via `sql.js` (pure JavaScript — tidak memerlukan instalasi binary tambahan). File database disimpan di `db/store.db` dan dibuat **otomatis** saat pertama kali server dijalankan.

### Tabel `products`

```sql
CREATE TABLE products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL,
  price       REAL    NOT NULL,
  description TEXT,
  created_at  TEXT    DEFAULT (datetime('now','localtime'))
);
```

### Tabel `stock`

```sql
CREATE TABLE stock (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT    DEFAULT (datetime('now','localtime'))
);
```

### Tabel `purchases`

```sql
CREATE TABLE purchases (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no    TEXT    NOT NULL UNIQUE,   -- Format: INV-00001
  product_id    INTEGER NOT NULL REFERENCES products(id),
  quantity      INTEGER NOT NULL,
  total_price   REAL    NOT NULL,
  customer_name TEXT    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'active',  -- 'active' | 'cancelled'
  notes         TEXT,
  created_at    TEXT    DEFAULT (datetime('now','localtime')),
  cancelled_at  TEXT,
  cancel_reason TEXT
);
```

### Relasi Tabel

```
products ─── (1:1) ──► stock
products ─── (1:N) ──► purchases
```

### Data Awal (Seed Otomatis)

10 produk IT/elektronik berikut stoknya langsung tersedia saat pertama run:

| # | Produk | Kategori | Harga | Stok Awal |
|---|--------|----------|-------|-----------|
| 1 | Laptop ASUS VivoBook 14 | Elektronik | Rp 7.500.000 | 12 |
| 2 | Mouse Wireless Logitech M185 | Aksesoris | Rp 125.000 | 45 |
| 3 | Keyboard Mechanical Rexus | Aksesoris | Rp 450.000 | 28 |
| 4 | Monitor LG 24 inch FHD | Elektronik | Rp 2.200.000 | 8 |
| 5 | Flash Drive SanDisk 64GB | Penyimpanan | Rp 85.000 | 100 |
| 6 | Headset Gaming Rexus HX20 | Aksesoris | Rp 275.000 | 22 |
| 7 | Webcam Logitech C920 | Aksesoris | Rp 1.100.000 | 15 |
| 8 | SSD External WD 1TB | Penyimpanan | Rp 950.000 | 19 |
| 9 | Printer Canon PIXMA G2020 | Elektronik | Rp 1.350.000 | 7 |
| 10 | UPS APC BX625CI-MS | Elektronik | Rp 1.200.000 | 11 |

---

## 🖥️ Prasyarat

| Software | Versi Minimum | Cara Cek |
|----------|--------------|----------|
| Node.js  | v18+         | `node -v` |
| npm      | v8+          | `npm -v` |

> Download Node.js: https://nodejs.org (pilih versi LTS)

---

## 🚀 Cara Menjalankan

### 1. Clone repositori

```bash
git clone https://github.com/USERNAME/project1-admin-store.git
cd project1-admin-store
```

### 2. Install dependensi

```bash
npm install
```

Dependensi yang diinstall:

| Package | Fungsi |
|---------|--------|
| `express` | Web framework |
| `ejs` | Template engine (render HTML di server) |
| `sql.js` | SQLite engine — pure JavaScript, tanpa binary native |
| `body-parser` | Parse data form HTML |
| `method-override` | Support DELETE dari form HTML |

### 3. Jalankan server

```bash
npm start
```

Output terminal yang diharapkan:

```
✅ Database ready
🚀 Server running at http://localhost:3000
```

> Database `db/store.db` dan seed 10 produk dibuat **otomatis**. Tidak ada setup tambahan.

### 4. Buka browser

```
http://localhost:3000
```

---

## 📖 Panduan Penggunaan

### 🏠 Dashboard (`/`)

Halaman utama menampilkan ringkasan toko:
- **4 kartu statistik** — total produk, pembelian aktif, dibatalkan, total pendapatan
- **Banner peringatan** muncul jika ada produk dengan stok ≤ 5 unit
- **Tabel 5 transaksi terbaru**

---

### 📦 Produk (`/products`)

| Aksi | Langkah |
|------|---------|
| Lihat semua produk | Klik menu **Produk** di sidebar |
| Tambah produk baru | Klik **"Tambah Produk"** → isi nama, kategori, harga, stok awal, deskripsi → **"Tambah Produk"** |
| Edit produk | Klik ikon ✏️ di baris produk → ubah data → **"Simpan Perubahan"** |
| Hapus produk | Klik ikon 🗑️ → konfirmasi → produk + stok + riwayat pembeliannya terhapus |

---

### 📊 Stok (`/stock`)

Tabel menampilkan seluruh produk diurutkan dari stok paling sedikit (paling kritis di atas).

**Cara update stok:**
1. Klik tombol **"Update"** di baris produk
2. Pilih tipe update:
   - **Set** → atur stok ke angka tertentu (misal: set ke 50, stok jadi 50)
   - **Tambah** → tambah dari nilai saat ini (misal: stok 20 + 10 = 30)
   - **Kurangi** → kurangi dari nilai saat ini, tidak bisa di bawah 0
3. Masukkan jumlah → klik **"Simpan"**

**Indikator warna stok:**
- 🟢 Hijau — stok cukup (> 15 unit)
- 🟡 Kuning — stok menipis (6–15 unit)
- 🔴 Merah — stok kritis (≤ 5 unit) atau habis

---

### 🛒 Pembelian (`/purchases`)

#### Input Pembelian Baru

1. Klik menu **Pembelian** di sidebar → **"Input Pembelian"**
2. Pilih produk dari dropdown:
   - Harga satuan dan stok tersedia langsung tampil di form
3. Masukkan jumlah beli — total harga terhitung otomatis
4. Isi nama pelanggan (wajib) dan catatan (opsional)
5. Klik **"Simpan Pembelian"**

> ✅ Nomor invoice dibuat otomatis (format `INV-00001`, `INV-00002`, dst.)
> ✅ Stok produk berkurang otomatis setelah transaksi tersimpan
> ❌ Sistem menolak jika jumlah beli melebihi stok tersedia

#### Lihat Detail Invoice

Klik ikon 👁️ di baris pembelian untuk melihat halaman invoice lengkap berisi produk, jumlah, harga satuan, total, dan catatan.

#### Batalkan Pembelian

1. Dari daftar atau halaman detail, klik ikon 🚫 **"Batalkan"**
2. Modal konfirmasi muncul → tulis alasan pembatalan (wajib)
3. Klik **"Konfirmasi Batalkan"**

> ✅ Stok produk **dikembalikan otomatis** saat pembelian dibatalkan
> ❌ Pembatalan bersifat permanen — tidak bisa diubah kembali ke aktif

#### Filter & Pencarian

Di halaman daftar pembelian, tersedia:
- **Dropdown status** — tampilkan Semua / Aktif / Dibatalkan
- **Kolom pencarian** — cari berdasarkan nomor invoice atau nama pelanggan

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| View Engine | EJS (Embedded JavaScript Templates) |
| Database | SQLite via sql.js (pure JavaScript) |
| Styling | CSS custom — tanpa framework CSS eksternal |
| Icons | Font Awesome 6 (CDN) |

---

## 🛠️ Troubleshooting

**❌ Error saat `npm install` (node-gyp / build error)**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

**❌ Port 3000 sudah digunakan**
```bash
# Jalankan di port lain
PORT=3001 npm start
```

**❌ Data ingin direset ke kondisi awal**
```bash
# Hapus file database — akan dibuat ulang beserta seed data saat server dijalankan
rm db/store.db
npm start
```

---

## 👨‍💻 Author

**Muhammad Iqbal**
Informatika · Universitas Jenderal Achmad Yani
#   P r o j e c t  
 