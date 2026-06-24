const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'store.db');

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    initSchema(db);
    saveDb();
  }

  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT NOT NULL UNIQUE,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      customer_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      cancelled_at TEXT,
      cancel_reason TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Seed 10 products
  const products = [
    ['Laptop ASUS VivoBook 14', 'Elektronik', 7500000, 'Intel Core i5, RAM 8GB, SSD 512GB'],
    ['Mouse Wireless Logitech M185', 'Aksesoris', 125000, 'Mouse wireless 2.4GHz, baterai AA'],
    ['Keyboard Mechanical Rexus', 'Aksesoris', 450000, 'Blue switch, RGB backlight, full size'],
    ['Monitor LG 24 inch FHD', 'Elektronik', 2200000, 'IPS panel, 75Hz, HDMI & VGA'],
    ['Flash Drive SanDisk 64GB', 'Penyimpanan', 85000, 'USB 3.0, kecepatan transfer tinggi'],
    ['Headset Gaming Rexus HX20', 'Aksesoris', 275000, 'Surround 7.1, mic noise cancelling'],
    ['Webcam Logitech C920', 'Aksesoris', 1100000, 'Full HD 1080p, autofocus, stereo mic'],
    ['SSD External WD 1TB', 'Penyimpanan', 950000, 'USB-C, kecepatan baca 540MB/s'],
    ['Printer Canon PIXMA G2020', 'Elektronik', 1350000, 'Ink tank printer, cetak hitam & warna'],
    ['UPS APC BX625CI-MS', 'Elektronik', 1200000, 'Kapasitas 625VA, proteksi lonjakan arus'],
  ];

  const stockQty = [12, 45, 28, 8, 100, 22, 15, 19, 7, 11];

  products.forEach(([name, category, price, description], i) => {
    db.run(
      `INSERT INTO products (name, category, price, description) VALUES (?, ?, ?, ?)`,
      [name, category, price, description]
    );
    db.run(
      `INSERT INTO stock (product_id, quantity) VALUES (?, ?)`,
      [i + 1, stockQty[i]]
    );
  });

  // Sample purchases
  const samplePurchases = [
    ['INV-0001', 1, 1, 7500000, 'Budi Santoso', 'active', ''],
    ['INV-0002', 2, 3, 375000, 'Siti Rahayu', 'active', ''],
    ['INV-0003', 4, 1, 2200000, 'Ahmad Fauzi', 'cancelled', 'Produk tidak sesuai pesanan'],
  ];

  samplePurchases.forEach(([inv, pid, qty, total, cust, status, reason]) => {
    db.run(
      `INSERT INTO purchases (invoice_no, product_id, quantity, total_price, customer_name, status, cancel_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [inv, pid, qty, total, cust, status, reason]
    );
  });
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

module.exports = { getDb, query, run, saveDb };
