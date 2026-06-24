const express = require('express');
const router = express.Router();
const { query, run } = require('../db/database');

router.get('/', (req, res) => {
  const products = query(`
    SELECT p.*, s.quantity as stock
    FROM products p
    LEFT JOIN stock s ON s.product_id = p.id
    ORDER BY p.id ASC
  `);
  res.render('products/index', { title: 'Produk', active: 'products', products });
});

router.get('/add', (req, res) => {
  res.render('products/form', { title: 'Tambah Produk', active: 'products', product: null, error: null });
});

router.post('/add', (req, res) => {
  const { name, category, price, description, initial_stock } = req.body;
  if (!name || !category || !price) {
    return res.render('products/form', {
      title: 'Tambah Produk', active: 'products', product: req.body,
      error: 'Nama, kategori, dan harga wajib diisi.'
    });
  }
  run(`INSERT INTO products (name, category, price, description) VALUES (?, ?, ?, ?)`,
    [name, category, parseFloat(price), description]);
  const newProduct = query(`SELECT * FROM products ORDER BY id DESC LIMIT 1`)[0];
  run(`INSERT INTO stock (product_id, quantity) VALUES (?, ?)`,
    [newProduct.id, parseInt(initial_stock) || 0]);
  res.redirect('/products');
});

router.get('/edit/:id', (req, res) => {
  const product = query(`SELECT p.*, s.quantity as stock FROM products p LEFT JOIN stock s ON s.product_id = p.id WHERE p.id = ?`, [req.params.id])[0];
  if (!product) return res.redirect('/products');
  res.render('products/form', { title: 'Edit Produk', active: 'products', product, error: null });
});

router.post('/edit/:id', (req, res) => {
  const { name, category, price, description } = req.body;
  run(`UPDATE products SET name=?, category=?, price=?, description=? WHERE id=?`,
    [name, category, parseFloat(price), description, req.params.id]);
  res.redirect('/products');
});

router.post('/delete/:id', (req, res) => {
  run(`DELETE FROM purchases WHERE product_id = ?`, [req.params.id]);
  run(`DELETE FROM stock WHERE product_id = ?`, [req.params.id]);
  run(`DELETE FROM products WHERE id = ?`, [req.params.id]);
  res.redirect('/products');
});

module.exports = router;
