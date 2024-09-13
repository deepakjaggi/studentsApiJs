const db = require('./db');
const { sendEmail } = require('./emailService');

class StudentService {
    // Method to check if the email already exists in the database
    async queryStudentByEmail(email) {
        try {
            const checkEmailQuery = `SELECT * FROM students WHERE email = ?`;
            return await new Promise((resolve, reject) => {
                db.get(checkEmailQuery, [email], (err, row) => {
                    if (err) {
                        return reject(new Error('Error checking email'));
                    }
                    resolve(row ? true : false);
                });
            });
        } catch (error) {
            throw new Error('Database query error: ' + error.message);
        }
    }

    // Method to insert a new student into the database
    async insertStudent(name, age, grade, email) {
        try {
            const insertQuery = `INSERT INTO students (name, age, grade, email) VALUES (?, ?, ?, ?)`;
            return await new Promise((resolve, reject) => {
                db.run(insertQuery, [name, age, grade, email], function (err) {
                    if (err) {
                        return reject(new Error('Error adding student'));
                    }
                    resolve(this.lastID); // 'this' refers to the db context where the student ID is stored
                });
            });
        } catch (error) {
            throw new Error('Database insert error: ' + error.message);
        }
    }

    // Method to send a welcome email
    sendWelcomeEmail(name, email) {
        try {
            sendEmail(email, 'Welcome to Our School', `Hello ${name}, welcome to our school!`);
        } catch (error) {
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    async addStudent(name, age, grade, email) {
        try {
            const emailExists = await this.queryStudentByEmail(email);
            if (emailExists) {
                throw new Error('Email already exists');
            }

            const studentId = await this.insertStudent(name, age, grade, email);
            this.sendWelcomeEmail(name, email);

            return { message: 'Student added successfully', id: studentId };
        } catch (error) {
            //console.error('Error in addStudent:', error);  // Add this log to debug
            throw error;
        }
    }

    // Method to query the student by ID
    async queryStudentById(id) {
        try {
            const query = `SELECT * FROM students WHERE id = ?`;
            return await new Promise((resolve, reject) => {
                db.get(query, [id], (err, row) => {
                    if (err) {
                        return reject(new Error('Error retrieving student'));
                    }
                    resolve(row);
                });
            });
        } catch (error) {
            throw new Error('Database query error: ' + error.message);
        }
    }

    // Method to get a student by ID
    async getStudentById(id) {
        try {
            const student = await this.queryStudentById(id);
            if (!student) {
                return null;  // Return null if student not found
            }
            return student;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentService();
