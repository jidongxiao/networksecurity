// server_v1_detailed.js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let bobBalance = 100.00;

function toMoney(x) { return Math.round(x * 100) / 100; }

function generateOrderId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

app.post('/checkout', (req, res) => {
  const cart = req.body.cart || []; // array of { productId, itemName, quantity, price }

  // Compute total (still insecure, using client price)
  const total = toMoney(cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0));

  if (bobBalance >= total) {
    bobBalance = toMoney(bobBalance - total);

    // Return detailed info
    return res.json({
      success: true,
      message: `Checkout successful! Total: $${total}`,
      balance: bobBalance,
      total: total,
      items: cart.map(i => ({
        productId: i.productId,
        itemName: i.itemName,
        quantity: Number(i.quantity),
        unitPrice: Number(i.price) / Number(i.quantity)
      })),
      orderId: generateOrderId()
    });
  } else {
    return res.json({
      success: false,
      message: `Checkout failed: insufficient funds. Total: $${total}`,
      balance: bobBalance
    });
  }
});

app.get('/balance', (req, res) => res.json({ balance: bobBalance }));

const PORT = 3000;
app.listen(PORT, () => console.log(`v1 demo server running on http://localhost:${PORT}`));

