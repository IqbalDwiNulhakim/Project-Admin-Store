const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Routes
const dashboardRouter = require('./routes/dashboard');
const productRouter = require('./routes/products');
const stockRouter = require('./routes/stock');
const purchaseRouter = require('./routes/purchases');

app.use('/', dashboardRouter);
app.use('/products', productRouter);
app.use('/stock', stockRouter);
app.use('/purchases', purchaseRouter);

// Start server after DB init
(async () => {
  await getDb();
  console.log('✅ Database ready');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
