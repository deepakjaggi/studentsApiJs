const request = require('supertest'); // Import supertest to test HTTP requests
const { sendEmail } = require('./emailService'); // Mock the email service

jest.mock('./emailService'); // Mock only the emailService, keep everything else real

describe('System Test for Student API with mocked emailService', () => {
    // Test: Add a student successfully with email mock
    test('should add a student successfully and send an email', async () => {
        // Mock sendEmail to return success
        sendEmail.mockReturnValue({ success: true, message: 'Email sent successfully' });

        const response = await request('http://localhost:3003') // Point to the running local server
            .post('/students')
            .send({
                name: 'John Doe',
                age: 20,
                grade: 'A',
                email: 'john.doe.st@example.com'
            })
            .expect(200);  // Expect HTTP 200 OK

        // Check the response contains the correct success message and ID
        expect(response.body).toEqual({
            message: 'Student added successfully',
            id: expect.any(Number)
        });
        expect(sendEmail).toHaveReturnedWith({success: true, message: 'Email sent successfully'});

    });
});
