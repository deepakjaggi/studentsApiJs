const request = require('supertest');  // Supertest to make HTTP requests
const server = 'http://localhost:3003';  // Assuming your server is running on port 3003
const { sendEmail } = require('./emailService');  // Mock the email service

// Mocking the email service, so no real email will be sent
jest.mock('./emailService');

beforeEach(() => {
    jest.clearAllMocks();  // Clears mock call history and resets all mocks
});

describe('Isolated System Test - Student API (Mocking Email Service)', () => {
    // Test Case 1: Add a student successfully
    test('should add a student and return the student ID, with mocked email sending', async () => {
        const response = await request(server)
            .post('/students')  // Make a POST request to the /students endpoint
            .send({
                name: 'John Doe',
                age: 20,
                grade: 'A',
                email: 'john.doe.sys@example.com'
            })
            .expect(200);  // Expect a 200 OK status code from the server

        // Verify the response structure
        expect(response.body).toEqual({
            message: 'Student added successfully',
            id: expect.any(Number)  // Expect the ID to be a number
        });
    });
});
