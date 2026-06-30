import { storage, toast } from "./storage.js";
import { validateRequired, isEmail, setFieldError } from "./validation.js";

export function initAuth() {
  initPasswordToggles();
  const loginForm = document.querySelector("[data-login-form]");
  const signupForm = document.querySelector("[data-signup-form]");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signupForm) signupForm.addEventListener("submit", handleSignup);
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

function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateRequired(form)) return;
  const data = Object.fromEntries(new FormData(form));
  if (!isEmail(data.email)) {
    setFieldError(form.email, "Enter a valid email address.");
    return;
  }
  const users = storage.get("users", []);
  if (users.some((user) => user.email === data.email)) {
    setFieldError(form.email, "An account already exists for this email.");
    return;
  }
  users.push({ name: data.name, email: data.email, password: data.password, createdAt: new Date().toISOString() });
  storage.set("users", users);
  sessionStorage.setItem("airb:session", JSON.stringify({ name: data.name, email: data.email }));
  toast("Account created successfully.");
  window.location.href = "dashboard.html";
}

function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateRequired(form)) return;
  const data = Object.fromEntries(new FormData(form));
  const user = storage.get("users", []).find((item) => item.email === data.email && item.password === data.password);
  if (!user) {
    toast("Invalid email or password.");
    return;
  }
  sessionStorage.setItem("airb:session", JSON.stringify({ name: user.name, email: user.email }));
  if (data.remember) storage.set("rememberedEmail", user.email);
  toast("Welcome back.");
  window.location.href = "dashboard.html";
}
