// Get references to form and table body elements
const form = document.getElementById("registrationForm");
const tbody = document.getElementById("studentTableBody");

// Track which student record is being edited (null means adding a new one)
let editingIndex = null;

/**
 * Validates the input fields using regular expressions.
 * - Name: only letters and spaces
 * - ID and contact: only numbers
 * - Email: basic email pattern
 */
function validateInput(name, id, email, contact) {
  const nameRegex = /^[A-Za-z\s]+$/;
  const idRegex = /^[0-9]+$/;
  const contactRegex = /^[0-9]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    name &&
    id &&
    email &&
    contact &&
    nameRegex.test(name) &&
    idRegex.test(id) &&
    emailRegex.test(email) &&
    contactRegex.test(contact)
  );
}

/**
 * Saves the student data array to localStorage.
 * This ensures the records persist after page refresh.
 */
function saveToLocalStorage(data) {
  localStorage.setItem("students", JSON.stringify(data));
}

/**
 * Retrieves the student data array from localStorage.
 * Returns an empty array if no data is found.
 */
function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

/**
 * Renders all student records as table rows inside the <tbody>.
 * Generates Edit and Delete buttons for each entry.
 */
function renderTable() {
  const data = getFromLocalStorage();
  tbody.innerHTML = ""; // Clear current content

  data.forEach((student, index) => {
    const row = `
      <tr>
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td class="action-btns">
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

/**
 * Loads selected student's data into the form for editing.
 * Sets `editingIndex` to update that entry after submission.
 */
window.editStudent = function (index) {
  const data = getFromLocalStorage();
  const student = data[index];

  document.getElementById("name").value = student.name;
  document.getElementById("studentId").value = student.studentId;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  editingIndex = index; // So we know which record to overwrite
};

/**
 * Deletes the student entry at the given index and re-renders the table.
 */
window.deleteStudent = function (index) {
  const data = getFromLocalStorage();
  data.splice(index, 1); // Remove item at index
  saveToLocalStorage(data); // Update stored data
  renderTable(); // Refresh displayed table
};

/**
 * Handles form submission:
 * - Validates inputs
 * - Adds new record or updates existing one
 * - Updates localStorage and table
 */
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from reloading the page

  // Get form field values
  const name = document.getElementById("name").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();

  // Validate fields
  if (!validateInput(name, studentId, email, contact)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const student = { name, studentId, email, contact };
  const data = getFromLocalStorage();

  if (editingIndex !== null) {
    // Update existing student
    data[editingIndex] = student;
    editingIndex = null;
  } else {
    // Add new student
    data.push(student);
  }

  saveToLocalStorage(data);
  renderTable(); // Refresh display
  form.reset(); // Clear form
});

// Initialize the table on page load with saved student records
window.onload = renderTable;
