const express = require('express');
const StudentService = require('./student');
const app = express().use(express.json())

app.post('/students', async (req, res) => {
  try {
    const { name, age, grade, email } = req.body;
    const result = await StudentService.addStudent(name, age, grade, email);  // Call addStudent method
    res.status(200).json(result);
  } catch (error) {
    // Check the error message instead of error.error
    if (error.message === 'Email already exists') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
