const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// إعداد قاعدة البيانات SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error("Database Error:", err);
    else console.log("Connected to SQLite Database successfully.");
});

// إنشاء جدول الحجوزات
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guest_name TEXT,
        guest_phone TEXT,
        room_name TEXT,
        check_in TEXT,
        check_out TEXT,
        guests_count INTEGER,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// API: حفظ حجز جديد فـ Database
app.post('/api/bookings', (req, res) => {
    const { name, phone, room, checkIn, checkOut, guests } = req.body;
    
    if(!name || !phone || !room || !checkIn || !checkOut) {
        return res.status(400).json({ error: "جميع الحقول ضرورية!" });
    }

    const query = `INSERT INTO bookings (guest_name, guest_phone, room_name, check_in, check_out, guests_count) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, phone, room, checkIn, checkOut, guests], function(err) {
        if (err) {
            return res.status(500).json({ error: "وقع مشكل أثناء تسجيل الحجز" });
        }
        res.json({ success: true, message: "تم تسجيل الحجز بنجاح!", bookingId: this.lastID });
    });
});

// API: جلب كاع الحجوزات لـ Admin Panel
app.get('/api/admin/bookings', (req, res) => {
    db.all(`SELECT * FROM bookings ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: قبول أو إلغاء الحجز من طرف Admin
app.put('/api/admin/bookings/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: `تم تحديث الحالة إلى ${status}` });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
