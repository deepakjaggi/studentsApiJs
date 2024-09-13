const db = require('./db');
const { sendEmail } = require('./emailService');

class StudentService {
    // Method to check if the email already exists in the database
    checkIfEmailExists(email) {
        return new Promise((resolve, reject) => {
            const checkEmailQuery = `SELECT * FROM students WHERE email = ?`;
            db.get(checkEmailQuery, [email], (err, row) => {
                if (err) {
                    return reject({ message: 'Error checking email', error: err });
                }
                resolve(row ? true : false);
            });
        });
    }

    // Method to insert a new student into the database
    insertStudent(name, age, grade, email) {
        return new Promise((resolve, reject) => {
            const insertQuery = `INSERT INTO students (name, age, grade, email) VALUES (?, ?, ?, ?)`;
            db.run(insertQuery, [name, age, grade, email], function (err) {
                if (err) {
                    return reject({ message: 'Error adding student', error: err });
                }
                resolve(this.lastID); // 'this' refers to the db context where the student ID is stored
            });
        });
    }

    // Method to send a welcome email
    sendWelcomeEmail(name, email) {
        sendEmail(email, 'Welcome to Our School', `Hello ${name}, welcome to our school!`);
    }

    // Main method to add a student
    async addStudent(name, age, grade, email) {
        try {
            const emailExists = await this.checkIfEmailExists(email);
            if (emailExists) {
                throw { message: 'Email already exists', error: 'EMAIL_EXISTS' };
            }

            const studentId = await this.insertStudent(name, age, grade, email);
            this.sendWelcomeEmail(name, email);

            return { message: 'Student added successfully', id: studentId };
        } catch (error) {
            throw error;
        }
    }

    // Method to query the student by ID
    queryStudentById(id) {
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

    async getStudentById(id) {
        try {
            const student = await this.queryStudentById(id);
            if (!student) {
                return null;  // Return null if student not found
            }
            return student;
        } catch (error) {
            throw error;  // Rethrow any database-related errors
        }
    }
}

module.exports = new StudentService();
