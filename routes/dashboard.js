const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

router.get('/', (req, res) => {
  const totalProducts = query(`SELECT COUNT(*) as count FROM products`)[0].count;
  const totalPurchases = query(`SELECT COUNT(*) as count FROM purchases WHERE status = 'active'`)[0].count;
  const cancelledPurchases = query(`SELECT COUNT(*) as count FROM purchases WHERE status = 'cancelled'`)[0].count;
  const totalRevenue = query(`SELECT SUM(total_price) as total FROM purchases WHERE status = 'active'`)[0].total || 0;
  const lowStock = query(`SELECT COUNT(*) as count FROM stock WHERE quantity <= 5`)[0].count;

  const recentPurchases = query(`
    SELECT p.*, pr.name as product_name
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    ORDER BY p.created_at DESC
    LIMIT 5
  `);

  res.render('dashboard', {
    title: 'Dashboard',
    active: 'dashboard',
    stats: { totalProducts, totalPurchases, cancelledPurchases, totalRevenue, lowStock },
    recentPurchases
  });
});

module.exports = router;
