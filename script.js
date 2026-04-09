/**
 * Calculator App — Script
 * Handles calculator logic, display formatting, theme switching,
 * keyboard input, and localStorage persistence.
 */

// ============================================================
// DOM References
// ============================================================
const displayValue = document.getElementById("display-value");
const keypad = document.getElementById("calculator-keypad");
const themeOptions = document.querySelectorAll(".theme-option");
const htmlElement = document.documentElement;

// ============================================================
// Calculator State
// ============================================================
/** @type {string} Current number being typed */
let currentOperand = "0";

/** @type {string|null} Previously stored operand */
let previousOperand = null;

/** @type {string|null} Active operator (+, -, x, /) */
let operator = null;

/** @type {boolean} Whether the last action was pressing equals */
let justEvaluated = false;

// ============================================================
// Display Helpers
// ============================================================

/**
 * Formats a number string with comma-separated thousands.
 * Handles decimals and negative numbers.
 * @param {string} numStr - The raw number string.
 * @returns {string} Formatted display string.
 */
function formatDisplay(numStr) {
  if (numStr === "Error") return "Error";

  // Handle trailing decimal (e.g. "42.")
  const hasTrailingDot = numStr.endsWith(".");
  const isNegative = numStr.startsWith("-");
  const absStr = isNegative ? numStr.slice(1) : numStr;

  const parts = absStr.split(".");
  const intPart = parts[0];
  const decPart = parts.length > 1 ? parts[1] : null;

  // Add commas to integer part
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let result = formatted;
  if (decPart !== null) {
    result += "." + decPart;
  } else if (hasTrailingDot) {
    result += ".";
  }

  return (isNegative ? "-" : "") + result;
}

/**
 * Updates the on-screen display with the current operand.
 */
function updateDisplay() {
  displayValue.textContent = formatDisplay(currentOperand);
}

// ============================================================
// Calculator Operations
// ============================================================

/**
 * Evaluates the stored expression (previousOperand operator currentOperand).
 * @returns {string} The result as a string, or "Error" on division by zero.
 */
function evaluate() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return currentOperand;

  let result;

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "x":
      result = prev * curr;
      break;
    case "/":
      if (curr === 0) return "Error";
      result = prev / curr;
      break;
    default:
      return currentOperand;
  }

  // Avoid floating point weirdness — round to 10 decimal places
  result = Math.round(result * 1e10) / 1e10;
  return result.toString();
}

// ============================================================
// Input Handlers
// ============================================================

/**
 * Handles digit and decimal point input.
 * @param {string} value - The digit or "." pressed.
 */
function handleNumber(value) {
  if (justEvaluated) {
    // Start fresh after an "=" press
    currentOperand = value === "." ? "0." : value;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (value === ".") {
    if (currentOperand.includes(".")) return; // prevent double dots
    currentOperand += ".";
  } else {
    // Replace leading zero
    if (currentOperand === "0") {
      currentOperand = value;
    } else {
      // Limit display length to avoid overflow
      if (currentOperand.replace(/[^0-9]/g, "").length >= 15) return;
      currentOperand += value;
    }
  }

  updateDisplay();
}

/**
 * Handles operator input (+, -, x, /).
 * @param {string} op - The operator string.
 */
function handleOperator(op) {
  justEvaluated = false;

  if (previousOperand !== null && operator !== null) {
    // Chain: evaluate previous expression first
    const result = evaluate();
    if (result === "Error") {
      handleReset();
      displayValue.textContent = "Error";
      return;
    }
    previousOperand = result;
    currentOperand = result;
    updateDisplay();
  } else {
    previousOperand = currentOperand;
  }

  operator = op;
  currentOperand = "0";
}

/**
 * Handles the equals button — evaluates the pending expression.
 */
function handleEquals() {
  if (previousOperand === null || operator === null) return;

  const result = evaluate();
  currentOperand = result;
  previousOperand = null;
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

/**
 * Handles DEL — removes the last character from the current operand.
 */
function handleDelete() {
  if (justEvaluated || currentOperand === "Error") {
    handleReset();
    return;
  }

  currentOperand = currentOperand.slice(0, -1);
  if (currentOperand === "" || currentOperand === "-") {
    currentOperand = "0";
  }
  updateDisplay();
}

/**
 * Resets the entire calculator state.
 */
function handleReset() {
  currentOperand = "0";
  previousOperand = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

// ============================================================
// Keypad Click Delegation
// ============================================================
keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;

  const value = btn.dataset.value;

  if ("0123456789.".includes(value)) {
    handleNumber(value);
  } else if (["+", "-", "x", "/"].includes(value)) {
    handleOperator(value);
  } else if (value === "=") {
    handleEquals();
  } else if (value === "del") {
    handleDelete();
  } else if (value === "reset") {
    handleReset();
  }
});

// ============================================================
// Keyboard Support
// ============================================================
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/^[0-9]$/.test(key)) {
    handleNumber(key);
  } else if (key === ".") {
    handleNumber(".");
  } else if (key === "+" || key === "-") {
    handleOperator(key);
  } else if (key === "*") {
    handleOperator("x");
  } else if (key === "/") {
    e.preventDefault(); // prevent Firefox quick-find
    handleOperator("/");
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    handleEquals();
  } else if (key === "Backspace") {
    handleDelete();
  } else if (key === "Escape") {
    handleReset();
  }
});

// ============================================================
// Theme Switching
// ============================================================

/**
 * Sets the active theme and persists to localStorage.
 * @param {string} themeValue - "1", "2", or "3".
 */
function setTheme(themeValue) {
  htmlElement.setAttribute("data-theme", themeValue);
  localStorage.setItem("calculator-theme", themeValue);

  // Update ARIA states
  themeOptions.forEach((opt) => {
    opt.setAttribute(
      "aria-checked",
      opt.dataset.themeValue === themeValue ? "true" : "false"
    );
  });
}

themeOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    setTheme(opt.dataset.themeValue);
  });
});

// ============================================================
// Initialization
// ============================================================

/**
 * Determines the initial theme from localStorage or
 * system preference (prefers-color-scheme), then applies it.
 */
function initTheme() {
  const saved = localStorage.getItem("calculator-theme");

  if (saved) {
    setTheme(saved);
    return;
  }

  // Bonus: detect system dark/light preference
  if (window.matchMedia) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "1" : "2");
  } else {
    setTheme("1");
  }
}

initTheme();
updateDisplay();
