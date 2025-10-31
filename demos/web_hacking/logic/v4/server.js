const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // malformed JSON
    return res.status(400).json({ success: false, message: 'Invalid JSON' });
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Simple session setup (demo only)
app.use(session({
  secret: 'demo-secret-not-for-prod',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure:true requires https
}));

let bobBalance = 100.00;
function toMoney(x) { return Math.round(x * 100) / 100; }

// Product catalog
const PRODUCTS = {
  laptop: { name: 'Laptop', unitPrice: 5000 },
  pencil: { name: 'Pencil', unitPrice: 1 },
};

// ===========================
// Add-to-cart endpoint
// Stores items in server-side session
// ===========================
app.post('/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Math.max(1, Number(quantity) || 1);

  if (!PRODUCTS[productId] || !Number.isInteger(qty)) {
    return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
  }

  req.session.cart = req.session.cart || [];
  req.session.cart.push({ productId, quantity: qty });

  return res.json({ success: true, cart: req.session.cart });
});

app.get('/cart/server', (req, res) => {
  res.json({ cart: req.session.cart || [] });
});

app.get('/cart/order-confirmation', (req, res) => {
  const orderConfirmed = req.query['order-confirmed'];
  if (orderConfirmed !== 'true') {
    return res.status(400).send('<p>Invalid order confirmation request.</p>');
  }

  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.send('<p>Your cart is empty (session cart has no items).</p>');
  }

  let total = 0;
  const lines = cart.map(it => {
    const p = PRODUCTS[it.productId] || { name: 'Unknown', unitPrice: 0 };
    const unitPrice = Number(p.unitPrice) || 0;
    const subtotal = unitPrice * it.quantity;
    total += subtotal;
    return `<li>${it.quantity} × ${p.name} — $${unitPrice.toFixed(2)} each (subtotal $${subtotal.toFixed(2)})</li>`;
  });

  return res.send(`
    <h2>Order Confirmation</h2>
    <p>Thank you for your order, Bob!</p>
    <h3>Order details</h3>
    <ul>
      ${lines.join('')}
    </ul>
    <p><strong>Total: $${total.toFixed(2)}</strong></p>
    <p><strong>Updated balance: $${bobBalance.toFixed(2)}</strong></p>
    <p><a href="/">Back to shop</a></p>
  `);
});

app.post('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  let total = 0;

  const itemsForResponse = cart.map(it => {
    const p = PRODUCTS[it.productId] || { name: 'Unknown', unitPrice: 0 };
    const unitPrice = Number(p.unitPrice) || 0;
    const subtotal = unitPrice * it.quantity;
    total += subtotal;
    return { itemName: p.name, quantity: it.quantity, unitPrice };
  });

  total = toMoney(total);

  if (bobBalance >= total) {
    bobBalance = toMoney(bobBalance - total);
    return res.json({
      success: true,
      balance: bobBalance,
      total,
      orderId: 'ORD' + Math.floor(Math.random() * 1e8).toString().padStart(8, '0'),
      items: itemsForResponse
    });
  } else {
    return res.json({
      success: false,
      balance: bobBalance,
      total,
      items: itemsForResponse,
      message: 'Insufficient funds'
    });
  }
});

// ===========================
// Start server
// ===========================
const PORT = 3000;
app.listen(PORT, () => console.log(`Demo lab server running on http://localhost:${PORT}`));
