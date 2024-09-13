const request = require('supertest');

describe('System Test for Student API', () => {
    const server = 'http://localhost:3003';  // Use the already running server

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

        // Check that the response has the correct structure
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
            .expect(200);  // Expect HTTP 200 OK for the first addition

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

        // Check that the response has the correct error message
        expect(response.body).toEqual({
            message: 'Email already exists'
        });
    });

});
