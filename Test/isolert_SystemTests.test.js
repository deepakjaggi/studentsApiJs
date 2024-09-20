const request = require('supertest'); // Import supertest to test HTTP requests
const { sendEmail } = require('../emailService'); // Mock the email service
const {getRandomNumber} = require('./commonTestMethods');
jest.mock('../emailService');
beforeEach(() => {
    jest.clearAllMocks();  // Clears mock call history and resets all mocks
});
describe('System Test for Student API with mocked emailService', () => {
    // Test: Add a student successfully with email mock
    test('should add a student successfully and verify the mock email return value', async () => {
        // Mock sendEmail to return success
        sendEmail.mockReturnValue({ success: true, message: 'Mock Email' });
        let ranNum = getRandomNumber(10,10000)
        let email  = `john.doe.st_${ranNum}@example.com`
        const response = await request('http://localhost:3003') // Point to the running local server
            .post('/students')
            .send({
                name: 'John Doe',
                age: 20,
                grade: 'A',
                email: email
            })
            .expect(200);  // Expect HTTP 200 OK

        // Check the response contains the correct success message and ID
        expect(response.body).toEqual({
            message: 'Student added successfully',
            id: expect.any(Number)
        });
        console.log(sendEmail())
        // Verify that the mock function returned the correct mocked value
        expect(sendEmail).toHaveReturnedWith({success: true, message: 'Mock Email'});
    });
});
