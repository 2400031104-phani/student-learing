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

// Define a Student schema
const studentSchema = new mongoose.Schema({
  id: Number,          
  name: String,
  subject: String,
  marks: Number
});

// Create a model
const Student = mongoose.model("Student", studentSchema);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the student data server! This is the root endpoint.");
});

// =======================
// CRUD APIs
// =======================

// CREATE → Add a new student (/students)
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    console.log("📌 Saved student:", student);
    res.status(201).send({ message: "✅ Student added", data: student });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// CREATE → Add a new student (/add) for your frontend
app.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    console.log("📌 Saved student via /add:", student);
    res.status(201).send({ message: "✅ Student added via /add", data: student });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// READ → Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// READ ONE → Get student by id
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ id: Number(req.params.id) });
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
      { id: Number(req.params.id) },
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
    const student = await Student.findOneAndDelete({ id: Number(req.params.id) });
    if (!student) {
      return res.status(404).send({ error: "Student not found" });
    }
    res.send({ message: "🗑️ Student deleted successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});