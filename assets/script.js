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

// ============================================
// AML Screening Toggle
// ============================================
function toggleAMLPanel(button) {
  const screening = button.closest(".kyc-aml-screening");
  if (!screening) return false;

  const content = screening.querySelector(".aml-screening-content");
  const icon = button.querySelector("i");
  if (!content) return false;

  const isOpen = content.classList.toggle("show");
  button.classList.toggle("collapsed", !isOpen);

  if (icon) {
    icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(-90deg)";
  }

  button.setAttribute("aria-expanded", String(isOpen));
  return false;
}

function initAMLPanels() {
  const screenings = document.querySelectorAll(".kyc-aml-screening");

  screenings.forEach((screening, index) => {
    const header = screening.querySelector(".aml-screening-header");
    const button = screening.querySelector(".aml-toggle-btn");
    const content = screening.querySelector(".aml-screening-content");
    const icon = button?.querySelector("i");

    if (!header || !button || !content) return;

    const contentId = content.id || `aml-panel-${index + 1}`;
    content.id = contentId;
    button.setAttribute("aria-controls", contentId);
    button.setAttribute("aria-expanded", "false");

    content.classList.remove("show");
    button.classList.add("collapsed");
    if (icon) icon.style.transform = "rotate(-90deg)";

    if (!header.dataset.amlBound) {
      header.addEventListener("click", (event) => {
        if (event.target.closest(".aml-toggle-btn")) return;
        toggleAMLPanel(button);
      });
      header.dataset.amlBound = "true";
    }
  });
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
  initAMLPanels();

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

  // Setup decision form event listeners
  const decisionForm = document.getElementById("decisionForm");
  if (decisionForm) {
    decisionForm.addEventListener("change", generateDecisionSummary);
    decisionForm.addEventListener("input", generateDecisionSummary);
  }
});

// ============================================
// MAKER-CHECKER APPROVAL SYSTEM (4-EYES)
// ============================================

/**
 * Risk Tier Calculation Based on KYC Metadata
 */
const riskTierRules = {
  highRiskCountries: ["Hong Kong", "Iran", "North Korea", "Syria"],
  highRiskEmployers: ["Trading Co.", "Shell Corp", "Import-Export"],
  highRiskIndicators: ["cross-border", "high amount", "politically exposed"],
  mediumRiskCountries: ["Pakistan", "Bangladesh", "Nigeria"],
};

function calculateRiskTier(kycData) {
  let riskScore = 0;

  // Check nationality
  if (riskTierRules.highRiskCountries.includes(kycData.nationality)) {
    riskScore += 40;
  } else if (riskTierRules.mediumRiskCountries.includes(kycData.nationality)) {
    riskScore += 20;
  }

  // Check employer
  if (
    riskTierRules.highRiskEmployers.some((emp) =>
      kycData.employer?.toLowerCase().includes(emp.toLowerCase())
    )
  ) {
    riskScore += 30;
  }

  // Check submission age (older = lower risk)
  const submissionAgeHours = kycData.submissionAgeHours || 24;
  if (submissionAgeHours < 1) {
    riskScore += 10; // Very new submission
  }

  // Determine tier
  if (riskScore >= 50) {
    return { tier: "high", score: riskScore };
  } else if (riskScore >= 25) {
    return { tier: "medium", score: riskScore };
  }
  return { tier: "low", score: riskScore };
}

/**
 * Check if SLA is breached (24-hour rule for high-risk, 48-hour for others)
 */
function checkSLABreach(submissionTime, riskTier) {
  const now = new Date();
  const submittedAt = new Date(submissionTime);
  const hoursElapsed = (now - submittedAt) / (1000 * 60 * 60);

  const slaLimit = riskTier === "high" ? 24 : 48;
  const isBreach = hoursElapsed > slaLimit;

  return {
    isBreach,
    hoursElapsed: Math.round(hoursElapsed),
    slaLimit,
  };
}

/**
 * Role-based restriction checker for high-risk approvals
 */
function checkRoleRestriction(currentUserRole, riskTier, approvalType) {
  const restrictions = {
    high: {
      approve: ["Super Admin", "Senior Reviewer", "Compliance Manager"],
      reject: ["Super Admin", "Senior Reviewer", "Compliance Manager"],
      checker: ["Super Admin", "Compliance Manager"],
    },
    medium: {
      approve: ["Super Admin", "Senior Reviewer", "Reviewer"],
      reject: ["Super Admin", "Senior Reviewer", "Reviewer"],
      checker: ["Super Admin", "Senior Reviewer"],
    },
    low: {
      approve: ["Super Admin", "Reviewer", "Junior Reviewer"],
      reject: ["Super Admin", "Reviewer", "Junior Reviewer"],
      checker: ["Super Admin", "Reviewer"],
    },
  };

  const allowedRoles = restrictions[riskTier]?.[approvalType] || [];
  const isAllowed = allowedRoles.includes(currentUserRole);

  return {
    isAllowed,
    allowedRoles,
    currentRole: currentUserRole,
    message: isAllowed
      ? `Role approved for ${approvalType}`
      : `Only ${allowedRoles.join(", ")} can ${approvalType} ${riskTier}-risk cases.`,
  };
}

/**
 * Open Checker Review Modal for second-level approval
 */
function openCheckerReviewModal(userName, decision) {
  // Validate role restriction
  const currentRole = "Super Admin"; // In real app, get from session
  const riskTier = document.querySelector(`[data-risk-tier]`)?.dataset.riskTier || "medium";
  const restriction = checkRoleRestriction(currentRole, riskTier, "checker");

  const roleRestrictionBox = document.getElementById("roleRestrictionBox");

  if (!restriction.isAllowed) {
    roleRestrictionBox.style.display = "block";
    document.getElementById("roleRestrictionMessage").textContent =
      restriction.message;
    showNotification(restriction.message, "warning");
    return;
  }

  roleRestrictionBox.style.display = "none";

  // Set form values
  document.getElementById("checkerUserName").value = userName;
  document.getElementById("checkerDecision").value = decision;

  // Populate maker decision from the row
  populateMakerDecision(userName);

  // Populate metadata
  populateMetadataDisplay(userName, riskTier);

  // Show submit button
  document.getElementById("submitCheckerBtn").style.display = "block";

  // Open modal
  openModal("checkerReviewModal");
}

/**
 * Populate maker decision in checker review modal
 */
function populateMakerDecision(userName) {
  const makerInfo = {
    "Sarah Smith": {
      makerName: "Ahmed Hassan",
      decision: "Approve",
      timestamp: "2 hours ago",
      reasoning: "Document valid, face matches, acceptable transaction history",
    },
    "Mike Johnson": {
      makerName: "Sarah Watson",
      decision: "Approve",
      timestamp: "4 hours ago",
      reasoning: "Standard domestic transaction, all checks passed",
    },
  };

  const info = makerInfo[userName] || {
    makerName: "Unknown",
    decision: "Pending",
    timestamp: "N/A",
    reasoning: "",
  };

  document.getElementById("makerDecisionBox").innerHTML = `
    <div class="maker-decision">
      <p><strong>Maker:</strong> ${info.makerName}</p>
      <p><strong>Decision:</strong> <span class="badge badge-${info.decision.toLowerCase()}">${info.decision}</span></p>
      <p><strong>Timestamp:</strong> ${info.timestamp}</p>
      <p><strong>Reasoning:</strong> ${info.reasoning}</p>
    </div>
  `;
}

/**
 * Populate metadata display in checker modal
 */
function populateMetadataDisplay(userName, riskTier) {
  const kycMetadata = {
    "Sarah Smith": {
      riskTier: "MEDIUM",
      nationality: "United Kingdom",
      submissionAge: "1 day ago",
      documentType: "Passport",
      employer: "Finance Ltd",
      slaStatus: "On Track (18h remaining)",
    },
    "Mike Johnson": {
      riskTier: "LOW",
      nationality: "Canada",
      submissionAge: "3 days ago",
      documentType: "Driver License",
      employer: "Retail Store",
      slaStatus: "On Track (40h remaining)",
    },
  };

  const metadata =
    kycMetadata[userName] ||
    {
      riskTier: riskTier.toUpperCase(),
      nationality: "N/A",
      submissionAge: "N/A",
      documentType: "N/A",
      employer: "N/A",
      slaStatus: "N/A",
    };

  document.getElementById("displayRiskTier").textContent = metadata.riskTier;
  document.getElementById("displayRiskTier").className =
    "metadata-value risk-" + metadata.riskTier.toLowerCase();

  document.getElementById("displayNationality").textContent = metadata.nationality;
  document.getElementById("displaySubmissionAge").textContent = metadata.submissionAge;
  document.getElementById("displayDocumentType").textContent = metadata.documentType;
  document.getElementById("displayEmployer").textContent = metadata.employer;
  document.getElementById("displayMaker").textContent = "Ahmed Hassan / Sarah Watson";

  const slaElement = document.getElementById("displaySLAStatus");
  slaElement.textContent = metadata.slaStatus;
  if (metadata.slaStatus.includes("Breach")) {
    slaElement.classList.add("sla-breach");
  } else {
    slaElement.classList.remove("sla-breach");
  }
}

/**
 * Update checker decision selection
 */
function updateCheckerDecision(decision) {
  document.getElementById("checkerDecision").value = decision;
  generateCheckerSummary();
}

/**
 * Generate checker review summary
 */
function generateCheckerSummary() {
  const formData = new FormData(document.getElementById("checkerReviewForm"));
  const decision = formData.get("checkerDecision");
  const findings = document.getElementById("checkerFindings").value;

  let summary = `<strong>Checker Decision:</strong> ${decision?.toUpperCase() || "Pending"}<br>`;

  const checklist = [];
  if (document.getElementById("docVerified").checked) checklist.push("Doc verified");
  if (document.getElementById("faceMatched").checked) checklist.push("Face matched");
  if (document.getElementById("noRedFlags").checked) checklist.push("No red flags");
  if (document.getElementById("makerLogicSound").checked)
    checklist.push("Maker logic sound");

  if (checklist.length > 0) {
    summary += `<strong>Verification Passed:</strong> ${checklist.join(", ")}<br>`;
  }

  if (findings) {
    summary += `<strong>Findings:</strong> ${findings.substring(0, 100)}...<br>`;
  }

  summary += `<strong>Timestamp:</strong> ${new Date().toLocaleTimeString()}<br>`;

  document.getElementById("checkerSummary").innerHTML = summary;
}

/**
 * Submit checker review decision
 */
function submitCheckerReview() {
  const form = document.getElementById("checkerReviewForm");
  if (!form.checkValidity()) {
    showNotification("Please complete all required checks.", "warning");
    return;
  }

  const formData = new FormData(form);
  const userName = formData.get("checkerUserName");
  const decision = formData.get("checkerDecision");

  // Build checker decision object
  const checkerDecisionData = {
    timestamp: new Date().toISOString(),
    checkedBy: "Current Admin User",
    userName: userName,
    decision: decision,
    findings: document.getElementById("checkerFindings").value,
    verificationChecks: {
      documentVerified: document.getElementById("docVerified").checked,
      faceMatched: document.getElementById("faceMatched").checked,
      noRedFlags: document.getElementById("noRedFlags").checked,
      makerLogicSound: document.getElementById("makerLogicSound").checked,
    },
  };

  console.log("Checker Decision Submitted:", checkerDecisionData);

  const message = decision === "approve"
    ? `✓ KYC for ${userName} has been APPROVED by Checker (4-Eyes Complete)`
    : decision === "reject"
    ? `✗ KYC for ${userName} has been REJECTED at Checker level`
    : `⚠ KYC for ${userName} escalated to Senior Review`;

  showNotification(message, decision === "approve" ? "success" : "warning");

  closeModal("checkerReviewModal");

  // Update row status
  updateKYCRowStatus(userName, `checker-${decision}`);
}

// Update Event Listeners on Form Changes
document.addEventListener("DOMContentLoaded", function () {
  const checkerForm = document.getElementById("checkerReviewForm");
  if (checkerForm) {
    checkerForm.addEventListener("change", generateCheckerSummary);
    checkerForm.addEventListener("input", generateCheckerSummary);
  }
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

// ============================================
// KYC Decision Control Functions
// ============================================

/**
 * Opens the decision modal with context for approve/reject
 * @param {string} userName - Name of the user being reviewed
 * @param {string} decision - 'approve' or 'reject'
 */
function openDecisionModal(userName, decision) {
  // Set form values
  document.getElementById("decisionType").value = decision;
  document.getElementById("kycUserName").value = userName;

  // Update decision type display
  const decisionTypeDisplay = document.getElementById("decisionTypeDisplay");
  const isApprove = decision === "approve";
  decisionTypeDisplay.innerHTML = `
    <div class="decision-badge ${isApprove ? "approve-badge" : "reject-badge"}">
      <i class="fas fa-${isApprove ? "check-circle" : "times-circle"}"></i>
      <span class="user-name">${userName}</span>
      <span class="decision-text">${isApprove ? "APPROVE" : "REJECT"}</span>
    </div>
  `;

  // Show/hide rejection reason section based on decision type
  const rejectionReasonSection = document.getElementById("rejectionReasonSection");
  const conditionsSection = document.getElementById("conditionsSection");
  
  if (!isApprove) {
    rejectionReasonSection.style.display = "block";
    document.getElementById("rejectionReason").required = true;
    document.getElementById("rejectionDetails").required = true;
    conditionsSection.style.display = "none";
  } else {
    rejectionReasonSection.style.display = "none";
    document.getElementById("rejectionReason").required = false;
    document.getElementById("rejectionDetails").required = false;
    conditionsSection.style.display = "block";
  }

  // Clear previous form values
  resetDecisionForm();
  
  // Open the modal
  openModal("decisionModal");
}

/**
 * Resets the decision form
 */
function resetDecisionForm() {
  document.getElementById("decisionForm").reset();
  document.getElementById("decisionSummary").innerHTML = "";
}

/**
 * Submits the KYC decision with structured rationale
 */
function submitDecision() {
  const form = document.getElementById("decisionForm");
  
  // Validate form
  if (!form.checkValidity()) {
    showNotification("Please fill in all required fields.", "warning");
    return;
  }

  const formData = new FormData(form);
  const decision = formData.get("decisionType");
  const userName = formData.get("kycUserName");
  
  // Build structured decision object
  const decisionData = {
    timestamp: new Date().toISOString(),
    decidedBy: "Admin User", // In real app, get from session
    userName: userName,
    decision: decision,
    rejectionReason: decision === "reject" ? formData.get("rejectionReason") : null,
    rejectionDetails: decision === "reject" ? formData.get("rejectionDetails") : null,
    reviewerNotes: formData.get("reviewerNotes") || "",
    escalationComments: formData.get("escalationComments") || "",
    escalation: {
      escalateToManager: formData.get("escalateToManager") === "on",
      escalateToCompliance: formData.get("escalateToCompliance") === "on",
      requiresManualVerification: formData.get("requiresManualVerification") === "on"
    },
    conditions: decision === "approve" ? {
      conditionalApproval: formData.get("conditionalApproval") === "on",
      limitedTransaction: formData.get("limitedTransaction") === "on",
      needsReVerification: formData.get("needsReVerification") === "on",
      geographicRestriction: formData.get("geographicRestriction") === "on",
      conditionDetails: formData.get("conditionDetails") || ""
    } : null
  };

  // Log the decision (in real app, send to API)
  console.log("KYC Decision Submitted:", decisionData);

  // Show success notification
  const message = decision === "approve" 
    ? `KYC for ${userName} has been APPROVED` 
    : `KYC for ${userName} has been REJECTED`;
  
  showNotification(message, "success");

  // Close modal
  closeModal("decisionModal");
  
  // In a real app, you would:
  // 1. Send to backend API
  // 2. Update the row status
  // 3. Refresh the list
  
  // For demo, update the UI
  updateKYCRowStatus(userName, decision);
}

/**
 * Updates the KYC row status in the UI (demo function)
 */
function updateKYCRowStatus(userName, decision) {
  // Find the row with this user
  const rows = document.querySelectorAll(".kyc-row");
  rows.forEach(row => {
    const nameElement = row.querySelector(".kyc-user-name");
    if (nameElement && nameElement.textContent === userName) {
      // Update badge
      const badge = row.querySelector(".badge");
      if (badge) {
        badge.className = decision === "approve" 
          ? "badge badge-success" 
          : "badge badge-danger";
        badge.textContent = decision === "approve" ? "Approved" : "Rejected";
      }
      
      // Disable action buttons
      const actionButtons = row.querySelectorAll(".action-btn-small");
      actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      });
    }
  });
}

/**
 * Generate and display decision summary
 */
function generateDecisionSummary() {
  const formData = new FormData(document.getElementById("decisionForm"));
  const decision = formData.get("decisionType");
  const rejectionReason = formData.get("rejectionReason");
  const escalations = [];
  
  if (formData.get("escalateToManager") === "on") escalations.push("Manager");
  if (formData.get("escalateToCompliance") === "on") escalations.push("Compliance");
  if (formData.get("requiresManualVerification") === "on") escalations.push("Manual Verification");
  
  let summary = `<strong>Decision:</strong> ${decision === "approve" ? "APPROVED" : "REJECTED"}<br>`;
  
  if (decision === "reject") {
    summary += `<strong>Reason:</strong> ${rejectionReason || "N/A"}<br>`;
  }
  
  if (escalations.length > 0) {
    summary += `<strong>Escalation:</strong> ${escalations.join(", ")}<br>`;
  }
  
  const notes = formData.get("reviewerNotes");
  if (notes) {
    summary += `<strong>Notes:</strong> ${notes}<br>`;
  }
  
  document.getElementById("decisionSummary").innerHTML = summary;
}

// ============================================
// AUDIT TRAIL - COMPLIANCE & HISTORY TRACKING
// ============================================

/**
 * Global audit trail storage (in real app, fetch from database)
 */
const auditTrailDatabase = {};

/**
 * Initialize audit trail for a user (called once when case is opened)
 */
function initializeAuditTrail(userName) {
  if (!auditTrailDatabase[userName]) {
    auditTrailDatabase[userName] = {
      userName: userName,
      caseOpenedTime: new Date().toISOString(),
      caseOpenedBy: "Admin User", // In real app, get from session
      events: [],
      decisions: [],
      changes: []
    };
    
    // Log opening event
    logAuditEvent(userName, {
      type: "case_opened",
      reviewer: "Admin User",
      role: "Super Admin",
      description: "KYC case opened for review",
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Log an audit event (called throughout the workflow)
 */
function logAuditEvent(userName, event) {
  if (!auditTrailDatabase[userName]) {
    initializeAuditTrail(userName);
  }
  
  auditTrailDatabase[userName].events.push({
    ...event,
    timestamp: event.timestamp || new Date().toISOString()
  });
}

/**
 * Log a decision event
 */
function logDecision(userName, decision, reviewer, role, details) {
  if (!auditTrailDatabase[userName]) {
    initializeAuditTrail(userName);
  }
  
  const decisionRecord = {
    timestamp: new Date().toISOString(),
    decidedBy: reviewer,
    role: role,
    decision: decision,
    details: details
  };
  
  auditTrailDatabase[userName].decisions.push(decisionRecord);
  
  // Log as event too
  logAuditEvent(userName, {
    type: "decision_made",
    reviewer: reviewer,
    role: role,
    description: `Decision: ${decision.toUpperCase()} by ${reviewer}`,
    action: `${decision.toUpperCase()}`
  });
}

/**
 * Log a change or override
 */
function logChange(userName, changeType, oldValue, newValue, changedBy) {
  if (!auditTrailDatabase[userName]) {
    initializeAuditTrail(userName);
  }
  
  auditTrailDatabase[userName].changes.push({
    timestamp: new Date().toISOString(),
    type: changeType,
    from: oldValue,
    to: newValue,
    changedBy: changedBy,
    isOverride: oldValue !== null && oldValue !== undefined && oldValue !== ""
  });
  
  // Log as event
  const isOverride = oldValue !== null && oldValue !== undefined && oldValue !== "";
  logAuditEvent(userName, {
    type: isOverride ? "override" : "change",
    reviewer: changedBy,
    role: "Super Admin",
    description: `${changeType} changed from: ${oldValue} to: ${newValue}`,
    action: isOverride ? "DECISION OVERRIDE" : "FIELD CHANGE"
  });
}

/**
 * Opens the audit trail modal and populates it with complete history
 */
function openAuditTrailModal(userName) {
  // Initialize if doesn't exist
  if (!auditTrailDatabase[userName]) {
    initializeAuditTrail(userName);
  }
  
  const auditData = auditTrailDatabase[userName];
  
  // Populate case information
  document.getElementById("auditUserName").textContent = userName;
  document.getElementById("auditCaseOpenedTime").textContent = formatDateTime(auditData.caseOpenedTime);
  document.getElementById("auditCaseOpenedBy").textContent = auditData.caseOpenedBy;
  
  // Calculate current status
  const currentStatus = auditData.decisions.length > 0 
    ? auditData.decisions[auditData.decisions.length - 1].decision.toUpperCase()
    : "PENDING";
  document.getElementById("auditCurrentStatus").textContent = currentStatus;
  
  // Get risk tier (from associated KYC row)
  const riskTier = getRiskTierForUser(userName);
  document.getElementById("auditRiskTier").textContent = riskTier.toUpperCase();
  
  // Last modified
  const lastEvent = auditData.events[auditData.events.length - 1];
  document.getElementById("auditLastModified").textContent = lastEvent 
    ? formatDateTime(lastEvent.timestamp) 
    : formatDateTime(auditData.caseOpenedTime);
  
  // Populate timeline
  populateAuditTimeline(auditData);
  
  // Populate changes
  populateAuditChanges(auditData);
  
  // Populate decisions
  populateAuditDecisions(auditData);
  
  // Populate compliance information
  populateComplianceInfo(auditData);
  
  // Open the modal
  openModal("auditTrailModal");
}

/**
 * Populate the timeline section
 */
function populateAuditTimeline(auditData) {
  const timelineContainer = document.getElementById("auditTimeline");
  
  if (auditData.events.length === 0) {
    timelineContainer.innerHTML = '<p class="no-data">No events recorded yet.</p>';
    return;
  }
  
  timelineContainer.innerHTML = auditData.events.map((event, index) => `
    <div class="audit-event ${event.type === 'case_opened' ? 'completed' : 'completed'}">
      <div class="audit-event-header">
        <div class="audit-event-time">
          <i class="fas fa-clock"></i> ${formatDateTime(event.timestamp)}
        </div>
        <div>
          <span class="audit-event-reviewer">${event.reviewer}</span>
          <span class="audit-event-role">${event.role}</span>
        </div>
      </div>
      <div class="audit-event-description">
        <strong>${getEventTypeLabel(event.type)}:</strong> ${event.description}
      </div>
      ${event.action ? `<span class="audit-event-action">${event.action}</span>` : ''}
    </div>
  `).join('');
}

/**
 * Populate changes and overrides section
 */
function populateAuditChanges(auditData) {
  const changesContainer = document.getElementById("auditChanges");
  
  if (auditData.changes.length === 0) {
    changesContainer.innerHTML = '<p class="no-data">No changes recorded.</p>';
    return;
  }
  
  changesContainer.innerHTML = auditData.changes.map(change => `
    <div class="audit-change-item ${change.isOverride ? 'override' : ''}">
      <div class="change-details">
        <div class="change-type">
          <i class="fas fa-${change.isOverride ? 'ban' : 'edit'}"></i>
          ${change.isOverride ? 'DECISION OVERRIDE' : 'FIELD CHANGE'}: ${change.type}
        </div>
        <div class="change-from">
          <strong>From:</strong> ${change.from || 'Empty'}
        </div>
        <div class="change-to">
          <strong>To:</strong> ${change.to || 'Empty'}
        </div>
      </div>
      <div class="change-by">
        <strong>Changed By:</strong><br>
        ${change.changedBy}<br>
        <small>${formatDateTime(change.timestamp)}</small>
      </div>
    </div>
  `).join('');
}

/**
 * Populate decisions history section
 */
function populateAuditDecisions(auditData) {
  const decisionsContainer = document.getElementById("auditDecisions");
  
  if (auditData.decisions.length === 0) {
    decisionsContainer.innerHTML = '<p class="no-data">No decisions recorded yet.</p>';
    return;
  }
  
  decisionsContainer.innerHTML = auditData.decisions.map((decision, index) => `
    <div class="audit-decision-item ${decision.decision}">
      <div class="decision-header">
        <div>
          <span class="decision-badge ${decision.decision}">
            <i class="fas fa-${decision.decision === 'approve' ? 'check-circle' : decision.decision === 'reject' ? 'times-circle' : 'exclamation-triangle'}"></i>
            ${decision.decision.toUpperCase()}
          </span>
          <span class="decision-timestamp">${formatDateTime(decision.timestamp)}</span>
        </div>
        <div>
          <strong>${decision.role}</strong><br>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">${decision.decidedBy}</span>
        </div>
      </div>
      <div class="decision-details">
        <div class="detail-item">
          <span class="detail-label">Decision:</span>
          <span class="detail-value" style="text-transform: uppercase; font-weight: 600;">${decision.decision}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Decided By:</span>
          <span class="detail-value">${decision.decidedBy}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Role:</span>
          <span class="detail-value">${decision.role}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Level:</span>
          <span class="detail-value">${index === 0 ? '1st Level (Maker)' : index === 1 ? '2nd Level (Checker)' : 'Senior Review'}</span>
        </div>
      </div>
      ${decision.details && decision.details.reason ? `
        <div class="decision-rationale">
          <strong style="color: var(--text-primary);">Reason/Notes:</strong><br>
          ${decision.details.reason}
        </div>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Populate compliance information
 */
function populateComplianceInfo(auditData) {
  // 4-Eyes Status
  const hasMakerDecision = auditData.decisions.some(d => d.role === 'Reviewer' || d.role === 'Maker');
  const hasCheckerDecision = auditData.decisions.some(d => d.role === 'Checker');
  const fourEyesStatus = hasMakerDecision && hasCheckerDecision 
    ? '<span class="compliance-status-pass"><i class="fas fa-check-circle"></i> COMPLETE</span>'
    : hasMakerDecision && !hasCheckerDecision
    ? '<span class="compliance-status-warning"><i class="fas fa-hourglass-half"></i> PENDING CHECKER</span>'
    : '<span class="compliance-status-warning"><i class="fas fa-hourglass-half"></i> PENDING MAKER</span>';
  document.getElementById("auditFourEyesStatus").innerHTML = fourEyesStatus;
  
  // SLA Status
  const caseAge = new Date() - new Date(auditData.caseOpenedTime);
  const hoursElapsed = caseAge / (1000 * 60 * 60);
  const slaLimit = 24; // 24 hours for high-risk
  const slaStatus = hoursElapsed > slaLimit
    ? `<span class="compliance-status-fail"><i class="fas fa-times-circle"></i> BREACHED (${Math.round(hoursElapsed)}h)</span>`
    : `<span class="compliance-status-pass"><i class="fas fa-check-circle"></i> ON TRACK (${Math.round(slaLimit - hoursElapsed)}h)</span>`;
  document.getElementById("auditSLAStatus").innerHTML = slaStatus;
  
  // Escalations
  const escalations = auditData.events
    .filter(e => e.type === 'escalation')
    .map(e => e.description)
    .join(", ");
  document.getElementById("auditEscalations").textContent = escalations || 'None';
  
  // Data Integrity
  const dataIntegrity = '<span class="compliance-status-pass"><i class="fas fa-check-circle"></i> VERIFIED</span>';
  document.getElementById("auditDataIntegrity").innerHTML = dataIntegrity;
}

/**
 * Helper - Get risk tier for user
 */
function getRiskTierForUser(userName) {
  const row = Array.from(document.querySelectorAll(".kyc-row")).find(r => 
    r.querySelector(".kyc-user-name")?.textContent === userName
  );
  return row?.dataset.riskTier || "unknown";
}

/**
 * Helper - Format date time
 */
function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Helper - Format date only
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

/**
 * Helper - Get event type label
 */
function getEventTypeLabel(type) {
  const labels = {
    'case_opened': 'Case Opened',
    'decision_made': 'Decision Made',
    'escalation': 'Escalation',
    'override': 'Override',
    'change': 'Change',
    'verification': 'Verification'
  };
  return labels[type] || type;
}

/**
 * Export audit trail to various formats
 */
function exportAuditTrail(format) {
  // Get the modal data
  const userName = document.getElementById("auditUserName").textContent;
  const auditData = auditTrailDatabase[userName];
  
  if (!auditData) {
    showNotification("No audit data found.", "warning");
    return;
  }
  
  if (format === 'csv') {
    exportAuditTrailCSV(auditData);
  } else if (format === 'json') {
    exportAuditTrailJSON(auditData);
  } else if (format === 'pdf') {
    showNotification("PDF export will be handled by print dialog.", "info");
    printAuditTrail();
  }
}

/**
 * Export audit trail as CSV
 */
function exportAuditTrailCSV(auditData) {
  let csv = [];
  
  // Header
  csv.push("AUDIT TRAIL - KYC COMPLIANCE RECORD");
  csv.push("");
  csv.push(`User Name,${auditData.userName}`);
  csv.push(`Case Opened,${formatDateTime(auditData.caseOpenedTime)}`);
  csv.push(`Opened By,${auditData.caseOpenedBy}`);
  csv.push("");
  
  // Events
  csv.push("EVENT TIMELINE");
  csv.push("Timestamp,Event Type,Reviewer,Role,Description");
  auditData.events.forEach(event => {
    csv.push(`"${formatDateTime(event.timestamp)}","${event.type}","${event.reviewer}","${event.role}","${event.description}"`);
  });
  csv.push("");
  
  // Decisions
  csv.push("DECISION HISTORY");
  csv.push("Timestamp,Decision,Decided By,Role,Reason");
  auditData.decisions.forEach(decision => {
    const reason = decision.details?.reason || "N/A";
    csv.push(`"${formatDateTime(decision.timestamp)}","${decision.decision.toUpperCase()}","${decision.decidedBy}","${decision.role}","${reason}"`);
  });
  csv.push("");
  
  // Changes
  if (auditData.changes.length > 0) {
    csv.push("CHANGES & OVERRIDES");
    csv.push("Timestamp,Type,From,To,Changed By,Override");
    auditData.changes.forEach(change => {
      csv.push(`"${formatDateTime(change.timestamp)}","${change.type}","${change.from}","${change.to}","${change.changedBy}","${change.isOverride ? 'YES' : 'NO'}"`);
    });
  }
  
  // Download
  const link = document.createElement("a");
  link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv.join("\n"));
  link.download = `audit-trail-${auditData.userName}-${formatDate(new Date().toISOString())}.csv`;
  link.click();
  
  showNotification("Audit trail exported as CSV.", "success");
}

/**
 * Export audit trail as JSON
 */
function exportAuditTrailJSON(auditData) {
  const jsonString = JSON.stringify(auditData, null, 2);
  const link = document.createElement("a");
  link.href = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);
  link.download = `audit-trail-${auditData.userName}-${formatDate(new Date().toISOString())}.json`;
  link.click();
  
  showNotification("Audit trail exported as JSON.", "success");
}

/**
 * Print audit trail (for PDF or paper)
 */
function printAuditTrail() {
  const printWindow = window.open("", "", "height=600, width=800");
  const auditModal = document.getElementById("auditTrailModal");
  const content = auditModal.querySelector(".modal-content").innerHTML;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Audit Trail - Compliance Record</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 20px;
          }
          h2 { color: #001D3B; border-bottom: 2px solid #001D3B; padding-bottom: 10px; }
          h3 { color: #48C3A7; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .badge { padding: 3px 8px; border-radius: 3px; font-size: 0.85rem; font-weight: bold; }
          .approve { background-color: #d4edda; color: #155724; }
          .reject { background-color: #f8d7da; color: #721c24; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.print();
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Modify submitDecision to log audit trail
 */
const originalSubmitDecision = window.submitDecision;
window.submitDecision = function() {
  const form = document.getElementById("decisionForm");
  if (!form.checkValidity()) {
    showNotification("Please fill in all required fields.", "warning");
    return;
  }

  const formData = new FormData(form);
  const decision = formData.get("decisionType");
  const userName = formData.get("kycUserName");
  
  // Initialize audit trail if needed
  initializeAuditTrail(userName);
  
  // Log the decision
  logDecision(userName, decision, "Admin User", "Maker", {
    reason: decision === "reject" 
      ? formData.get("rejectionDetails") 
      : formData.get("reviewerNotes"),
    rejectionReason: decision === "reject" ? formData.get("rejectionReason") : null
  });
  
  // Call original function
  originalSubmitDecision.call(this);
};

/**
 * Modify submitCheckerReview to log audit trail
 */
const originalSubmitCheckerReview = window.submitCheckerReview;
window.submitCheckerReview = function() {
  const form = document.getElementById("checkerReviewForm");
  if (!form.checkValidity()) {
    showNotification("Please complete all required checks.", "warning");
    return;
  }

  const formData = new FormData(form);
  const userName = formData.get("checkerUserName");
  const decision = formData.get("checkerDecision");
  
  // Initialize audit trail if needed
  initializeAuditTrail(userName);
  
  // Log the checker decision
  logDecision(userName, decision, "Admin User", "Checker", {
    reason: document.getElementById("checkerFindings").value
  });
  
  // Call original function
  originalSubmitCheckerReview.call(this);
};
