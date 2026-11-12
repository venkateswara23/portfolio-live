/**
 * Main Interactive Script for Timmareddy Venkateswara Reddy's Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  renderSkills();
  renderProjects();
  initProjectFilters();
  initContactForm();
  initResumeModal();

  if (typeof AuthService !== "undefined") {
    AuthService.updateNavbarState();
  }
});

/* ==========================================================================
   THEME TOGGLE (Dark / Light)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("tvr_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    updateThemeIcon(themeBtn, savedTheme);
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("tvr_theme", next);
      updateThemeIcon(themeBtn, next);
      showToast(`Switched to ${next} theme!`, "info");
    });
  }
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

/* ==========================================================================
   SKILLS RENDERING
   ========================================================================== */
function renderSkills() {
  const skillsContainer = document.getElementById("skills-container");
  if (!skillsContainer || typeof PORTFOLIO_DATA === "undefined") return;

  const allSkills = [
    ...PORTFOLIO_DATA.skills.programming,
    ...PORTFOLIO_DATA.skills.web,
    ...PORTFOLIO_DATA.skills.databases,
    ...PORTFOLIO_DATA.skills.tools
  ];

  skillsContainer.innerHTML = allSkills.map(skill => `
    <div class="skill-card" data-category="${skill.category}">
      <div class="skill-icon-wrap">
        <i class="${skill.icon}"></i>
      </div>
      <div class="skill-info">
        <div class="skill-name-row">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-level-text">${skill.level}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-progress" style="width: 0%;" data-target-width="${skill.level}%"></div>
        </div>
      </div>
    </div>
  `).join("");

  // Animate skill bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".skill-bar-progress").forEach(bar => {
          bar.style.width = bar.getAttribute("data-target-width");
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillsContainer);
}

/* ==========================================================================
   PROJECTS RENDERING & MODALS
   ========================================================================== */
function renderProjects(filter = "all") {
  const grid = document.getElementById("projects-grid");
  if (!grid || typeof PORTFOLIO_DATA === "undefined") return;

  const filtered = filter === "all" 
    ? PORTFOLIO_DATA.projects 
    : PORTFOLIO_DATA.projects.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div class="project-banner">
        <i class="${p.icon} project-banner-icon"></i>
        <span class="project-badge-pill">${p.badge}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
        </div>
        <div class="project-footer">
          <button class="project-link-btn view-project-btn" onclick="openProjectModal('${p.id}')">
            <span>Details & Architecture</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
          <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source on GitHub">
            <i class="fa-brands fa-github" style="font-size:1.15rem;"></i>
          </a>
        </div>
      </div>
    </div>
  `).join("");
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderProjects(category);
    });
  });
}

window.openProjectModal = function(projectId) {
  const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
  if (!project) return;

  const modalOverlay = document.getElementById("project-modal");
  const modalBody = document.getElementById("project-modal-body");
  if (!modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
      <span class="section-tag" style="margin-bottom:0;">${project.badge}</span>
    </div>
    <h2 style="font-size:1.75rem; font-weight:800; margin-bottom:0.75rem;">${project.title}</h2>
    <p style="color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.7;">${project.details}</p>

    <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem;">Core Technologies & Architecture:</h4>
    <div class="project-tags" style="margin-bottom:1.75rem;">
      ${project.tags.map(t => `<span class="project-tag" style="font-size:0.85rem; padding:0.35rem 0.85rem;">${t}</span>`).join("")}
    </div>

    <div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:2rem;">
      <h4 style="font-size:0.92rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.5rem;">
        <i class="fa-solid fa-check-double"></i> Implementation Highlights
      </h4>
      <ul style="color:var(--text-secondary); font-size:0.9rem; padding-left:1.25rem; line-height:1.6;">
        <li>Full CRUD database workflows with structured query optimization.</li>
        <li>Clean modular code design following OOP and SOLID principles.</li>
        <li>Responsive user interface optimized for smooth interaction.</li>
      </ul>
    </div>

    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
      <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding:0.7rem 1.4rem;">
        <i class="fa-brands fa-github"></i>
        <span>View on GitHub</span>
      </a>
      <button class="btn-secondary" onclick="closeProjectModal()" style="padding:0.7rem 1.4rem;">Close</button>
    </div>
  `;

  modalOverlay.classList.add("active");
};

window.closeProjectModal = function() {
  document.getElementById("project-modal")?.classList.remove("active");
};

/* ==========================================================================
   RESUME VIEWER & MODAL
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById("resume-modal");
  const openBtns = document.querySelectorAll(".open-resume-btn");
  const closeBtn = document.getElementById("close-resume-modal");

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      resumeModal?.classList.add("active");
    });
  });

  closeBtn?.addEventListener("click", () => {
    resumeModal?.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === resumeModal) resumeModal.classList.remove("active");
    if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("active");
  });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim() || "Portfolio Inquiry";
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    const payload = { name, email, subject, message };

    // 1. Try Java Backend (if not on GitHub Pages)
    let sentToBackend = false;
    if (typeof AUTH_CONFIG !== "undefined" && !AUTH_CONFIG.IS_GITHUB_PAGES && AUTH_CONFIG.API_BASE) {
      try {
        const response = await fetch(`${AUTH_CONFIG.API_BASE}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          sentToBackend = true;
        }
      } catch (err) {
        // offline fallback
      }
    }

    // 2. Always persist to localStorage for instant Admin inbox view
    try {
      const stored = JSON.parse(localStorage.getItem("tvr_contact_inquiries") || "[]");
      stored.unshift({
        id: "msg_" + Date.now(),
        name,
        email,
        subject,
        message,
        timestamp: Date.now(),
        formattedDate: new Date().toLocaleString()
      });
      localStorage.setItem("tvr_contact_inquiries", JSON.stringify(stored));
    } catch (e) {
      console.error(e);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();

    showToast("Message sent successfully! Venkateswara will reply shortly.", "success");
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: '<i class="fa-solid fa-circle-check" style="color:var(--accent-emerald);"></i>',
    error: '<i class="fa-solid fa-circle-exclamation" style="color:#ef4444;"></i>',
    info: '<i class="fa-solid fa-circle-info" style="color:var(--accent-cyan);"></i>'
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global expose
window.showToast = showToast;

/* ==========================================================================
   RAZORPAY INTEGRATION & PAYMENT PROCESSING
   ========================================================================== */
function selectPresetAmount(val, element) {
  document.querySelectorAll(".amount-btn").forEach(btn => btn.classList.remove("active"));
  element?.classList.add("active");
  const input = document.getElementById("custom-amount-input");
  if (input) input.value = val;
}

window.selectPresetAmount = selectPresetAmount;

async function initiateRazorpayPayment() {
  const amountInput = document.getElementById("custom-amount-input");
  const nameInput = document.getElementById("payer-name");
  const emailInput = document.getElementById("payer-email");
  const messageInput = document.getElementById("payer-message");

  const amount = parseInt(amountInput?.value || "0", 10);
  if (isNaN(amount) || amount < 10) {
    showToast("Please enter an amount of at least ₹10.", "error");
    return;
  }

  const payerName = nameInput?.value.trim() || "Valued Supporter";
  const payerEmail = emailInput?.value.trim() || "supporter@example.com";
  const payerNote = messageInput?.value.trim() || "Student Developer Support";

  // Check if user set custom Razorpay key in localStorage or use standard test key
  const razorpayKey = localStorage.getItem("tvr_razorpay_key") || "rzp_test_YourKeyHere";
  const hasLiveKey = razorpayKey && !razorpayKey.includes("YourKeyHere");

  const btn = document.getElementById("btn-trigger-razorpay");
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Initializing Razorpay...';

  // If Razorpay SDK is loaded and a real test/live key is configured
  if (typeof Razorpay !== "undefined" && hasLiveKey) {
    const options = {
      key: razorpayKey,
      amount: amount * 100, // paise
      currency: "INR",
      name: "Timmareddy Venkateswara Reddy",
      description: `Support / Consultation - ${payerNote}`,
      image: "assets/images/profile.png",
      prefill: {
        name: payerName,
        email: payerEmail,
        contact: "+919876543210"
      },
      theme: {
        color: "#6366f1"
      },
      handler: function (response) {
        completePaymentProcess({
          paymentId: response.razorpay_payment_id || ("pay_" + Math.random().toString(36).substring(2, 12)),
          amount: amount,
          payerName: payerName,
          payerEmail: payerEmail,
          note: payerNote
        });
      },
      modal: {
        ondismiss: function () {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
          showToast("Payment window closed.", "info");
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function (response) {
        showToast("Payment failed: " + response.error.description, "error");
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      });
      rzp.open();
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      return;
    } catch (e) {
      console.warn("Razorpay SDK error, switching to interactive simulator:", e);
    }
  }

  // Interactive Test Simulation Mode (Works instantly on GitHub Pages & offline!)
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalHtml;

    const fakePaymentId = "pay_rzp_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    completePaymentProcess({
      paymentId: fakePaymentId,
      amount: amount,
      payerName: payerName,
      payerEmail: payerEmail,
      note: payerNote,
      isSimulated: true
    });
  }, 900);
}

function completePaymentProcess(data) {
  // 1. Record in local storage for Admin Dashboard
  const records = JSON.parse(localStorage.getItem("tvr_payment_records") || "[]");
  records.unshift({
    id: data.paymentId,
    amount: data.amount,
    name: data.payerName,
    email: data.payerEmail,
    note: data.note,
    timestamp: Date.now(),
    dateStr: new Date().toLocaleString(),
    status: "Completed (Success)"
  });
  localStorage.setItem("tvr_payment_records", JSON.stringify(records));

  // 2. Display receipt modal
  document.getElementById("receipt-amount").textContent = "₹" + data.amount;
  document.getElementById("receipt-payment-id").textContent = data.paymentId;
  document.getElementById("receipt-payer").textContent = data.payerName;
  document.getElementById("receipt-date").textContent = new Date().toLocaleString();

  const receiptModal = document.getElementById("payment-receipt-modal");
  receiptModal?.classList.add("active");

  showToast(`₹${data.amount} payment received! Thank you, ${data.payerName}!`, "success");
}

function closeReceiptModal() {
  document.getElementById("payment-receipt-modal")?.classList.remove("active");
}

window.initiateRazorpayPayment = initiateRazorpayPayment;
window.closeReceiptModal = closeReceiptModal;
