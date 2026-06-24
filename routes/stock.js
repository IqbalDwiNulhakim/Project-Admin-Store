const express = require('express');
const router = express.Router();
const { query, run } = require('../db/database');

router.get('/', (req, res) => {
  const stocks = query(`
    SELECT s.*, p.name as product_name, p.category, p.price
    FROM stock s
    JOIN products p ON s.product_id = p.id
    ORDER BY s.quantity ASC
  `);
  res.render('stock/index', { title: 'Stok Produk', active: 'stock', stocks });
});

router.post('/update/:id', (req, res) => {
  const { quantity, action } = req.body;
  const current = query(`SELECT * FROM stock WHERE product_id = ?`, [req.params.id])[0];
  if (!current) return res.redirect('/stock');

  let newQty = current.quantity;
  if (action === 'set') newQty = parseInt(quantity);
  else if (action === 'add') newQty = current.quantity + parseInt(quantity);
  else if (action === 'reduce') newQty = Math.max(0, current.quantity - parseInt(quantity));

  run(`UPDATE stock SET quantity=?, updated_at=datetime('now','localtime') WHERE product_id=?`,
    [newQty, req.params.id]);
  res.redirect('/stock');
});

module.exports = router;
