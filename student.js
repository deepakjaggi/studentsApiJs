const db = require('./db');
const { sendEmail } = require('./emailService');

function addStudent(name, age, grade, email) {
    return new Promise((resolve, reject) => {
        // Check if the email already exists
        const checkEmailQuery = `SELECT * FROM students WHERE email = ?`;
        db.get(checkEmailQuery, [email], (err, row) => {
            if (err) {
                return reject({ message: 'Error checking email', error: err });
            }

            if (row) {
                return reject({ message: 'Email already exists', error: 'EMAIL_EXISTS' });
            }

            const insertQuery = `INSERT INTO students (name, age, grade, email) VALUES (?, ?, ?, ?)`;

            db.run(insertQuery, [name, age, grade, email], function (err) {
                if (err) {
                    return reject({ message: 'Error adding student', error: err });
                }

                const studentId = this.lastID; // Ensure that lastID is taken from the function's context

                sendEmail(email, 'Welcome to Our School', `Hello ${name}, welcome to our school!`);

                resolve({ message: 'Student added successfully', id: studentId });
            });
        });
    });
}

function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM students WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                return reject({ message: 'Error retrieving student', error: err });
            }
            resolve(row);
        });
    });
}

module.exports = {
    addStudent,
    getStudentById,
};
