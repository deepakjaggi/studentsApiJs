const request = require('supertest');
const app = require('./app');  // Import your Express app

let server;

beforeAll((done) => {
    // Start the server before running the tests
    server = app.listen(3002, () => {
        console.log('Test server running on port 3002');
        done();
    });
});

afterAll((done) => {
    // Close the server after the tests to free the port
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('System Tests for Student API', () => {
    // Test: Add a student successfully
    test('should add a student successfully and return student ID', async () => {
        const response = await request(server)
            .post('/students')
            .send({
                name: 'John Doe',
                age: 20,
                grade: 'A',
                email: 'john.doe@example.com'
            })
            .expect(200);  // Expect HTTP 200 OK

        // Check the response body
        expect(response.body).toEqual({
            message: 'Student added successfully',
            id: expect.any(Number)
        });
    });

    // Test: Handle case where email already exists
    test('should return 400 if email already exists', async () => {
        // First, add the student
        await request(server)
            .post('/students')
            .send({
                name: 'Jane Doe',
                age: 22,
                grade: 'B',
                email: 'existing.email@example.com'
            })
            .expect(200);

        // Now, try adding the same student again
        const response = await request(server)
            .post('/students')
            .send({
                name: 'Jane Doe',
                age: 22,
                grade: 'B',
                email: 'existing.email@example.com'
            })
            .expect(400);  // Expect HTTP 400 Bad Request

        // Check the response body
        expect(response.body).toEqual({
            message: 'Email already exists'
        });
    });
});
