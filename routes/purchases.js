const express = require('express');
const router = express.Router();
const { query, run } = require('../db/database');

function generateInvoice() {
  const count = query(`SELECT COUNT(*) as c FROM purchases`)[0].c;
  return `INV-${String(count + 1).padStart(5, '0')}`;
}

router.get('/', (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT p.*, pr.name as product_name, pr.category
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    WHERE 1=1
  `;
  const params = [];
  if (status && status !== 'all') { sql += ` AND p.status = ?`; params.push(status); }
  if (search) { sql += ` AND (p.customer_name LIKE ? OR p.invoice_no LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
  sql += ` ORDER BY p.created_at DESC`;

  const purchases = query(sql, params);
  res.render('purchases/index', { title: 'Pembelian', active: 'purchases', purchases, filter: { status: status || 'all', search: search || '' } });
});

router.get('/add', (req, res) => {
  const products = query(`
    SELECT p.*, s.quantity as stock
    FROM products p
    JOIN stock s ON s.product_id = p.id
    WHERE s.quantity > 0
    ORDER BY p.name
  `);
  res.render('purchases/form', { title: 'Input Pembelian', active: 'purchases', products, error: null });
});

router.post('/add', (req, res) => {
  const { product_id, quantity, customer_name, notes } = req.body;
  const qty = parseInt(quantity);

  const product = query(`SELECT p.*, s.quantity as stock FROM products p JOIN stock s ON s.product_id = p.id WHERE p.id = ?`, [product_id])[0];
  if (!product) return res.redirect('/purchases/add');

  if (qty > product.stock) {
    const products = query(`SELECT p.*, s.quantity as stock FROM products p JOIN stock s ON s.product_id = p.id WHERE s.quantity > 0 ORDER BY p.name`);
    return res.render('purchases/form', {
      title: 'Input Pembelian', active: 'purchases', products,
      error: `Stok tidak cukup. Stok tersedia: ${product.stock}`
    });
  }

  const invoice = generateInvoice();
  const total = product.price * qty;

  run(`INSERT INTO purchases (invoice_no, product_id, quantity, total_price, customer_name, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [invoice, product_id, qty, total, customer_name, notes || '']);

  run(`UPDATE stock SET quantity = quantity - ?, updated_at = datetime('now','localtime') WHERE product_id = ?`,
    [qty, product_id]);

  res.redirect('/purchases');
});

router.get('/detail/:id', (req, res) => {
  const purchase = query(`
    SELECT p.*, pr.name as product_name, pr.category, pr.price as unit_price
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    WHERE p.id = ?
  `, [req.params.id])[0];
  if (!purchase) return res.redirect('/purchases');
  res.render('purchases/detail', { title: 'Detail Pembelian', active: 'purchases', purchase });
});

router.post('/cancel/:id', (req, res) => {
  const { cancel_reason } = req.body;
  const purchase = query(`SELECT * FROM purchases WHERE id = ? AND status = 'active'`, [req.params.id])[0];
  if (!purchase) return res.redirect('/purchases');

  run(`UPDATE purchases SET status='cancelled', cancelled_at=datetime('now','localtime'), cancel_reason=? WHERE id=?`,
    [cancel_reason || 'Dibatalkan oleh admin', req.params.id]);

  // Restore stock
  run(`UPDATE stock SET quantity = quantity + ?, updated_at = datetime('now','localtime') WHERE product_id = ?`,
    [purchase.quantity, purchase.product_id]);

  res.redirect('/purchases');
});

module.exports = router;
