export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isPhone(value) {
  return /^[0-9+\-\s()]{8,18}$/.test(String(value).trim());
}

export function setFieldError(field, message = "") {
  const group = field.closest(".form-group") || field.parentElement;
  let error = group.querySelector(".error-text");
  if (!error) {
    error = document.createElement("small");
    error.className = "error-text";
    group.append(error);
  }
  field.classList.toggle("input-error", Boolean(message));
  error.textContent = message;
}

export function validateRequired(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const value = field.value.trim();
    let message = value ? "" : "This field is required.";
    if (!message && field.type === "email" && !isEmail(value)) message = "Enter a valid email address.";
    if (!message && field.type === "tel" && !isPhone(value)) message = "Enter a valid phone number.";
    setFieldError(field, message);
    if (message) valid = false;
  });
  return valid;
}
