import { storage, toast } from "./storage.js";
import { validateRequired, isEmail, setFieldError } from "./validation.js";
import { api } from "./api.js";

export function initAuth() {
  initPasswordToggles();
  const loginForm = document.querySelector("[data-login-form]");
  const signupForm = document.querySelector("[data-signup-form]");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signupForm) signupForm.addEventListener("submit", handleSignup);

  // Wire up logout button if present
  document.querySelectorAll("[data-logout-button]").forEach((button) => {
    button.addEventListener("click", logout);
  });
}

function initPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateRequired(form)) return;
  const data = Object.fromEntries(new FormData(form));
  
  if (!isEmail(data.email)) {
    setFieldError(form.email, "Enter a valid email address.");
    return;
  }

  // Call the backend registration API
  toast("Creating account...", "loading");
  const response = await api.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password
  });

  if (!response.ok) {
    toast(response.message || "Registration failed.", "error");
    return;
  }

  sessionStorage.setItem("airb:token", response.token);
  sessionStorage.setItem("airb:session", JSON.stringify(response.user));
  toast("Account created successfully.");
  window.location.href = "dashboard.html";
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateRequired(form)) return;
  const data = Object.fromEntries(new FormData(form));

  toast("Logging in...", "loading");
  const response = await api.post("/auth/login", {
    email: data.email,
    password: data.password
  });

  if (!response.ok) {
    toast(response.message || "Invalid email or password.", "error");
    return;
  }

  sessionStorage.setItem("airb:token", response.token);
  sessionStorage.setItem("airb:session", JSON.stringify(response.user));
  
  if (data.remember) {
    storage.set("rememberedEmail", data.email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  toast("Welcome back.");
  window.location.href = "dashboard.html";
}

export function logout(event) {
  if (event) event.preventDefault();
  sessionStorage.removeItem("airb:token");
  sessionStorage.removeItem("airb:session");
  toast("Logged out successfully.");
  window.location.href = "login.html";
}

export function checkAuth() {
  const token = sessionStorage.getItem("airb:token");
  const isAuthPage = window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html");
  
  if (!token && !isAuthPage && !window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
    window.location.href = "login.html";
  } else if (token && isAuthPage) {
    window.location.href = "dashboard.html";
  }
}
