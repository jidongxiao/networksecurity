// server_demo_order.js
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

// Helper to generate a fake order ID
function generateOrderId() {
  return 'ORD' + Math.floor(Math.random() * 1e8).toString().padStart(8,'0');
}

app.post('/checkout', (req, res) => {
  const cart = req.body.cart || [];

  let total = 0;
  const itemsForResponse = [];

  for (const item of cart) {
    const qty = Number(item.quantity);

    // INSECURE: still trusting client quantity for demo purposes
    if (!PRODUCTS[item.productId] || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
    }

    const unitPrice = PRODUCTS[item.productId].unitPrice;
    total += unitPrice * qty;

    // Prepare items array for frontend
    itemsForResponse.push({
      itemName: PRODUCTS[item.productId].name,
      quantity: qty,
      unitPrice
    });
  }

  total = toMoney(total);

  // v3: sanity check
  if (total < 0) {
    return res.status(400).json({ success: false, message: 'Invalid total (negative)!' });
  }

  if (bobBalance >= total) {
    bobBalance = toMoney(bobBalance - total);
    return res.json({
      success: true,
      message: `Checkout successful! Total: $${total}`,
      balance: bobBalance,
      total,
      orderId: generateOrderId(),
      items: itemsForResponse
    });
  } else {
    return res.json({
      success: false,
      message: `Checkout failed: insufficient funds. Total: $${total}`,
      balance: bobBalance,
      total,
      orderId: generateOrderId(),
      items: itemsForResponse
    });
  }
});

app.get('/balance', (req, res) => res.json({ balance: bobBalance }));

const PORT = 3000;
app.listen(PORT, () => console.log(`v3 demo server running on http://localhost:${PORT}`));

