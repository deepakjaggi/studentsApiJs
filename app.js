const express = require('express');
const StudentService = require('./student');  // Import the instance of StudentService

const app = express();
app.use(express.json());

app.post('/students', async (req, res) => {
  try {
    const { name, age, grade, email } = req.body;
    const result = await StudentService.addStudent(name, age, grade, email);  // Call addStudent method from StudentService
    res.status(200).json(result);
  } catch (error) {
    if (error.error === 'EMAIL_EXISTS') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json(error);
    }
  }
});

// Add this route to handle GET /students/:id
app.get('/students/:id', async (req, res) => {
  try {
    const student = await StudentService.getStudentById(req.params.id);  // Call getStudentById method from StudentService
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
