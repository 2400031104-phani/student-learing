// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Create an instance of the Express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas (with DB name studentDB)
mongoose.connect(
  "mongodb+srv://phani200656_db_user:Shiva@cluster05.0lc6pxj.mongodb.net/studentDB?retryWrites=true&w=majority&appName=cluster05"
)
.then(() => console.log("✅ MongoDB Atlas connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// =======================
// Schema & Model
// =======================

// Subject sub-schema
const subjectSchema = new mongoose.Schema({
  subject: String,
  marks: Number
});

// Student schema
const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  subjects: [subjectSchema]   // multiple subjects per student
});

// Model
const Student = mongoose.model("Student", studentSchema);

// =======================
// Routes
// =======================

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the student data server! This is the root endpoint.");
});

// CREATE → Add a new student
app.post("/students", async (req, res) => {
  try {
    const { id, name, subjects } = req.body;
    const student = new Student({ id, name, subjects });
    await student.save();
    console.log("📌 Saved student:", student);
    res.status(201).send({ message: "✅ Student added", data: student });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();  // () compulsory
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE → Get student by id
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).send({ error: "Student not found" });
    res.send(student);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// UPDATE → Update student by id
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).send({ error: "Student not found" });
    }
    res.send({ message: "✅ Student updated", data: student });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// DELETE → Delete student by id
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ id: req.params.id });
    if (!student) {
      return res.status(404).send({ error: "Student not found" });
    }
    res.send({ message: "🗑️ Student deleted successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// Delete all studentscd
app.delete("/students", async (req, res) => {
  try {
    await Student.deleteMany({});  // Clear entire collection
    res.json({ message: "All students deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete single student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =======================
// Start server
// =======================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
