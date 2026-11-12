/**
 * Admin Dashboard Logic for Timmareddy Venkateswara Reddy's Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check Authentication
  const user = AuthService.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  renderAdminUser(user);
  loadMessages();
  loadPayments();
  loadStats();
  initAdminActions();
  initGrafanaMonitoring();
  initElkConsole();
});

function renderAdminUser(user) {
  const nameEl = document.getElementById("admin-user-name");
  const roleEl = document.getElementById("admin-user-role");
  const imgEl = document.getElementById("admin-user-img");
  const bannerWelcome = document.getElementById("admin-banner-welcome");
  const authProviderBadge = document.getElementById("auth-provider-badge");

  if (nameEl) nameEl.textContent = user.displayName;
  if (roleEl) roleEl.textContent = user.role === "ADMIN" ? "Portfolio Administrator" : "Google Authenticated Visitor";
  if (imgEl) imgEl.src = user.avatarUrl || "assets/images/profile.png";
  if (bannerWelcome) bannerWelcome.textContent = `Welcome back, ${user.displayName}!`;

  if (authProviderBadge) {
    if (user.authProvider === "GOOGLE") {
      authProviderBadge.innerHTML = '<i class="fa-brands fa-google"></i> Signed in via Google OAuth';
      authProviderBadge.style.color = "#38bdf8";
    } else {
      authProviderBadge.innerHTML = '<i class="fa-solid fa-key"></i> Signed in via Fixed Credentials';
      authProviderBadge.style.color = "var(--accent-emerald)";
    }
  }

  // Logout button
  const logoutBtn = document.getElementById("btn-admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => AuthService.logout());
  }
}

async function loadMessages() {
  const tableBody = document.getElementById("messages-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Loading inquiries...</td></tr>`;

  let messages = [];

  // Try Java Backend
  try {
    const token = AuthService.getToken();
    const res = await fetch(`${AUTH_CONFIG.API_BASE}/api/messages`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        messages = data.messages;
      }
    }
  } catch (err) {
    // offline
  }

  // Also merge or fallback to local inquiries
  const localMsgs = JSON.parse(localStorage.getItem("tvr_contact_inquiries") || "[]");
  if (messages.length === 0) {
    messages = localMsgs;
  }

  if (messages.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <i class="fa-regular fa-envelope-open" style="font-size:2rem; margin-bottom:0.75rem; display:block;"></i>
          No messages received yet. Submit the contact form on the home page to test this inbox!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = messages.map(msg => `
    <tr id="row-${msg.id}">
      <td>
        <strong>${escapeHtml(msg.name)}</strong>
        <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(msg.email)}</div>
      </td>
      <td><strong>${escapeHtml(msg.subject)}</strong></td>
      <td style="max-width:320px; color:var(--text-secondary);">${escapeHtml(msg.message)}</td>
      <td style="font-size:0.82rem; color:var(--text-muted);">${msg.formattedDate || new Date(msg.timestamp).toLocaleString()}</td>
      <td>
        <a href="mailto:${escapeHtml(msg.email)}?subject=Re: ${encodeURIComponent(msg.subject)}" class="btn-table-action btn-table-reply">
          <i class="fa-solid fa-reply"></i> Reply
        </a>
        <button class="btn-table-action btn-table-delete" onclick="deleteMessage('${msg.id}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join("");

  document.getElementById("stat-messages-count").textContent = messages.length;
}

window.deleteMessage = async function(id) {
  if (!confirm("Are you sure you want to delete this message?")) return;

  // Try Java Backend
  try {
    const token = AuthService.getToken();
    await fetch(`${AUTH_CONFIG.API_BASE}/api/messages?id=${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
  } catch (e) {}

  // Update localStorage
  let localMsgs = JSON.parse(localStorage.getItem("tvr_contact_inquiries") || "[]");
  localMsgs = localMsgs.filter(m => m.id !== id);
  localStorage.setItem("tvr_contact_inquiries", JSON.stringify(localMsgs));

  document.getElementById(`row-${id}`)?.remove();
  showToast("Message deleted successfully.", "info");

  loadMessages();
};

function loadPayments() {
  const tableBody = document.getElementById("payments-table-body");
  const totalEl = document.getElementById("stat-payments-total");
  if (!tableBody) return;

  let records = JSON.parse(localStorage.getItem("tvr_payment_records") || "[]");

  // Sample initial contribution if empty
  if (records.length === 0) {
    records = [
      {
        id: "pay_sample_9841",
        amount: 199,
        name: "Campus Developer Peer",
        email: "peer@vitapstudent.ac.in",
        note: "Support for Java & Android Project",
        dateStr: new Date().toLocaleDateString(),
        status: "Completed (Success)"
      }
    ];
    localStorage.setItem("tvr_payment_records", JSON.stringify(records));
  }

  let totalAmount = 0;
  tableBody.innerHTML = records.map(p => {
    totalAmount += Number(p.amount) || 0;
    return `
      <tr>
        <td><span class="cred-code">${escapeHtml(p.id)}</span></td>
        <td>
          <strong>${escapeHtml(p.name)}</strong>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(p.email)}</div>
        </td>
        <td><strong style="color:var(--accent-emerald);">₹${p.amount}</strong></td>
        <td style="color:var(--text-secondary);">${escapeHtml(p.note || "Contribution")}</td>
        <td style="font-size:0.82rem; color:var(--text-muted);">${p.dateStr || "Recent"}</td>
        <td>
          <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.8rem; font-weight:700; color:var(--accent-emerald); background:rgba(16,185,129,0.12); padding:0.25rem 0.65rem; border-radius:var(--radius-full);">
            <i class="fa-solid fa-circle-check"></i> Success
          </span>
        </td>
      </tr>
    `;
  }).join("");

  if (totalEl) {
    totalEl.textContent = "₹" + totalAmount;
  }
}

function loadStats() {
  const statProjects = document.getElementById("stat-projects-count");
  if (statProjects && typeof PORTFOLIO_DATA !== "undefined") {
    statProjects.textContent = PORTFOLIO_DATA.projects.length;
  }
}

function initAdminActions() {
  const updateStatusBtn = document.getElementById("btn-update-status");
  const statusInput = document.getElementById("input-custom-status");

  if (updateStatusBtn && statusInput) {
    statusInput.value = localStorage.getItem("tvr_custom_status") || "Integrated M.Tech CSE Student @ VIT-AP | Java & Python Developer";

    updateStatusBtn.addEventListener("click", () => {
      const val = statusInput.value.trim();
      if (val) {
        localStorage.setItem("tvr_custom_status", val);
        showToast("Profile headline updated! View on home page.", "success");
      }
    });
  }

  // Razorpay Key Configuration
  const rzpKeyInput = document.getElementById("input-razorpay-key");
  const saveRzpKeyBtn = document.getElementById("btn-save-razorpay-key");

  if (rzpKeyInput && saveRzpKeyBtn) {
    rzpKeyInput.value = localStorage.getItem("tvr_razorpay_key") || "";

    saveRzpKeyBtn.addEventListener("click", () => {
      const keyVal = rzpKeyInput.value.trim();
      if (keyVal) {
        localStorage.setItem("tvr_razorpay_key", keyVal);
        showToast("Razorpay Key ID saved! Live payments active.", "success");
      } else {
        localStorage.removeItem("tvr_razorpay_key");
        showToast("Razorpay Key cleared. Test simulation mode active.", "info");
      }
    });
  }
}

/* ==========================================================================
   ELK STACK LIVE OBSERVABILITY CONSOLE
   ========================================================================== */
let elkLogsData = [];
let currentElkFilter = "ALL";
let currentElkSearch = "";
let elkAutoRefreshTimer = null;

function initElkConsole() {
  const tableBody = document.getElementById("elk-logs-table-body");
  if (!tableBody) return;

  // Filter Buttons
  document.querySelectorAll(".elk-level-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".elk-level-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentElkFilter = btn.getAttribute("data-level") || "ALL";
      renderElkLogsTable();
    });
  });

  // Search Input
  const searchInput = document.getElementById("input-elk-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentElkSearch = e.target.value.toLowerCase().trim();
      renderElkLogsTable();
    });
  }

  // Refresh Button
  document.getElementById("btn-refresh-elk-logs")?.addEventListener("click", () => {
    loadElkLogs();
    showToast("ELK log stream refreshed.", "info");
  });

  // Emit Buttons
  document.getElementById("btn-emit-info-log")?.addEventListener("click", () => {
    emitElkLog("INFO", "GET /api/projects - 200 OK query executed", "/api/projects", 200);
  });

  document.getElementById("btn-emit-warn-log")?.addEventListener("click", () => {
    emitElkLog("WARN", "Resource not found on endpoint /assets/images/legacy.png", "/assets/images/legacy.png", 404);
  });

  document.getElementById("btn-emit-error-log")?.addEventListener("click", () => {
    emitElkLog("ERROR", "NullPointerException: Database connection timeout in TransactionManager", "/api/transactions", 500);
  });

  // Initial Load
  loadElkLogs();

  // Auto Refresh every 4 seconds
  if (elkAutoRefreshTimer) clearInterval(elkAutoRefreshTimer);
  elkAutoRefreshTimer = setInterval(loadElkLogs, 4000);
}

async function loadElkLogs() {
  let fetchedLogs = null;

  // 1. Try Java or Python backend endpoint
  try {
    const res = await fetch(`${AUTH_CONFIG.API_BASE}/api/elk/logs`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        fetchedLogs = data.logs;
      }
    }
  } catch (err) {
    // Backend offline / static mode
  }

  // 2. If fetched from server, save & use
  if (fetchedLogs && fetchedLogs.length > 0) {
    elkLogsData = fetchedLogs;
    localStorage.setItem("tvr_elk_logs_cache", JSON.stringify(elkLogsData));
  } else {
    // 3. Fallback to localStorage or seeded initial logs
    const cached = JSON.parse(localStorage.getItem("tvr_elk_logs_cache") || "[]");
    if (cached.length > 0) {
      elkLogsData = cached;
    } else {
      // Seed realistic initial logs for instant inspection
      const now = new Date();
      elkLogsData = [
        {
          "@timestamp": new Date(now - 120000).toISOString(),
          level: "INFO",
          service: "portfolio-backend",
          method: "SYSTEM",
          status: 200,
          duration_ms: 1.2,
          client_ip: "127.0.0.1",
          message: "Elasticsearch index pattern 'portfolio-logs-*' active on port 9200"
        },
        {
          "@timestamp": new Date(now - 85000).toISOString(),
          level: "INFO",
          service: "portfolio-backend",
          method: "SYSTEM",
          status: 200,
          duration_ms: 0.8,
          client_ip: "127.0.0.1",
          message: "Logstash pipeline running. Grok filter enabled on ports 5044/5000"
        },
        {
          "@timestamp": new Date(now - 55000).toISOString(),
          level: "INFO",
          service: "portfolio-backend",
          method: "GET",
          status: 200,
          duration_ms: 14.5,
          client_ip: "192.168.1.105",
          message: "Served /index.html and CSS bundles to client"
        },
        {
          "@timestamp": new Date(now - 35000).toISOString(),
          level: "INFO",
          service: "portfolio-backend",
          method: "GET",
          status: 200,
          duration_ms: 8.2,
          client_ip: "192.168.1.105",
          message: "Fetched projects portfolio data (/api/projects)"
        },
        {
          "@timestamp": new Date(now - 15000).toISOString(),
          level: "WARN",
          service: "portfolio-backend",
          method: "GET",
          status: 404,
          duration_ms: 4.1,
          client_ip: "127.0.0.1",
          message: "Client queried missing route /api/v1/unknown"
        }
      ];
      localStorage.setItem("tvr_elk_logs_cache", JSON.stringify(elkLogsData));
    }
  }

  updateElkMetrics();
  renderElkLogsTable();
}

function updateElkMetrics() {
  const totalEl = document.getElementById("elk-stat-total");
  const count2xxEl = document.getElementById("elk-stat-2xx");
  const count4xxEl = document.getElementById("elk-stat-4xx");
  const count5xxEl = document.getElementById("elk-stat-5xx");
  const latencyEl = document.getElementById("elk-stat-latency");
  const statBoxElk = document.getElementById("stat-elk-count");

  let c2 = 0, c4 = 0, c5 = 0, totalDur = 0;

  elkLogsData.forEach(l => {
    const s = Number(l.status) || 200;
    if (s >= 200 && s < 300) c2++;
    else if (s >= 400 && s < 500) c4++;
    else if (s >= 500) c5++;
    totalDur += Number(l.duration_ms) || 0;
  });

  const total = elkLogsData.length;
  const avgLat = total > 0 ? (totalDur / total).toFixed(1) : "0";

  if (totalEl) totalEl.textContent = total;
  if (count2xxEl) count2xxEl.textContent = c2;
  if (count4xxEl) count4xxEl.textContent = c4;
  if (count5xxEl) count5xxEl.textContent = c5;
  if (latencyEl) latencyEl.textContent = `${avgLat} ms`;
  if (statBoxElk) statBoxElk.textContent = total;
}

function renderElkLogsTable() {
  const tbody = document.getElementById("elk-logs-table-body");
  if (!tbody) return;

  // Filter by level and search text
  const filtered = elkLogsData.filter(log => {
    const matchLevel = currentElkFilter === "ALL" || log.level.toUpperCase() === currentElkFilter;
    if (!matchLevel) return false;

    if (!currentElkSearch) return true;
    const combined = `${log["@timestamp"]} ${log.level} ${log.method} ${log.status} ${log.client_ip} ${log.message}`.toLowerCase();
    return combined.includes(currentElkSearch);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
          No log events found matching the active filter ("${currentElkFilter}").
        </td>
      </tr>
    `;
    return;
  }

  // Display logs latest first
  tbody.innerHTML = filtered.slice().reverse().map(l => {
    let badgeColor = "var(--accent-emerald)";
    let badgeBg = "rgba(16, 185, 129, 0.12)";
    if (l.level === "WARN") {
      badgeColor = "var(--accent-amber)";
      badgeBg = "rgba(245, 158, 11, 0.12)";
    } else if (l.level === "ERROR") {
      badgeColor = "var(--accent-rose)";
      badgeBg = "rgba(244, 63, 94, 0.15)";
    }

    let statusColor = l.status >= 500 ? "var(--accent-rose)" : (l.status >= 400 ? "var(--accent-amber)" : "var(--accent-emerald)");

    return `
      <tr>
        <td style="color:var(--text-muted); font-size:0.78rem;">${l["@timestamp"]}</td>
        <td>
          <span style="font-weight:700; color:${badgeColor}; background:${badgeBg}; padding:0.18rem 0.5rem; border-radius:4px; font-size:0.75rem;">
            ${l.level}
          </span>
        </td>
        <td>
          <span style="color:var(--text-primary); font-weight:600;">${l.method || "GET"}</span>
          <span style="color:${statusColor}; font-weight:700; margin-left:0.25rem;">${l.status || 200}</span>
        </td>
        <td style="color:var(--text-secondary);">${l.client_ip || "127.0.0.1"}</td>
        <td style="color:var(--accent-cyan); font-weight:600;">${Math.round(l.duration_ms || 2)}ms</td>
        <td style="color:var(--text-primary); word-break:break-word;">${escapeHtml(l.message)}</td>
      </tr>
    `;
  }).join("");
}

async function emitElkLog(level, message, path, status) {
  // Try sending to server
  try {
    const res = await fetch(`${AUTH_CONFIG.API_BASE}/api/elk/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message, path, status })
    });
    if (res.ok) {
      showToast(`Emitted [${level}] event to ELK stream!`, "success");
      loadElkLogs();
      return;
    }
  } catch (err) {
    // fallback to local
  }

  // Local fallback
  const newEntry = {
    "@timestamp": new Date().toISOString(),
    level: level.toUpperCase(),
    service: "portfolio-backend",
    method: "POST",
    status: status,
    duration_ms: Math.floor(Math.random() * 40 + 5),
    client_ip: "127.0.0.1",
    message: `[${path}] ${message}`
  };

  elkLogsData.push(newEntry);
  localStorage.setItem("tvr_elk_logs_cache", JSON.stringify(elkLogsData));
  updateElkMetrics();
  renderElkLogsTable();
  showToast(`Emitted [${level}] log event to local ELK pipeline!`, "success");
}

/* ==========================================================================
   GRAFANA WEBSITE UPTIME & DOWNTIME MONITORING
   ========================================================================== */
let uptimeState = {
  status: "UP",
  uptime_percentage: 99.98,
  downtime_minutes_24h: 0,
  avg_latency_ms: 18.2,
  total_probes: 2410,
  incidents: [
    {
      id: "inc-1092",
      title: "Scheduled Edge SSL Certificate Renewal",
      status: "Resolved",
      duration_minutes: 2,
      timestamp: "2026-10-20T10:00:00Z",
      impact: "Minimal (99.98% SLA maintained)"
    }
  ]
};

let uptimeRefreshTimer = null;

function initGrafanaMonitoring() {
  const card = document.getElementById("grafana-monitoring-card");
  if (!card) return;

  // Toggle Downtime Button
  const toggleBtn = document.getElementById("btn-toggle-downtime");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => toggleDowntimeSimulation());
  }

  // Refresh Button
  document.getElementById("btn-refresh-uptime")?.addEventListener("click", () => {
    loadUptimeData();
    showToast("Grafana metrics refreshed.", "info");
  });

  // Render initial 30-day timeline bars
  renderUptimeTimelineBars();

  // Load live data
  loadUptimeData();

  // Refresh interval every 5 seconds
  if (uptimeRefreshTimer) clearInterval(uptimeRefreshTimer);
  uptimeRefreshTimer = setInterval(loadUptimeData, 5000);
}

async function loadUptimeData() {
  try {
    const res = await fetch(`${AUTH_CONFIG.API_BASE}/api/uptime`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        uptimeState = data;
        localStorage.setItem("tvr_uptime_state_cache", JSON.stringify(uptimeState));
      }
    }
  } catch (err) {
    // Offline / static fallback
    const cached = JSON.parse(localStorage.getItem("tvr_uptime_state_cache") || "null");
    if (cached) uptimeState = cached;
  }

  updateGrafanaUI();
}

function updateGrafanaUI() {
  const isUp = uptimeState.status === "UP";

  // Top banner indicator
  const banner = document.getElementById("grafana-status-banner");
  const indicator = document.getElementById("grafana-status-indicator");
  const title = document.getElementById("grafana-status-title");
  const sub = document.getElementById("grafana-status-sub");
  const latency = document.getElementById("grafana-probe-latency");
  const toggleText = document.getElementById("btn-toggle-downtime-text");

  // Metrics
  const metricStatus = document.getElementById("grafana-metric-status");
  const metricSla = document.getElementById("grafana-metric-sla");
  const metricDowntime = document.getElementById("grafana-metric-downtime");
  const metricProbes = document.getElementById("grafana-metric-probes");
  const topStatSla = document.getElementById("stat-uptime-sla");
  const legendEl = document.getElementById("grafana-uptime-legend");

  if (isUp) {
    if (banner) {
      banner.style.background = "rgba(16,185,129,0.12)";
      banner.style.borderColor = "rgba(16,185,129,0.3)";
    }
    if (indicator) {
      indicator.style.background = "var(--accent-emerald)";
      indicator.style.boxShadow = "0 0 10px var(--accent-emerald)";
    }
    if (title) {
      title.textContent = "ALL SYSTEMS OPERATIONAL";
      title.style.color = "var(--accent-emerald)";
    }
    if (sub) sub.textContent = "Synthetic probes active • HTTP 200 OK from all edge nodes";
    if (metricStatus) {
      metricStatus.textContent = "UP";
      metricStatus.style.color = "var(--accent-emerald)";
    }
    if (metricSla) {
      metricSla.textContent = `${uptimeState.uptime_percentage}%`;
      metricSla.style.color = "var(--accent-emerald)";
    }
    if (metricDowntime) metricDowntime.textContent = "0m 0s";
    if (toggleText) toggleText.textContent = "Simulate Downtime";
    if (legendEl) {
      legendEl.textContent = "100% Up Today";
      legendEl.style.color = "var(--accent-emerald)";
    }
  } else {
    if (banner) {
      banner.style.background = "rgba(244,63,94,0.15)";
      banner.style.borderColor = "rgba(244,63,94,0.35)";
    }
    if (indicator) {
      indicator.style.background = "var(--accent-rose)";
      indicator.style.boxShadow = "0 0 12px var(--accent-rose)";
    }
    if (title) {
      title.textContent = "CRITICAL OUTAGE DETECTED";
      title.style.color = "var(--accent-rose)";
    }
    if (sub) sub.textContent = "Synthetic probe alert: 503 Service Unavailable • Grafana alert firing";
    if (metricStatus) {
      metricStatus.textContent = "DOWN";
      metricStatus.style.color = "var(--accent-rose)";
    }
    if (metricSla) {
      metricSla.textContent = `${uptimeState.uptime_percentage}%`;
      metricSla.style.color = "var(--accent-rose)";
    }
    if (metricDowntime) metricDowntime.textContent = "14m 20s";
    if (toggleText) toggleText.textContent = "Restore Website Online (UP)";
    if (legendEl) {
      legendEl.textContent = "Outage Reported Today";
      legendEl.style.color = "var(--accent-rose)";
    }
  }

  if (latency) latency.textContent = `${uptimeState.avg_latency_ms} ms`;
  if (metricProbes) metricProbes.textContent = Number(uptimeState.total_probes || 2410).toLocaleString();
  if (topStatSla) topStatSla.textContent = `${uptimeState.uptime_percentage}%`;

  renderUptimeTimelineBars();
  renderIncidentsTable();
}

function renderUptimeTimelineBars() {
  const container = document.getElementById("grafana-uptime-timeline-bars");
  if (!container) return;

  const isUp = uptimeState.status === "UP";
  // 30 days of data bars (each representing 1 day)
  const barsCount = 30;
  let html = "";

  for (let i = 0; i < barsCount; i++) {
    // Last bar is today
    if (i === barsCount - 1) {
      const color = isUp ? "var(--accent-emerald)" : "var(--accent-rose)";
      const title = isUp ? "Today: 100% Operational (0 outages)" : "Today: OUTAGE DETECTED (503 Service Unavailable)";
      html += `<div style="flex:1; background:${color}; border-radius:2px;" title="${title}"></div>`;
    } else if (i === 17) {
      // Small historical maintenance 12 days ago
      html += `<div style="flex:1; background:var(--accent-amber); border-radius:2px;" title="12 days ago: 99.8% Uptime (2m scheduled renewal)"></div>`;
    } else {
      html += `<div style="flex:1; background:var(--accent-emerald); border-radius:2px;" title="${barsCount - 1 - i} days ago: 100% Uptime"></div>`;
    }
  }

  container.innerHTML = html;
}

function renderIncidentsTable() {
  const tbody = document.getElementById("grafana-incidents-table-body");
  if (!tbody) return;

  const incidents = uptimeState.incidents || [];
  if (incidents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:1.25rem; color:var(--text-muted);">No incidents recorded in the last 90 days.</td></tr>`;
    return;
  }

  tbody.innerHTML = incidents.map(inc => {
    const isOngoing = inc.status.includes("Active");
    const badgeColor = isOngoing ? "var(--accent-rose)" : "var(--accent-emerald)";
    const badgeBg = isOngoing ? "rgba(244,63,94,0.15)" : "rgba(16,185,129,0.12)";

    return `
      <tr>
        <td><strong>${escapeHtml(inc.title)}</strong></td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${new Date(inc.timestamp).toLocaleString()}</td>
        <td style="color:var(--accent-cyan); font-weight:600;">${inc.duration_minutes} min</td>
        <td>
          <span style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.78rem; font-weight:700; color:${badgeColor}; background:${badgeBg}; padding:0.2rem 0.6rem; border-radius:var(--radius-full);">
            <i class="fa-solid fa-${isOngoing ? 'triangle-exclamation' : 'check'}"></i> ${escapeHtml(inc.status)}
          </span>
          <span style="font-size:0.78rem; color:var(--text-muted); margin-left:0.5rem;">${escapeHtml(inc.impact || "")}</span>
        </td>
      </tr>
    `;
  }).join("");
}

async function toggleDowntimeSimulation() {
  const currentIsUp = uptimeState.status === "UP";
  const nextAction = currentIsUp ? "down" : "up";

  try {
    const res = await fetch(`${AUTH_CONFIG.API_BASE}/api/uptime/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: nextAction })
    });
    if (res.ok) {
      const data = await res.json();
      showToast(nextAction === "down" ? "Simulated Website Outage! Status: DOWN" : "Website Restored Online! Status: UP", nextAction === "down" ? "warning" : "success");
      loadUptimeData();
      return;
    }
  } catch (err) {
    // offline local simulation
  }

  // Local fallback
  if (nextAction === "down") {
    uptimeState.status = "DOWN";
    uptimeState.uptime_percentage = 97.40;
    uptimeState.downtime_minutes_24h = 14;
    uptimeState.avg_latency_ms = 145.0;
    uptimeState.incidents.unshift({
      id: `inc-${Date.now()}`,
      title: "Simulated Gateway Connection Failure",
      status: "Active (Investigating)",
      duration_minutes: 1,
      timestamp: new Date().toISOString(),
      impact: "Service degradation (HTTP 503)"
    });
    showToast("Simulated Website Outage! Status: DOWN", "warning");
  } else {
    uptimeState.status = "UP";
    uptimeState.uptime_percentage = 99.98;
    uptimeState.downtime_minutes_24h = 0;
    uptimeState.avg_latency_ms = 18.2;
    if (uptimeState.incidents.length > 0 && uptimeState.incidents[0].status.includes("Active")) {
      uptimeState.incidents[0].status = "Resolved (Recovered)";
    }
    showToast("Website Restored Online! Status: UP (Operational)", "success");
  }

  localStorage.setItem("tvr_uptime_state_cache", JSON.stringify(uptimeState));
  updateGrafanaUI();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container") || document.body;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.cssText = "position:fixed; bottom:24px; right:24px; background:#1e293b; color:#fff; padding:12px 20px; border-radius:8px; border:1px solid #334155; box-shadow:0 10px 25px rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; gap:10px; font-size:0.9rem; font-family:sans-serif;";
  toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:#38bdf8;"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

window.escapeHtml = escapeHtml;
window.showToast = showToast;
window.emitElkLog = emitElkLog;
window.loadElkLogs = loadElkLogs;
window.toggleDowntimeSimulation = toggleDowntimeSimulation;
window.loadUptimeData = loadUptimeData;
