const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

// Create the students table
db.run(`
  CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    grade TEXT,
    email TEXT UNIQUE
  )
`);

module.exports = db;
