# Timmareddy Venkateswara Reddy - Developer Portfolio

A responsive developer portfolio with Java backend APIs, modern CSS design, and dual-mode authentication (**Fixed Credentials** and **"Continue with Google"**).

Tailored from the resume of **Timmareddy Venkateswara Reddy**, Integrated M.Tech Computer Science and Engineering (CSE) student developer at **Vellore Institute of Technology – Andhra Pradesh (VIT-AP)**.

---

## 🌟 Features & Highlights

- **Tailored to Resume**:
  - **Academic Background**: Vellore Institute of Technology – AP (2023 – 2028 Expected), Integrated M.Tech CSE.
  - **Core Skills**: Java, Python, SQL, JavaScript, HTML, CSS, MySQL, Elasticsearch, ELK Stack, Android Studio, VS Code, GitHub.
  - **Languages**: Telugu (Native) & English (Professional Working Proficiency).
  - **Featured Projects**: ELK Stack Centralized Logging Pipeline, Android Smart Expense Tracker, Student Academic & Grade Management System (Java + MySQL), Algorithmic Task Optimizer (Python DSA), and Campus Event Hub.
  - **Contact**: `venkateswara.23MIC7132@vitapstudent.ac.in`, Duvvur, Kadapa, AP.
- **ELK Stack Logging & Observability**:
  - **Elasticsearch**: High-speed distributed log search and indexed analytics on port 9200.
  - **Logstash**: Configured pipeline (`elk/logstash.conf`) parsing raw JSON and multiline stack traces with custom Grok patterns.
  - **Kibana**: Observability dashboard on port 5601 for visualizing HTTP status distributions, traffic volume, and response latencies.
  - **Live In-App Console**: Interactive real-time log inspector & metric monitor in `admin.html`.
- **Grafana & Prometheus Uptime Monitoring**:
  - **Uptime & Downtime Tracking**: Synthetic Blackbox HTTP probing every 15s to monitor endpoint reachability, SSL expiry, and DNS resolution latency.
  - **SLA Visualization**: 30-Day availability gauge (99.98% SLA target), latency heatmaps, and downtime incident timelines.
  - **Prometheus Metrics**: Exposes standard `/metrics` and `/health` probe endpoints.
  - **Interactive In-App Dashboard**: Real-time 30-day availability bar and 1-click outage simulation in `admin.html`.
- **Java Backend System**:
  - Zero-dependency Java HTTP Server (`com.portfolio.PortfolioServer`) running on JDK 11, 17, 21, or 23.
  - RESTful APIs for Fixed Credentials validation (`/api/auth/login`), Google Sign-In (`/api/auth/google`), Contact Form submissions (`/api/contact`), and Project Listings (`/api/projects`).
  - Spring Boot compatible Maven `pom.xml` configuration included.
- **Authentication & Login System**:
  - **"Continue with Google"**: Styled to Google's official design with a responsive account switcher simulation and GIS hooks.
  - **Fixed Credentials**: Configured demo login with 1-click auto-fill button.
  - **Protected Dashboard**: `admin.html` displays logged-in user state, incoming contact messages inbox, and quick profile editor.
- **Best CSS Modern UI**:
  - Dark and Light mode toggle with local storage persistence.
  - Glassmorphic translucent cards with backdrop blur.
  - Fluid typography, animated gradient borders, skill percentage meters, and mobile navigation drawer.

---

## 🔐 Demo Credentials

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Portfolio Owner** | `venkateswara` or `venkateswara.23MIC7132@vitapstudent.ac.in` | `vitap2028` | Full Admin |
| **System Admin** | `admin` or `admin@vitap.ac.in` | `admin123` | Full Admin |
| **Google Sign-In** | Click **"Continue with Google"** on `login.html` | *None required* | Authenticated Visitor / Admin |

> **Pro-Tip**: On `login.html`, click the **"⚡ Auto-Fill"** button to populate the form instantly!

---

## 🚀 How to Run

### Method 1: Open Directly in Browser (No Server Required)
Simply double-click **`index.html`** or **`login.html`** in your file explorer to open it in Chrome, Edge, Firefox, or Safari. All authentication features, theme switching, and contact form handling work client-side with localStorage.

### Method 2: Launch Native Java Backend Server
Run the included 1-click Windows batch file:
```cmd
start-server.bat
```
Or run the commands manually:
```bash
# Compile Java backend
javac -encoding UTF-8 -d bin src/main/java/com/portfolio/models/*.java src/main/java/com/portfolio/*.java

# Run Java server
java -cp bin com.portfolio.PortfolioServer 8080
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.

### Method 3: Run via Python (Alternative)
```bash
python server.py
```

### Method 4: Launch Complete ELK Stack via Docker
Spin up Elasticsearch (9200), Logstash (5044/5000), and Kibana (5601):
```bash
docker compose -f docker-compose.elk.yml up -d
```
Access Kibana dashboards at [http://localhost:5601/](http://localhost:5601/).
See [`elk/README-ELK.md`](elk/README-ELK.md) for complete pipeline details.

### Method 5: Launch Grafana & Prometheus Uptime Monitoring via Docker
Spin up Grafana (3000), Prometheus (9090), and Blackbox Exporter (9115):
```bash
docker compose -f docker-compose.monitoring.yml up -d
```
Access Grafana dashboard at [http://localhost:3000/](http://localhost:3000/) (Login: `admin` / `admin`).
See [`monitoring/README-GRAFANA.md`](monitoring/README-GRAFANA.md) for full instructions.

---

## 📁 Project File Structure

```
portfolio-venkateswara/
├── index.html                       # Main interactive portfolio page
├── login.html                       # Login page (Continue with Google + Fixed Credentials)
├── admin.html                       # Authenticated admin dashboard & message inbox
├── css/
│   ├── style.css                    # Core design system, dark/light themes & bento layout
│   ├── auth.css                     # Login page and Google auth styling
│   └── admin.css                    # Admin dashboard styles
├── js/
│   ├── main.js                      # Portfolio interactions, filters & modals
│   ├── auth.js                      # Authentication manager (Credentials + Google OAuth)
│   ├── data.js                      # Centralized data model from resume
│   └── admin.js                     # Admin inbox and message management
├── assets/
│   ├── images/
│   │   ├── profile.png              # Cropped portrait photo from resume
│   │   ├── resume-original.png      # Original uploaded resume image
│   │   └── google-icon.svg          # Official Google SVG logo
│   └── docs/
│       └── Timmareddy_Venkateswara_Reddy_Resume.html  # Printable resume (Save to PDF)
├── src/main/java/com/portfolio/     # Java Source Code
│   ├── PortfolioServer.java         # Native Java HTTP Server & REST API router
│   ├── AuthController.java          # Java Authentication Handler
│   ├── ContactController.java       # Java Contact Form & Message Store
│   ├── ProjectController.java       # Java Projects & Resume API Handler
│   └── models/
│       ├── User.java                # Java User model
│       ├── ContactMessage.java      # Java Contact Message model
│       └── Project.java             # Java Project model
├── pom.xml                          # Maven build file for Java
├── start-server.bat                 # 1-click Windows runner
├── start-server.sh                  # 1-click Linux/macOS runner
├── server.py                        # Alternative Python server
└── README.md                        # Documentation
```
