// ------------------------- REGISTER -------------------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const res = await fetch("http://localhost:3000/api/login/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  document.getElementById("registerResult").innerText = JSON.stringify(data, null, 2);
});


// ------------------------- LOGIN -------------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const res = await fetch("http://localhost:3000/api/login/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  document.getElementById("loginResult").innerText = JSON.stringify(data, null, 2);

  // Redirect on success
  if (data?.message === "Login successful") {
    setTimeout(() => {
      window.location.href = "views.html";
    }, 600);
  }
});


// ------------------------- LOAD SELECTED SQL VIEW -------------------------
async function loadSelectedView() {
  const selectedView = document.getElementById("viewSelector").value;

  const res = await fetch(`http://localhost:3000/api/views/${selectedView}`);
  const rows = await res.json();

  // Error or empty response
  if (!Array.isArray(rows) || rows.length === 0) {
    document.getElementById("tableContainer").innerHTML = "<p>No data available.</p>";
    return;
  }

  // Build table
  let html = `<table border="1"><tr>`;
  Object.keys(rows[0]).forEach((col) => (html += `<th>${col}</th>`));
  html += "</tr>";

  rows.forEach((row) => {
    html += "<tr>";
    Object.values(row).forEach((val) => (html += `<td>${val}</td>`));
    html += "</tr>";
  });

  html += "</table>";

  document.getElementById("tableContainer").innerHTML = html;
}

// Load button
document.getElementById("loadViewBtn")?.addEventListener("click", loadSelectedView);

// ------------------------- RELOAD BUTTON -------------------------
document.getElementById("reloadViewBtn")?.addEventListener("click", () => {
  loadSelectedView();
});
