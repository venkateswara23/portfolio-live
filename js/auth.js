/**
 * Authentication Module for Timmareddy Venkateswara Reddy's Portfolio
 * Features:
 * 1. Fixed Credentials Authentication (Demo & Admin)
 * 2. "Continue with Google" OAuth Flow + Realistic Account Chooser Simulation
 * 3. Client & Java Server Dual-Mode Support
 * 4. Session Persistence and Role-Based UI Updates
 */

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const customBackend = window.PORTFOLIO_BACKEND_URL || localStorage.getItem("tvr_backend_url");
const AUTH_CONFIG = {
  API_BASE: customBackend ? customBackend.replace(/\/+$/, "") : (isLocalhost ? (window.location.port === "8080" ? "" : "http://localhost:8080") : ""),
  IS_GITHUB_PAGES: window.location.hostname.includes("github.io"),
  STORAGE_KEY_USER: "tvr_portfolio_user",
  STORAGE_KEY_TOKEN: "tvr_portfolio_token",
  DEFAULT_MFA_OTP: "237132",
  BACKUP_MFA_CODE: "VITAP-2028-MFA",
  FIXED_USERS: [
    {
      username: "venkateswara",
      email: "venkateswara.23MIC7132@vitapstudent.ac.in",
      password: "vitap2028",
      displayName: "Timmareddy Venkateswara Reddy",
      role: "ADMIN",
      avatar: "assets/images/profile.png"
    },
    {
      username: "admin",
      email: "admin@vitap.ac.in",
      password: "admin123",
      displayName: "Portfolio Administrator",
      role: "ADMIN",
      avatar: "assets/images/profile.png"
    }
  ]
};

const AuthService = {
  /**
   * Get currently logged-in user from storage
   */
  getUser() {
    try {
      const data = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_USER) || sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOKEN) || sessionStorage.getItem(AUTH_CONFIG.STORAGE_KEY_TOKEN) || null;
  },

  isAuthenticated() {
    return !!this.getUser();
  },

  pendingMfa: null,

  maskEmail(email) {
    if (!email || !email.includes("@")) return "u***@student.vitap.ac.in";
    const [name, domain] = email.split("@");
    const visible = name.length > 3 ? name.slice(0, 3) : name.slice(0, 1);
    return `${visible}***@${domain}`;
  },

  async requestMfaChallenge(user, remember = true) {
    const generatedCode = AUTH_CONFIG.DEFAULT_MFA_OTP || "237132";
    this.pendingMfa = {
      user,
      remember,
      code: generatedCode,
      createdAt: Date.now(),
      attempts: 0
    };
    return {
      success: true,
      mfaRequired: true,
      user,
      maskedEmail: this.maskEmail(user.email),
      demoCode: generatedCode,
      message: `MFA 2-Step verification code sent to ${this.maskEmail(user.email)}`
    };
  },

  async verifyMfaOtp(inputCode) {
    if (!this.pendingMfa) {
      throw new Error("No pending multi-factor verification session found. Please sign in again.");
    }
    const clean = String(inputCode).trim();
    if (!clean) {
      throw new Error("Please enter the 6-digit verification code.");
    }
    const { user, remember, code } = this.pendingMfa;
    const isValid = (clean === code) || (clean === AUTH_CONFIG.DEFAULT_MFA_OTP) || (clean === AUTH_CONFIG.BACKUP_MFA_CODE);

    if (!isValid) {
      this.pendingMfa.attempts = (this.pendingMfa.attempts || 0) + 1;
      if (this.pendingMfa.attempts >= 5) {
        this.pendingMfa = null;
        throw new Error("Too many failed MFA attempts. Security lock engaged. Please login again.");
      }
      throw new Error("Invalid verification code! Try demo code: 237132");
    }

    user.mfaVerified = true;
    user.mfaVerifiedAt = Date.now();
    const token = "tok_mfa_" + Math.random().toString(36).substring(2);
    this.saveSession(user, token, remember);
    this.pendingMfa = null;
    return {
      success: true,
      user,
      token,
      message: "Two-Factor Authentication verified successfully! Access granted."
    };
  },

  /**
   * Save session to storage
   */
  saveSession(user, token, remember = true) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_CONFIG.STORAGE_KEY_USER, JSON.stringify(user));
    storage.setItem(AUTH_CONFIG.STORAGE_KEY_TOKEN, token || "tok_" + Date.now());
  },

  /**
   * Authenticate via Fixed Credentials
   */
  async loginWithCredentials(usernameOrEmail, password, remember = true) {
    if (!usernameOrEmail || !password) {
      throw new Error("Please enter both username/email and password.");
    }

    const input = usernameOrEmail.trim().toLowerCase();
    const pass = password.trim();

    // 1. Attempt to call Java/Python Backend API (if not on GitHub Pages)
    if (!AUTH_CONFIG.IS_GITHUB_PAGES && AUTH_CONFIG.API_BASE) {
      try {
        const response = await fetch(`${AUTH_CONFIG.API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: input, password: pass })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            return this.requestMfaChallenge(data.user, remember);
          }
        }
      } catch (apiError) {
        console.log("Backend offline or unreachable. Falling back to client-side auth engine.", apiError);
      }
    }

    // 2. Client-side fallback authentication
    const matched = AUTH_CONFIG.FIXED_USERS.find(
      u => (u.username.toLowerCase() === input || u.email.toLowerCase() === input) && u.password === pass
    );

    if (matched) {
      const user = {
        id: "usr_" + matched.username,
        username: matched.username,
        email: matched.email,
        displayName: matched.displayName,
        role: matched.role,
        authProvider: "CREDENTIALS",
        avatarUrl: matched.avatar,
        loginTimestamp: Date.now()
      };
      return this.requestMfaChallenge(user, remember);
    }

    throw new Error("Invalid credentials! Please use the demo credentials provided.");
  },

  /**
   * Authenticate via Google
   */
  async loginWithGoogle(accountData, remember = true) {
    const payload = {
      email: accountData.email || "venkateswara.google@vitapstudent.ac.in",
      name: accountData.name || "Timmareddy Venkateswara Reddy",
      picture: accountData.picture || "assets/images/profile.png",
      sub: accountData.sub || "g_" + Date.now()
    };

    // 1. Try Java Backend (if not on GitHub Pages)
    if (!AUTH_CONFIG.IS_GITHUB_PAGES && AUTH_CONFIG.API_BASE) {
      try {
        const response = await fetch(`${AUTH_CONFIG.API_BASE}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            return this.requestMfaChallenge(data.user, remember);
          }
        }
      } catch (apiError) {
        console.log("Java backend offline. Using client-side Google auth.", apiError);
      }
    }

    // 2. Client-side fallback
    const isOwner = payload.email.toLowerCase().includes("venkateswara") || payload.email.toLowerCase().includes("vitapstudent.ac.in");
    const user = {
      id: "google_" + payload.sub,
      username: payload.email.split("@")[0],
      email: payload.email,
      displayName: payload.name,
      role: isOwner ? "ADMIN" : "GOOGLE_USER",
      authProvider: "GOOGLE",
      avatarUrl: payload.picture,
      loginTimestamp: Date.now()
    };

    return this.requestMfaChallenge(user, remember);
  },

  /**
   * Terminate user session
   */
  async logout() {
    const token = this.getToken();
    try {
      if (token) {
        await fetch(`${AUTH_CONFIG.API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (e) {
      // offline logout
    }

    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_USER);
    sessionStorage.removeItem(AUTH_CONFIG.STORAGE_KEY_TOKEN);

    if (window.location.pathname.includes("admin.html")) {
      window.location.href = "login.html";
    } else {
      window.location.reload();
    }
  },

  /**
   * Interactive Google Account Chooser Modal
   * Displays realistic Google accounts for 1-click test login
   */
  showGoogleAccountChooser(onSuccess) {
    const existingModal = document.getElementById("google-auth-modal");
    if (existingModal) existingModal.remove();

    const modalHtml = `
      <div id="google-auth-modal" class="modal-overlay active" style="display:flex;">
        <div class="google-chooser-modal">
          <div class="google-header-brand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="40px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <h3>Choose a Google Account</h3>
            <p>to continue to Timmareddy Venkateswara Reddy Portfolio</p>
          </div>

          <div class="google-accounts-list">
            <!-- Account 1: Venkateswara (Owner) -->
            <button class="google-account-item" id="g-opt-owner">
              <img src="assets/images/profile.png" class="google-account-avatar" alt="Avatar">
              <div class="google-account-info">
                <div class="google-account-name">Timmareddy Venkateswara Reddy</div>
                <div class="google-account-email">venkateswara.23MIC7132@vitapstudent.ac.in</div>
              </div>
            </button>

            <!-- Account 2: Recruiter / Evaluator -->
            <button class="google-account-item" id="g-opt-recruiter">
              <div class="google-account-avatar" style="background:#0f9d58;">R</div>
              <div class="google-account-info">
                <div class="google-account-name">Technical Recruiter / Reviewer</div>
                <div class="google-account-email">recruiter.demo@google.com</div>
              </div>
            </button>

            <!-- Account 3: Custom Google Account -->
            <button class="google-account-item" id="g-opt-custom">
              <div class="google-account-avatar" style="background:#5f6368;"><i class="fa-solid fa-user-plus"></i></div>
              <div class="google-account-info">
                <div class="google-account-name">Use another Google account</div>
                <div class="google-account-email">Enter custom email address</div>
              </div>
            </button>
          </div>

          <div style="text-align:center;">
            <button id="g-cancel-btn" style="color:#5f6368; font-weight:600; font-size:0.88rem; padding:0.5rem 1rem;">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = document.getElementById("google-auth-modal");
    const closeModal = () => modal.remove();

    document.getElementById("g-cancel-btn").onclick = closeModal;

    // Option 1
    document.getElementById("g-opt-owner").onclick = async () => {
      closeModal();
      await this.loginWithGoogle({
        name: "Timmareddy Venkateswara Reddy",
        email: "venkateswara.23MIC7132@vitapstudent.ac.in",
        picture: "assets/images/profile.png"
      });
      if (onSuccess) onSuccess();
    };

    // Option 2
    document.getElementById("g-opt-recruiter").onclick = async () => {
      closeModal();
      await this.loginWithGoogle({
        name: "Technical Recruiter",
        email: "recruiter.demo@google.com",
        picture: ""
      });
      if (onSuccess) onSuccess();
    };

    // Option 3
    document.getElementById("g-opt-custom").onclick = async () => {
      closeModal();
      const customEmail = prompt("Enter your Google Account email:", "developer@gmail.com");
      if (customEmail) {
        await this.loginWithGoogle({
          name: customEmail.split("@")[0],
          email: customEmail,
          picture: ""
        });
        if (onSuccess) onSuccess();
      }
    };
  },

  /**
   * Update UI navbar elements based on login status
   */
  updateNavbarState() {
    const authContainer = document.getElementById("nav-auth-container");
    if (!authContainer) return;

    const user = this.getUser();
    if (user) {
      authContainer.innerHTML = `
        <div class="user-status-pill">
          <img src="${user.avatarUrl || 'assets/images/profile.png'}" alt="${user.displayName}" class="user-avatar-tiny" onerror="this.src='assets/images/profile.png'">
          <span style="font-weight:600; max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${user.displayName.split(" ")[0]}</span>
          <a href="admin.html" title="Open Admin Dashboard" style="color:var(--accent-cyan); margin-left:0.3rem;"><i class="fa-solid fa-gear"></i></a>
          <button id="nav-logout-btn" title="Sign Out" style="color:#ef4444; margin-left:0.3rem;"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>
      `;

      const logoutBtn = document.getElementById("nav-logout-btn");
      if (logoutBtn) {
        logoutBtn.onclick = () => this.logout();
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html" class="nav-auth-btn">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
          <span>Login</span>
        </a>
      `;
    }
  }
};
