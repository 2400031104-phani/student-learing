// Save data (Teacher -> Backend)
const form = document.getElementById("marksForm");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Collect name
    const name = document.getElementById("name").value;

    // Collect all subjects & marks
    const subjectRows = document.querySelectorAll(".subject-row");
    const subjects = [];
    subjectRows.forEach(row => {
      const subject = row.querySelector(".subject").value;
      const marks = row.querySelector(".marks").value;
      subjects.push({ subject, marks: Number(marks) });
    });

    // Send to backend
    fetch("http://127.0.0.1:5000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Date.now().toString(), // temporary unique ID
        name: name,
        subjects: subjects
      })
    })
    .then(res => res.json())
    .then(data => alert(data.message || "✅ Student Added!"))
    .catch(err => alert("❌ Error: " + err));
  });
}

// Fetch all data for Teacher Dashboard
const table = document.getElementById("dataTable");
if (table) {
  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(rows => {
      rows.forEach(student => {
        student.subjects.forEach(s => {
          let row = table.insertRow();
          row.insertCell(0).innerText = student.id;
          row.insertCell(1).innerText = student.name;
          row.insertCell(2).innerText = s.subject;
          row.insertCell(3).innerText = s.marks;
        });
      });
    });
}

// Student Progress Chart
const ctx = document.getElementById("progressChart");
if (ctx) {
  fetch("http://127.0.0.1:5000/students")
    .then(res => res.json())
    .then(rows => {
      let subjects = [];
      let marks = [];
      rows.forEach(student => {
        student.subjects.forEach(s => {
          subjects.push(s.subject);
          marks.push(s.marks);
        });
      });

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: subjects,
          datasets: [{
            label: 'Marks',
            data: marks,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        }
      });
    });
}

// Add subject input row dynamically
function addSubjectRow() {
  const container = document.getElementById("subjectsContainer");

  const newRow = document.createElement("div");
  newRow.classList.add("subject-row");
  newRow.innerHTML = `
    <input type="text" class="subject" placeholder="Subject" required>
    <input type="number" class="marks" placeholder="Marks" required>
    <button type="button" onclick="this.parentElement.remove()">❌</button>
  `;

  container.appendChild(newRow);
}
