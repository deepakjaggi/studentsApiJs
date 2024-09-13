const StudentService = require('./student');  // Import the instance of the StudentService
const db = require('./db');
const { sendEmail } = require('./emailService');

jest.mock('./db', () => ({
    run: jest.fn(function(query, params, callback) {
        callback.call({ lastID: 1 }, null); // Simulate a successful insertion
    }),
    get: jest.fn((query, params, callback) => {
        if (params[0] === 1) {
            callback(null, { id: 1, name: 'John Doe', age: 20, grade: 'A', email: 'john.doe@example.com' });
        } else {
            callback(null, null); // No student found
        }
    }),
}));

jest.mock('./emailService', () => ({
    sendEmail: jest.fn(),
}));

describe('Unit Tests for StudentService Class', () => {
    // Test: Add a student successfully
    test('should add a student and return the student ID', async () => {
        const result = await StudentService.addStudent('John Doe', 20, 'A', 'john.doe@example.com');  // Call class method

        // Check if the result is as expected
        expect(result.message).toBe('Student added successfully');
        expect(result.id).toBe(1);

        // Verify function calls
        expect(db.get).toHaveBeenCalledTimes(1); // db.get called once for email check
        expect(db.run).toHaveBeenCalledTimes(1); // db.run called once to insert the student
        expect(sendEmail).toHaveBeenCalledTimes(1); // sendEmail called once
        expect(sendEmail).toHaveBeenCalledWith('john.doe@example.com', 'Welcome to Our School', 'Hello John Doe, welcome to our school!');
    });

    // Test: Attempt to add a student with an existing email
    test('should return an error if email already exists', async () => {
        db.get.mockImplementationOnce((query, params, callback) => {
            callback(null, {email: 'existing.email@example.com'}); // Simulate existing email
        });

        await expect(StudentService.addStudent('Jane Doe', 22, 'B', 'existing.email@example.com'))  // Call class method
            .rejects.toEqual({message: 'Email already exists', error: 'EMAIL_EXISTS'});

    });

    // Test: Simulate an error in database insert
    test('should handle database insertion error', async () => {
        db.run.mockImplementationOnce((query, params, callback) => {
            callback(new Error('DB Insert Error'));
        });

        await expect(StudentService.addStudent('John Doe', 20, 'A', 'john.doe@example.com'))  // Call class method
            .rejects.toEqual({ message: 'Error adding student', error: new Error('DB Insert Error') });
    });

    // Test: Successfully get a student by ID
    test('should return a student when ID exists', async () => {
        const student = await StudentService.getStudentById(1);  // Call class method

        expect(student).toEqual({
            id: 1,
            name: 'John Doe',
            age: 20,
            grade: 'A',
            email: 'john.doe@example.com'
        });

    });

    // Test: Attempt to get a student with an invalid ID
    test('should return null when student ID does not exist', async () => {
        const student = await StudentService.getStudentById(999);  // Call class method for non-existent student

        expect(student).toBeNull();
    });

    // Test: Simulate error while fetching student by ID
    test('should handle error when retrieving student by ID', async () => {
        db.get.mockImplementationOnce((query, params, callback) => {
            callback(new Error('DB Fetch Error'));
        });

        await expect(StudentService.getStudentById(1))  // Call class method
            .rejects.toEqual({
                message: 'Error retrieving student',
                error: new Error('DB Fetch Error')
            });
    });
});
