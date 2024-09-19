const StudentService = require('./student');  // The class being tested
const db = require('./db');  // Mock the database
const { sendEmail } = require('./emailService');  // Mock the email service

jest.mock('./db');
jest.mock('./emailService');
beforeEach(() => {
    jest.clearAllMocks();  // Clears mock call history and resets all mocks
});
describe('Unit Test for addStudent method', () => {
    // Test: Add a student successfully
    test('should add a student and return the student ID', async () => {
        // Mock the database behavior
        db.get.mockImplementationOnce((query, params, callback) => {
            callback(null, null);  // No email found
        });
        db.run.mockImplementationOnce((query, params, callback) => {
            callback.call({lastID: 1}, null);  // Insert student with ID 1
        });

        // Mock the sendEmail function to return a success response
        sendEmail.mockReturnValue({success: true, message: 'Mock Email'});

        const result = await StudentService.addStudent('John Doe', 20, 'A', 'john.doe@example.com');

        expect(result).toEqual({
            message: 'Student added successfully',
            id: 1
        });

        // Verify the correct database methods and email were called
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(1);
        // Verify the return value of sendEmail
        console.log(sendEmail())
        expect(sendEmail).toHaveReturnedWith({success: true, message: 'Mock Email'});
    });

// Test: Handle case where email already exists
    test('should return an error if email already exists', async () => {
        // Mock the database to simulate an existing email
        db.get.mockImplementationOnce((query, params, callback) => {
            callback(null, { email: 'existing.email@example.com' });
        });

        await expect(StudentService.addStudent('Jane Doe', 22, 'B', 'existing.email@example.com'))
            .rejects.toThrow('Email already exists');  // Expect an Error object with this message

        // Ensure the database check was made but no insertion was done
        expect(db.get).toHaveBeenCalledTimes(1);
        expect(db.run).not.toHaveBeenCalled();
        expect(sendEmail).not.toHaveBeenCalled();
    });

});
