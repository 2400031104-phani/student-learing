// Save data (Teacher -> Backend)
const form = document.getElementById("marksForm");
if (form) {
  form.addEventListener("submit", function(e){
    e.preventDefault();
    fetch("http://127.0.0.1:5000/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: document.getElementById("name").value,
        subject: document.getElementById("subject").value,
        marks: document.getElementById("marks").value
      })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
  });
}

// Fetch all data for Teacher Dashboard
const table = document.getElementById("dataTable");
if (table) {
  fetch("http://127.0.0.1:5000/get")
    .then(res => res.json())
    .then(rows => {
      rows.forEach(r => {
        let row = table.insertRow();
        row.insertCell(0).innerText = r[0]; // id
        row.insertCell(1).innerText = r[1]; // name
        row.insertCell(2).innerText = r[2]; // subject
        row.insertCell(3).innerText = r[3]; // marks
      });
    });
}

// Student Progress Chart
const ctx = document.getElementById("progressChart");
if (ctx) {
  fetch("http://127.0.0.1:5000/get")
    .then(res => res.json())
    .then(rows => {
      let subjects = rows.map(r => r[2]);
      let marks = rows.map(r => r[3]);
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