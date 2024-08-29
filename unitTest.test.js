// unitTest.test.js
const { addStudent } = require('./student');
const db = require('./db');
const { sendEmail } = require('./emailService');

jest.mock('./db', () => ({
    run: jest.fn(function(query, params, callback) {
        // Simulate a successful database insertion with a specific ID
        callback.call({ lastID: 1 }, null); // Set `this.lastID = 1` in the callback context
    }),
    get: jest.fn((query, params, callback) => {
        // Simulate that no existing student is found
        callback(null, null);
    }),
}));


jest.mock('./emailService', () => ({
    sendEmail: jest.fn(),
}));

describe('Unit Test: addStudent', () => {
    test('should add a student and return the student ID', async () => {
        const result = await addStudent('John Doe', 20, 'A', 'john.doe@example.com');

        // Check if the result is as expected
        expect(result.message).toBe('Student added successfully');
        expect(result.id).toBe(1); // Ensure the correct ID is returned

        // Verify that the mocked functions were called as expected
        expect(db.get).toHaveBeenCalledTimes(1); // db.get should be called once to check for existing email
        expect(db.run).toHaveBeenCalledTimes(1); // db.run should be called once to insert the new student
        expect(sendEmail).toHaveBeenCalledTimes(1); // sendEmail should be called once to send a welcome email
    });
});
