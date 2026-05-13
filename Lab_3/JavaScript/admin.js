const API = "http://localhost:3000";
const CURRENT_ROLE = localStorage.getItem("userRole") || "admin";

// Проверка прав доступа
const currentUserRole = localStorage.getItem("userRole");
if (!currentUserRole || currentUserRole !== "admin") {
    alert("Доступ разрешен только администраторам!");
    window.location.href = "index.html";
}

// Глобальные переменные для модального окна
let modal = null;
let openModalBtn = null;
let closeModalSpan = null;

window.addEventListener("DOMContentLoaded", () => {
    init();
});

async function init() {
    if (CURRENT_ROLE !== "admin") {
        const block = document.getElementById("admin-access-block");
        if (block) {
            block.innerHTML = `<div class="admin__block--error">Доступ запрещён. Только для администраторов.</div>`;
        }
        const tabs = document.querySelector(".admin__tabs");
        if (tabs) tabs.style.display = "none";
        return;
    }

    // Инициализация модального окна
    setupModal();

    loadCourses();
    loadFeedback();
    setupTabs();
    setupCourseForm();
    
    const filterUser = document.getElementById("filter-user");
    const filterCourse = document.getElementById("filter-course");
    
    if(filterUser) filterUser.addEventListener("input", loadFeedback);
    if(filterCourse) filterCourse.addEventListener("input", loadFeedback);
}

// === ЛОГИКА МОДАЛЬНОГО ОКНА ===
function setupModal() {
    modal = document.getElementById("course-modal");
    openModalBtn = document.getElementById("open-modal-btn");
    closeModalSpan = document.querySelector(".modal__close");

    if (openModalBtn) {
        openModalBtn.onclick = function() {
            // Сброс формы при открытии для нового курса
            const form = document.getElementById("course-form");
            if(form) form.reset();
            
            const idInput = document.getElementById("course-id");
            if(idInput) idInput.value = "";
            
            // Вызываем валидацию, чтобы заблокировать кнопку сохранения пустой формы
            validateCourseForm();
            
            if(modal) {
                modal.style.display = "flex";
                // Небольшая задержка для плавного появления (CSS transition)
                setTimeout(() => {
                    modal.classList.add("show");
                }, 10);
            }
        }
    }

    if (closeModalSpan) {
        closeModalSpan.onclick = function() {
            closeMyModal();
        }
    }

    // Закрытие по клику вне окна
    window.onclick = function(event) {
        if (event.target == modal) {
            closeMyModal();
        }
    }
}

function closeMyModal() {
    if(modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); // Время должно совпадать с transition в CSS
    }
}

// === ВКЛАДКИ ===
function setupTabs() {
    document.querySelectorAll(".admin__tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".admin__tab").forEach(b => b.classList.remove("admin__tab--active"));
            document.querySelectorAll(".admin__tab-content").forEach(c => c.classList.remove("admin__tab-content--active"));
            
            btn.classList.add("admin__tab--active");
            const tabId = btn.dataset.tab;
            const content = document.getElementById(`tab-${tabId}`);
            if(content) content.classList.add("admin__tab-content--active");
        });
    });
}

// === КУРСЫ ===
async function loadCourses() {
    try {
        const res = await fetch(`${API}/courses`);
        const courses = await res.json();
        const tbody = document.getElementById("courses-tbody");
        
        if(tbody) {
            tbody.innerHTML = courses.map(c => `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.title}</td>
                    <td>${c.category}</td>
                    <td>$${c.price}</td>
                    <td>
                        <button class="admin__btn--edit" onclick="editCourse('${c.id}')">✏️</button>
                        <button class="admin__btn--delete" onclick="deleteCourse('${c.id}')">🗑️</button>
                    </td>
                </tr>
            `).join("");
        }
    } catch (e) {
        console.error("Ошибка загрузки курсов:", e);
    }
}

// Функция редактирования теперь открывает модальное окно
async function editCourse(id) {
    try {
        const res = await fetch(`${API}/courses/${id}`);
        const c = await res.json();
        
        document.getElementById("course-id").value = c.id;
        document.getElementById("course-title").value = c.title;
        document.getElementById("course-price").value = c.price;
        document.getElementById("course-category").value = c.category;
        document.getElementById("course-desc").value = c.description;
        document.getElementById("course-img").value = c.imageUrl;
        
        validateCourseForm();
        
        // Открываем модальное окно
        if(modal) {
            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        }
    } catch (e) {
        console.error("Ошибка загрузки курса для редактирования:", e);
    }
}

// Делаем функции глобальными, чтобы они работали из HTML (onclick)
window.deleteCourse = async (id) => { 
    if(confirm("Удалить курс?")) { 
        try {
            await fetch(`${API}/courses/${id}`, {method:"DELETE"}); 
            loadCourses(); 
            // Показываем уведомление, если есть функция showToast
            if(window.showToast) showToast("Курс удален", "success");
        } catch(e) {
            console.error(e);
        }
    } 
};

window.editCourse = editCourse;

// === ВАЛИДАЦИЯ ФОРМЫ ===
// Эта функция должна быть доступна глобально
function validateCourseForm() {
    const inputs = document.querySelectorAll("#course-form input:not([type='hidden']), #course-form textarea, #course-form select");
    let valid = true;
    
    inputs.forEach(i => {
        // Пропускаем disabled элементы
        if(i.disabled) return;

        if(!i.value.trim() && i.required) { 
            i.classList.add("input--invalid"); 
            valid = false; 
        } else {
            i.classList.remove("input--invalid");
        }
    });
    
    const saveBtn = document.getElementById("btn-save-course");
    if(saveBtn) {
        saveBtn.disabled = !valid;
        if(valid) {
            saveBtn.classList.add("admin__btn--primary--active");
        } else {
            saveBtn.classList.remove("admin__btn--primary--active");
        }
    }
}

// === ОБРАБОТКА ФОРМЫ ===
function setupCourseForm() {
    const formInputs = document.querySelectorAll("#course-form input, #course-form textarea");
    formInputs.forEach(i => i.addEventListener("input", validateCourseForm));
    
    const resetBtn = document.getElementById("btn-reset-course");
    if(resetBtn) {
        resetBtn.addEventListener("click", () => {
            const form = document.getElementById("course-form");
            if(form) form.reset(); 
            const idInput = document.getElementById("course-id");
            if(idInput) idInput.value = ""; 
            validateCourseForm();
        });
    }
    
    const form = document.getElementById("course-form");
    if(form) {
        form.addEventListener("submit", async e => {
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
                if(id) {
                    // Обновление существующего
                    await fetch(`${API}/courses/${id}`, { 
                        method: "PATCH", 
                        headers:{"Content-Type": "application/json"}, 
                        body:JSON.stringify(data) 
                    });
                    if(window.showToast) showToast("Курс обновлен", "success");
                } else {
                    // Создание нового
                    await fetch(`${API}/courses`, { 
                        method: "POST", 
                        headers:{"Content-Type": "application/json"}, 
                        body:JSON.stringify(data) 
                    });
                    if(window.showToast) showToast("Курс добавлен", "success");
                }
                
                // Сброс и закрытие модалки
                form.reset(); 
                document.getElementById("course-id").value = ""; 
                validateCourseForm(); 
                loadCourses();
                closeMyModal();
                
            } catch(err) { 
                console.error(err);
                alert("Ошибка сохранения"); 
            }
        });
    }
}

// === ОТЗЫВЫ ===
async function loadFeedback() {
    try {
        const res = await fetch(`${API}/feedback`);
        const fb = await res.json();
        
        const uFilter = document.getElementById("filter-user")?.value.trim();
        const cFilter = document.getElementById("filter-course")?.value.trim();
        
        const filtered = fb.filter(f => 
            (!uFilter || f.userId?.trim() === uFilter) && 
            (!cFilter || f.courseId?.trim() === cFilter)
        );
        
        const tbody = document.getElementById("feedback-tbody");
        if(tbody) {
            tbody.innerHTML = filtered.length ? filtered.map(f => `
                <tr>
                    <td>${f.id}</td>
                    <td>${f.userId}</td>
                    <td>${f.courseId}</td>
                    <td>${f.date}</td>
                    <td>${f.text.slice(0,50)}...</td>
                    <td>
                        <button class="admin__btn--delete" onclick="deleteFeedback('${f.id}')">🗑️</button>
                    </td>
                </tr>
            `).join("") : `<tr><td colspan="6" style="text-align:center; padding:20px;">Отзывы не найдены</td></tr>`;
        }
    } catch(e) {
        console.error("Ошибка загрузки отзывов:", e);
    }
}

window.deleteFeedback = async (id) => { 
    if(confirm("Удалить отзыв?")) { 
        try {
            await fetch(`${API}/feedback/${id}`, {method:"DELETE"}); 
            loadFeedback(); 
            if(window.showToast) showToast("Отзыв удален", "success");
        } catch(e) {
            console.error(e);
        }
    } 
};