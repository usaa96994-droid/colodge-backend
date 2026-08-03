const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// إلا كنا فـ Vercel كنخدمو فـ الميموار باش ما يطيحش السيرفر
const dbPath = process.env.VERCEL 
  ? ':memory:' 
  : path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite Database.');
    // إنشاء الجداول هنا...
  }
});
