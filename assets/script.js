// ============================================
// Theme Management
// ============================================

/**
 * Reads saved theme from localStorage and applies it.
 * Works across both login.html (uses data-theme on <html>)
 * and dashboard pages (uses .dark-mode on <body>).
 */
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark"; // default dark
  applyTheme(savedTheme);
}

/**
 * Centralized theme applier — keeps login & dashboard in sync.
 * Login page uses: document.documentElement data-theme attribute
 * Dashboard pages use: document.body .dark-mode class
 */
function applyTheme(theme) {
  const isDark = theme === "dark";

  // Dashboard pages
  document.body.classList.toggle("dark-mode", isDark);

  // Login page (login.css uses [data-theme="dark"] on <html>)
  document.documentElement.setAttribute("data-theme", theme);

  // Update all theme toggle icons on the page
  updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
  // Dashboard header toggle
  const toggleIcon = document.querySelector(".theme-toggle i");
  if (toggleIcon) {
    toggleIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
  // Login page toggle
  const loginToggleIcon = document.querySelector(".theme-toggle-login i");
  if (loginToggleIcon) {
    loginToggleIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}

function toggleTheme() {
  const isDark =
    document.body.classList.contains("dark-mode") ||
    document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
}

// ============================================
// Login Form Handling
// ============================================
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  if (!email || !password) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  // Simulate login — replace with real API call
  showNotification("Signing in...", "info");
  setTimeout(() => {
    showNotification("Welcome back, Admin!", "success");
  }, 1200);
}

// ============================================
// Sidebar Management
// ============================================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  if (!sidebar) return;

  // On desktop: collapse/expand
  if (window.innerWidth > 768) {
    sidebar.classList.toggle("collapsed");
    if (content) content.classList.toggle("expanded");
  } else {
    // On mobile: slide in/out
    sidebar.classList.toggle("open");
  }
}

function navigateTo(page) {
  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active to the clicked item
  const target = event?.target?.closest(".nav-item");
  if (target) target.classList.add("active");

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }
}

// ============================================
// Modal Management
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// Close modal on backdrop click
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("show");
    document.body.style.overflow = "";
  }
});

// Close modal on × button
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal-close")) {
    const modal = event.target.closest(".modal");
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  }
});

// ============================================
// Table Search & Filter
// ============================================
function filterTable(tableId, searchValue) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  const searchTerm = searchValue.toLowerCase();

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

// ============================================
// Date Filter
// ============================================
function setDateFilter(filterType) {
  const today = new Date();
  let startDate = new Date();

  switch (filterType) {
    case "daily":
      startDate = new Date(today);
      break;
    case "weekly":
      startDate.setDate(today.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(today.getMonth() - 1);
      break;
    case "yearly":
      startDate.setFullYear(today.getFullYear() - 1);
      break;
  }

  return { startDate, endDate: today };
}

// ============================================
// Notification Management
// ============================================
function showNotification(message, type = "success") {
  // Map type to Font Awesome icon
  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-times-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  };

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="${iconMap[type] || iconMap.info}"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Trigger show animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });
  });

  // Auto-dismiss after 3 s
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 350);
  }, 3000);
}

// ============================================
// Form Handling
// ============================================
function submitForm(formId, action) {
  const form = document.getElementById(formId);
  if (!form) return;

  const formData = new FormData(form);
  console.log(`Form submitted to ${action}:`, Object.fromEntries(formData));

  showNotification("Action completed successfully!", "success");

  const modal = form.closest(".modal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  form.reset();
}

// ============================================
// Data Formatting
// ============================================
function formatDate(date) {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Apply saved theme (or dark by default)
  initTheme();

  // Dashboard header theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Login page theme toggle (also wired via onclick in HTML, but belt-and-suspenders)
  const loginThemeToggle = document.querySelector(".theme-toggle-login");
  if (loginThemeToggle) {
    loginThemeToggle.addEventListener("click", toggleTheme);
  }

  // Hamburger menu
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
  }

  // Auto-setup search inputs
  const searchInputs = document.querySelectorAll("[data-search-table]");
  searchInputs.forEach((input) => {
    input.addEventListener("keyup", function () {
      filterTable(this.dataset.searchTable, this.value);
    });
  });

  // Auto-setup date filter buttons
  const dateFilterBtns = document.querySelectorAll("[data-date-filter]");
  dateFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      setDateFilter(this.dataset.dateFilter);
    });
  });
});

// ============================================
// Chart Helper (for dashboard charts)
// ============================================
function drawSimpleChart(canvasId, labels, data, chartType = "bar") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const isDark = document.body.classList.contains("dark-mode");
  const textColor = isDark ? "#eaf5f4" : "#0f2622";

  // Placeholder — integrate Chart.js or similar here
  console.log(`Chart: ${chartType}`, { labels, data, textColor });
}

// ============================================
// Export Functions
// ============================================
function exportTableToCSV(tableId, filename = "export.csv") {
  const table = document.getElementById(tableId);
  if (!table) return;

  const csv = [];

  const headers = Array.from(table.querySelectorAll("th")).map(
    (th) => `"${th.textContent.trim()}"`,
  );
  csv.push(headers.join(","));

  table.querySelectorAll("tbody tr").forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td")).map(
      (td) => `"${td.textContent.trim()}"`,
    );
    csv.push(cells.join(","));
  });

  const link = document.createElement("a");
  link.href =
    "data:text/csv;charset=utf-8," + encodeURIComponent(csv.join("\n"));
  link.download = filename;
  link.click();
}

// ============================================
// Pagination Helper
// ============================================
function paginate(items, pageNumber, itemsPerPage = 10) {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
}
function goToProfile() {
  window.location.href = "profile.html";
}
