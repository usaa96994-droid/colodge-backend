const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // أو المجلد اللي فيه ملفات HTML

// تخزين مؤقت للطلبات والحجوزات (في الذاكرة لتفادي مشاكل Vercel)
let bookings = [];

// API للحصول على الحجوزات
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// API لإضافة حجز جديد
app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  res.status(201).json({ message: 'Booking successful', booking: newBooking });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Export الخاطف المخصص لـ Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
