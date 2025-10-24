// server_v2.js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let bobBalance = 100.00;

function toMoney(x) { return Math.round(x * 100) / 100; }

// Product catalog
const PRODUCTS = {
  laptop: { name: 'Laptop', unitPrice: 5000 },
  pencil: { name: 'Pencil', unitPrice: 1 },
};

function generateOrderId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

app.post('/checkout', (req, res) => {
  const cart = req.body.cart || []; // array of { productId, quantity }

  let total = 0;
  const items = [];

  for (const item of cart) {
    const qty = Number(item.quantity);
    if (!PRODUCTS[item.productId] || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
    }

    const product = PRODUCTS[item.productId];
    const lineTotal = toMoney(product.unitPrice * qty);
    total += lineTotal;

    // collect item details to send back
    items.push({
      productId: item.productId,
      itemName: product.name,
      quantity: qty,
      unitPrice: product.unitPrice,
      lineTotal
    });
  }

  total = toMoney(total);

  if (bobBalance >= total) {
    bobBalance = toMoney(bobBalance - total);
    return res.json({
      success: true,
      message: `Checkout successful! Total: $${total}`,
      balance: bobBalance,
      total,
      items,
      orderId: generateOrderId()
    });
  } else {
    return res.json({
      success: false,
      message: `Checkout failed: insufficient funds. Total: $${total}`,
      balance: bobBalance,
      total,
      items
    });
  }
});

app.get('/balance', (req, res) => res.json({ balance: bobBalance }));

const PORT = 3000;
app.listen(PORT, () => console.log(`v2 demo server running on http://localhost:${PORT}`));

