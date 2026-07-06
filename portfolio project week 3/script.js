/* ==========================================================================
   script.js
   Interactive functionality for the portfolio site.
   Organized the same way it was built, day by day.
   ========================================================================== */

/* -----------------------------------------------------------
   DAY 1 — Setup: confirm the script is linked and running
   ----------------------------------------------------------- */
console.log("script.js loaded successfully ✅");

/* Run everything only after the HTML has fully loaded */
document.addEventListener("DOMContentLoaded", function () {
  setGreeting();
  loadSavedTheme();
  setupThemeToggle();
  setupFormValidation();
  setupCharCounter();
  setupBackToTop();
});

/* ==========================================================================
   DAY 2 & 3 — FEATURE 1: Dynamic greeting (DOM manipulation)
   Updates a paragraph in the About section based on the time of day.
   ========================================================================== */
function setGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return; // stop safely if the element isn't on the page

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good morning! 👋";
  } else if (hour < 18) {
    greeting = "Good afternoon! 👋";
  } else {
    greeting = "Good evening! 👋";
  }

  greetingEl.textContent = greeting;
}

/* ==========================================================================
   FEATURE 2 — Dark mode toggle (event listener + Local Storage)
   ========================================================================== */
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", toggleDarkMode);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);

  updateToggleIcon(isDark);
}

/* Runs once on page load so the theme choice is remembered next visit */
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("darkMode");

  if (savedTheme === "true") {
    document.body.classList.add("dark-mode");
    updateToggleIcon(true);
  }
}

function updateToggleIcon(isDark) {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
}

/* ==========================================================================
   FEATURE 3 — Live character counter on the message field
   ========================================================================== */
function setupCharCounter() {
  const messageField = document.getElementById("message");
  const counter = document.getElementById("char-count");
  if (!messageField || !counter) return;

  messageField.addEventListener("input", function () {
    const length = messageField.value.length;
    counter.textContent = `${length} / 10 characters minimum`;

    // reuse the same class the error messages use, just for a color cue
    if (length >= 10) {
      counter.classList.add("char-count-ok");
    } else {
      counter.classList.remove("char-count-ok");
    }
  });
}

/* ==========================================================================
   FEATURE 4 — Back-to-top button
   ========================================================================== */
function setupBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  // Show the button only after scrolling down a bit
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================================================================
   DAY 4 — FORM VALIDATION (with real-time + on-submit feedback)
   ========================================================================== */
function setupFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");

  // Real-time feedback: validate each field as the user leaves it
  nameField.addEventListener("blur", () => validateName(nameField));
  emailField.addEventListener("blur", () => validateEmail(emailField));
  messageField.addEventListener("blur", () => validateMessage(messageField));

  // Clear a field's error as soon as the user starts fixing it
  nameField.addEventListener("input", () => clearError("name"));
  emailField.addEventListener("input", () => clearError("email"));
  messageField.addEventListener("input", () => clearError("message"));

  // Final check on submit
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const isNameValid = validateName(nameField);
    const isEmailValid = validateEmail(emailField);
    const isMessageValid = validateMessage(messageField);

    if (isNameValid && isEmailValid && isMessageValid) {
      showFormStatus("Message sent successfully! 🎉", true);
      form.reset();
      document.getElementById("char-count").textContent = "0 / 10 characters minimum";
    } else {
      showFormStatus("Please fix the errors above.", false);
    }
  });
}

/* --- Reusable validation functions, one per field --- */

function validateName(field) {
  if (field.value.trim().length < 2) {
    showError("name", "Please enter your name (at least 2 characters).");
    return false;
  }
  clearError("name");
  return true;
}

function validateEmail(field) {
  const value = field.value.trim();
  // simple, beginner-friendly check: needs an "@" and a "." after it
  const isValid = value.includes("@") && value.indexOf(".", value.indexOf("@")) > -1;

  if (!isValid) {
    showError("email", "Please enter a valid email address.");
    return false;
  }
  clearError("email");
  return true;
}

function validateMessage(field) {
  if (field.value.trim().length < 10) {
    showError("message", "Message must be at least 10 characters.");
    return false;
  }
  clearError("message");
  return true;
}

/* --- Reusable helpers for showing/clearing errors --- */

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add("input-error");
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = "";
  if (inputEl) inputEl.classList.remove("input-error");
}

function showFormStatus(message, success) {
  const statusEl = document.getElementById("form-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.remove("status-success", "status-error");
  statusEl.classList.add(success ? "status-success" : "status-error");
}
