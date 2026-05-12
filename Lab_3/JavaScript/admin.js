const API = "http://localhost:3000";
const CURRENT_ROLE = localStorage.getItem("userRole") || "admin";


const API_URL = "http://localhost:3000";

const currentUserRole = localStorage.getItem("userRole");
const currentUserId = localStorage.getItem("currentUserId");

if (!currentUserRole || currentUserRole !== "admin") {
    alert("Доступ разрешен только администраторам!");
    window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", () => {
    loadCourses();
    setupTabs();
});


async function init() {
  if (CURRENT_ROLE !== "admin") {
    document.getElementById("admin-access-block").innerHTML = `<div class="admin__block--error">Доступ запрещён. Только для администраторов.</div>`;
    document.querySelector(".admin__tabs").style.display = "none";
    return;
  }
  loadCourses();
  loadFeedback();
  setupTabs();
  setupCourseForm();
  document.getElementById("filter-user").addEventListener("input", loadFeedback);
  document.getElementById("filter-course").addEventListener("input", loadFeedback);
}

function setupTabs() {
  document.querySelectorAll(".admin__tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin__tab").forEach(b => b.classList.remove("admin__tab--active"));
      document.querySelectorAll(".admin__tab-content").forEach(c => c.classList.remove("admin__tab-content--active"));
      btn.classList.add("admin__tab--active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("admin__tab-content--active");
    });
  });
}

async function loadCourses() {
  const courses = await (await fetch(`${API}/courses`)).json();
  document.getElementById("courses-tbody").innerHTML = courses.map(c => `
    <tr>
      <td>${c.id}</td><td>${c.title}</td><td>${c.category}</td><td>$${c.price}</td>
      <td>
        <button class="admin__btn--edit" onclick="editCourse('${c.id}')">✏️</button>
        <button class="admin__btn--delete" onclick="deleteCourse('${c.id}')">🗑️</button>
      </td>
    </tr>
  `).join("");
}

async function editCourse(id) {
  const c = await (await fetch(`${API}/courses/${id}`)).json();
  document.getElementById("course-id").value = c.id;
  document.getElementById("course-title").value = c.title;
  document.getElementById("course-price").value = c.price;
  document.getElementById("course-category").value = c.category;
  document.getElementById("course-desc").value = c.description;
  document.getElementById("course-img").value = c.imageUrl;
  validateCourseForm();
}

window.deleteCourse = async (id) => { if(confirm("Удалить курс?")) { await fetch(`${API}/courses/${id}`, {method:"DELETE"}); loadCourses(); } };
window.editCourse = editCourse;

function validateCourseForm() {
  const inputs = document.querySelectorAll("#course-form input:not([type='hidden']), #course-form textarea, #course-form select");
  let valid = true;
  inputs.forEach(i => {
    if(!i.value.trim() && i.required) { i.classList.add("input--invalid"); valid=false; }
    else i.classList.remove("input--invalid");
  });
  document.getElementById("btn-save-course").disabled = !valid;
  document.getElementById("btn-save-course").classList.toggle("admin__btn--primary--active", valid);
}

function setupCourseForm() {
  document.querySelectorAll("#course-form input, #course-form textarea").forEach(i => i.addEventListener("input", validateCourseForm));
  document.getElementById("btn-reset-course").addEventListener("click", () => { 
    document.getElementById("course-form").reset(); document.getElementById("course-id").value=""; validateCourseForm(); 
  });
  
  document.getElementById("course-form").addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("course-id").value;
    const data = {
      title: document.getElementById("course-title").value.trim(),
      price: +document.getElementById("course-price").value,
      category: document.getElementById("course-category").value,
      description: document.getElementById("course-desc").value.trim(),
      imageUrl: document.getElementById("course-img").value.trim()
    };
    try {
      if(id) await fetch(`${API}/courses/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      else await fetch(`${API}/courses`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      document.getElementById("course-form").reset(); document.getElementById("course-id").value=""; validateCourseForm(); loadCourses();
    } catch { alert("Ошибка сохранения"); }
  });
}

async function loadFeedback() {
  const fb = await (await fetch(`${API}/feedback`)).json();
  const uFilter = document.getElementById("filter-user").value.trim();
  const cFilter = document.getElementById("filter-course").value.trim();
  const filtered = fb.filter(f => (!uFilter || f.userId?.trim() === uFilter) && (!cFilter || f.courseId?.trim() === cFilter));
  document.getElementById("feedback-tbody").innerHTML = filtered.length ? filtered.map(f => `
    <tr><td>${f.id}</td><td>${f.userId}</td><td>${f.courseId}</td><td>${f.date}</td><td>${f.text.slice(0,50)}...</td>
    <td><button class="admin__btn--delete" onclick="deleteFeedback('${f.id}')">🗑️</button></td></tr>
  `).join("") : `<tr><td colspan="6" style="text-align:center; padding:20px;">Отзывы не найдены</td></tr>`;
}
window.deleteFeedback = async (id) => { if(confirm("Удалить отзыв?")) { await fetch(`${API}/feedback/${id}`, {method:"DELETE"}); loadFeedback(); } };

window.onload = init;