const API = "http://localhost:3000";

// Переключение вкладок
document.querySelectorAll(".auth__tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth__tab").forEach(t => t.classList.remove("auth__tab--active"));
    document.querySelectorAll(".auth__form").forEach(f => f.classList.remove("auth__form--active"));
    tab.classList.add("auth__tab--active");
    document.getElementById(`${tab.dataset.tab}-form`).classList.add("auth__form--active");
  });
});

// === ЛОГИКА ВХОДА ===
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("btn-login");
const loginEmail = document.getElementById("login-email");
const loginPass = document.getElementById("login-password");

function validateLogin() {
    const email = loginEmail.value.trim();
    const password = loginPass.value;
    
    // Простая валидация email
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // Пароль должен быть минимум 6 символов
    const passValid = password.length >= 6;
    
    // Визуальная обратная связь
    if (email && !emailValid) {
        loginEmail.classList.add("input--invalid");
    } else {
        loginEmail.classList.remove("input--invalid");
    }
    
    if (password && !passValid) {
        loginPass.classList.add("input--invalid");
    } else {
        loginPass.classList.remove("input--invalid");
    }
    
    const isValid = emailValid && passValid && email.length > 0 && password.length > 0;
    loginBtn.disabled = !isValid;
    loginBtn.classList.toggle("auth__btn--primary--active", isValid);
    
    console.log("Email valid:", emailValid, "Pass valid:", passValid, "Button enabled:", isValid);
}

loginEmail.addEventListener("input", validateLogin);
loginPass.addEventListener("input", validateLogin);

loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPass.value;
    
    loginBtn.textContent = "Вход...";
    loginBtn.disabled = true;
    
    try {
        const res = await fetch(`${API}/users?email=${encodeURIComponent(email)}`);
        const users = await res.json();
        
        console.log("Найденные пользователи:", users);
        
        const user = users.find(u => u.password === password);
        
        if (user) {
            localStorage.setItem("currentUserId", user.id);
            localStorage.setItem("userRole", user.role);
            localStorage.setItem("userName", user.firstName);
            localStorage.setItem("userNickname", user.nickname);
            
            alert(`Добро пожаловать, ${user.nickname || user.firstName}!`);
            window.location.href = "index.html";
        } else {
            alert("Неверный email или пароль");
            loginPass.classList.add("input--invalid");
            loginBtn.textContent = "Войти";
            validateLogin();
        }
    } catch (error) {
        console.error("Ошибка входа:", error);
        alert("Ошибка подключения к серверу");
        loginBtn.textContent = "Войти";
        validateLogin();
    }
});

// === ЛОГИКА РЕГИСТРАЦИИ (оставлена без изменений, только привязка к форме) ===
const registerForm = document.getElementById("register-form");
const registerBtn = document.getElementById("btn-register");
const manualBlock = document.getElementById("manual-pass-block");
const nickInput = document.getElementById("nickname");
const attemptsEl = document.getElementById("nick-attempts");
let autoAttempts = 0;
const MAX_ATTEMPTS = 5;
const TOP_100 = ["password123","123456","qwerty","admin","welcome","letmein","football","shadow","123123","superman","michael","trustno1","ranger","baseball","batman","passw0rd","sunshine","test123","secret","hello"];

document.querySelectorAll("input[name='passType']").forEach(r => {
  r.addEventListener("change", () => {
    manualBlock.style.display = r.value === "manual" ? "block" : "none";
    validateRegister();
  });
});

document.getElementById("btn-regenerate").addEventListener("click", () => {
  const f = document.getElementById("firstName").value.trim().slice(0,3).toLowerCase();
  const l = document.getElementById("lastName").value.trim().slice(0,3).toLowerCase();
  if(!f || !l) return;
  nickInput.value = `${f}${l}${Math.floor(Math.random()*990)+10}`;
  autoAttempts++;
  attemptsEl.textContent = `Попыток: ${Math.max(0, MAX_ATTEMPTS - autoAttempts)}`;
  if(autoAttempts >= MAX_ATTEMPTS) {
    nickInput.removeAttribute("readonly");
    document.getElementById("btn-regenerate").disabled = true;
    attemptsEl.textContent = "Введите никнейм вручную";
  }
  validateRegister();
});

["firstName","lastName"].forEach(id => document.getElementById(id).addEventListener("input", () => {
  const f = document.getElementById("firstName").value.trim().slice(0,3).toLowerCase();
  const l = document.getElementById("lastName").value.trim().slice(0,3).toLowerCase();
  if(f && l && autoAttempts < MAX_ATTEMPTS) nickInput.value = `${f}${l}${Math.floor(Math.random()*990)+10}`;
  validateRegister();
}));

document.querySelectorAll("#register-form .auth__input, #agreement").forEach(el => el.addEventListener("input", validateRegister));

async function validateRegister() {
  let valid = true;
  const checks = {
    lastName: v => v.trim().length >= 2 ? "" : "Минимум 2 символа",
    firstName: v => v.trim().length >= 2 ? "" : "Минимум 2 символа",
    dob: v => { if(!v) return "Выберите дату"; const age = Math.floor((new Date()-new Date(v))/31557600000); return age<16 ? "Доступно с 16 лет" : ""; },
    phone: v => /^\+375(17|25|29|33|44|24)\d{7}$/.test(v.replace(/\s/g,"")) ? "" : "Неверный формат РБ",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Некорректный email",
    password: v => {
      if(document.querySelector("input[name='passType']:checked").value==="auto") return "";
      if(v.length<8||v.length>20) return "8-20 символов";
      if(!/[A-ZА-ЯЁ]/.test(v)) return "Нужна заглавная буква";
      if(!/[a-zа-яё]/.test(v)) return "Нужна строчная буква";
      if(!/\d/.test(v)) return "Нужна цифра";
      if(!/[!@#$%^&*()]/.test(v)) return "Нужен спецсимвол";
      if(TOP_100.includes(v.toLowerCase())) return "Слишком простой пароль";
      return "";
    },
    confirmPassword: v => {
      if(document.querySelector("input[name='passType']:checked").value==="auto") return "";
      return v===document.getElementById("password").value ? "" : "Пароли не совпадают";
    },
    nickname: async v => {
      if(!v) return "Обязательное поле";
      const res = await fetch(`${API}/users?nickname=${encodeURIComponent(v)}`);
      return (await res.json()).length ? "Никнейм занят" : "";
    }
  };

  for(const [id, fn] of Object.entries(checks)) {
    const inp = document.getElementById(id);
    if(!inp || inp.disabled || inp.readOnly) continue;
    if(id.includes("password") && document.querySelector("input[name='passType']:checked").value==="auto") continue;
    const msg = typeof fn==="function" ? await fn(inp.value) : "";
    const err = document.getElementById(`error-${id}`);
    if(msg) { err.textContent=msg; err.classList.add("auth__error--visible"); inp.classList.add("input--invalid"); inp.classList.remove("input--valid"); valid=false; }
    else if(inp.value) { err.textContent=""; err.classList.remove("auth__error--visible"); inp.classList.add("input--valid"); inp.classList.remove("input--invalid"); }
  }

  const agr = document.getElementById("agreement");
  const agrErr = document.getElementById("error-agreement");
  if(!agr.checked) { agrErr.textContent="Обязательно к прочтению"; agrErr.classList.add("auth__error--visible"); valid=false; }
  else { agrErr.textContent=""; agrErr.classList.remove("auth__error--visible"); }

  registerBtn.disabled = !valid;
  registerBtn.classList.toggle("auth__btn--primary--active", valid);
}

registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  registerBtn.textContent = "Отправка..."; registerBtn.disabled = true;
  const type = document.querySelector("input[name='passType']:checked").value;
  const user = {
    role: "customer",
    phone: document.getElementById("phone").value.replace(/\s/g,""),
    email: document.getElementById("email").value.trim(),
    dob: document.getElementById("dob").value,
    password: type==="manual" ? document.getElementById("password").value : Math.random().toString(36).slice(-8)+"A1!",
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    middleName: document.getElementById("middleName").value.trim(),
    nickname: nickInput.value.trim()
  };
  try {
    const res = await fetch(`${API}/users`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(user) });
    if(res.ok) { alert("Регистрация успешна! Теперь войдите в аккаунт."); document.querySelector(".auth__tab").click(); }
    else throw new Error();
  } catch { alert("Ошибка регистрации"); registerBtn.textContent="Зарегистрироваться"; validateRegister(); }
});



// Инициализация
window.onload = () => { validateRegister(); nickInput.value = document.getElementById("firstName").value.trim().slice(0,3).toLowerCase() + document.getElementById("lastName").value.trim().slice(0,3).toLowerCase() + Math.floor(Math.random()*990)+10 || "Введите имя и фамилию"; };