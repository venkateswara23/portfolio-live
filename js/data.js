/**
 * Central Data Model for Timmareddy Venkateswara Reddy's Portfolio
 * Sourced directly from resume data:
 * - Vellore Institute of Technology - Andhra Pradesh (VIT-AP)
 * - M.Tech Integrated with Computer Science and Engineering (CSE) 2023 - 2028
 * - Java, Python, SQL, JavaScript, HTML, CSS, MySQL, Android Studio, VS Code, GitHub
 * - Telugu (Native), English (Professional Working Proficiency)
 */

const PORTFOLIO_DATA = {
  profile: {
    fullName: "Timmareddy Venkateswara Reddy",
    shortName: "Venkateswara Reddy",
    title: "Student Developer",
    headline: "Integrated M.Tech CSE Student @ VIT-AP | Java & Python Developer",
    statusBadge: "Available for Internships & Projects",
    bio: "Goal-driven student developer currently pursuing Integrated M.Tech in Computer Science and Engineering at Vellore Institute of Technology – Andhra Pradesh. Focused on academic and personal software engineering in Java, Python, SQL, and Mobile Application Development with a dedication to creating clean, user-friendly solutions.",
    location: "Duvvur, Kadapa, Andhra Pradesh, India",
    email: "venkateswara.23MIC7132@vitapstudent.ac.in",
    phone: "+91 98765 43210", // placeholder as noted on resume
    github: "https://github.com/venkateswara23",
    linkedin: "https://www.linkedin.com/in/venkateswara-reddy-771559a381",
    avatar: "assets/images/profile.png",
    resumeOriginal: "assets/images/resume-original.png"
  },

  education: [
    {
      institution: "Vellore Institute of Technology – Andhra Pradesh",
      degree: "M.Tech Integrated with Computer Science and Engineering (CSE)",
      period: "2023 – 2028 (Expected)",
      location: "Amaravati, Andhra Pradesh",
      highlights: [
        "Focus on programming fundamentals, advanced algorithms, and data structures.",
        "Relational database management systems (DBMS) and SQL query optimization.",
        "Mobile Application Development with Android Studio and Java.",
        "Commitment to continuous learning and hands-on system building."
      ]
    }
  ],

  skills: {
    programming: [
      { name: "Java", level: 90, icon: "fa-brands fa-java", category: "languages" },
      { name: "Python", level: 85, icon: "fa-brands fa-python", category: "languages" },
      { name: "SQL", level: 85, icon: "fa-solid fa-database", category: "database" },
      { name: "JavaScript", level: 75, icon: "fa-brands fa-js", category: "languages" }
    ],
    web: [
      { name: "HTML5", level: 95, icon: "fa-brands fa-html5", category: "web" },
      { name: "CSS3 / Modern CSS", level: 90, icon: "fa-brands fa-css3-alt", category: "web" },
      { name: "Responsive UI Design", level: 85, icon: "fa-solid fa-mobile-screen", category: "web" }
    ],
    databases: [
      { name: "MySQL", level: 85, icon: "fa-solid fa-server", category: "database" },
      { name: "Elasticsearch", level: 85, icon: "fa-solid fa-magnifying-glass-chart", category: "database" },
      { name: "Relational Modeling & JDBC", level: 80, icon: "fa-solid fa-diagram-project", category: "database" }
    ],
    tools: [
      { name: "Grafana Dashboards & Uptime", level: 90, icon: "fa-solid fa-chart-area", category: "tools" },
      { name: "Prometheus & Blackbox Exporter", level: 85, icon: "fa-solid fa-fire", category: "tools" },
      { name: "ELK Stack (Elasticsearch, Logstash, Kibana)", level: 90, icon: "fa-solid fa-chart-line", category: "tools" },
      { name: "Logstash Pipelines & Grok", level: 85, icon: "fa-solid fa-filter", category: "tools" },
      { name: "Kibana Dashboards & Metrics", level: 85, icon: "fa-solid fa-chart-pie", category: "tools" },
      { name: "Android Studio", level: 80, icon: "fa-brands fa-android", category: "tools" },
      { name: "Visual Studio Code", level: 90, icon: "fa-solid fa-code", category: "tools" },
      { name: "GitHub / Git", level: 85, icon: "fa-brands fa-github", category: "tools" }
    ]
  },

  languages: [
    { name: "Telugu", proficiency: 100, label: "Native Speaker" },
    { name: "English", proficiency: 85, label: "Professional Working Proficiency" }
  ],

  projects: [
    {
      id: "proj-grafana",
      title: "Grafana & Prometheus: Website Uptime & Downtime Monitoring System",
      category: "devops",
      badge: "Observability & SRE",
      description: "Configured Grafana and Prometheus with Blackbox Exporter to continuously monitor website uptime and downtime, track HTTP latency, and visualize SLA metrics on real-time dashboards.",
      details: "Engineered an end-to-end synthetic uptime and availability monitoring architecture using Grafana, Prometheus, and Blackbox Exporter. Configured automated HTTP probes every 15 seconds to monitor endpoint reachability, HTTP response codes, SSL certificate validity, and DNS resolution speed. Built comprehensive Grafana dashboards featuring a 30-day uptime percentage gauge (99.9% SLA target), real-time downtime incident logs, probe latency heatmaps, and threshold-based alert notification rules (Email/Webhook) triggered upon consecutive probe failures.",
      tags: ["Grafana", "Prometheus", "Blackbox Exporter", "Uptime Monitoring", "DevOps", "Docker", "SRE", "Alerting"],
      github: "https://github.com/venkateswara23/grafana-uptime-monitoring",
      icon: "fa-solid fa-gauge-high"
    },
    {
      id: "proj-elk",
      title: "ELK Stack: Centralized Logging & Observability Pipeline",
      category: "devops",
      badge: "DevOps & Cloud Monitoring",
      description: "Integrated Elasticsearch, Logstash, and Kibana (ELK Stack) to collect, process, search, and visualize application and server logs in real-time.",
      details: "Architected a scalable, centralized logging infrastructure utilizing the ELK Stack (Elasticsearch, Logstash, Kibana) to monitor distributed services. Configured Logstash pipelines with custom Grok patterns to parse raw server logs, transform timestamped events, and ingest them into indexed Elasticsearch clusters. Created custom Kibana dashboards featuring real-time log search, HTTP error rate visualization, anomaly alerting, and latency analytics.",
      tags: ["ELK Stack", "Elasticsearch", "Logstash", "Kibana", "Log Analysis", "Docker", "Java", "JSON"],
      github: "https://github.com/venkateswara23/elk-stack-logging",
      icon: "fa-solid fa-chart-line"
    },
    {
      id: "proj-1",
      title: "Android Smart Budget & Expense Tracker",
      category: "android",
      badge: "Mobile Application",
      description: "Native Android application engineered in Android Studio with Java to manage student budgets, categorize daily expenses, and visualize spending patterns.",
      details: "Features an intuitive material interface, local SQLite storage with synchronization to a remote MySQL database, custom monthly spending alerts, and dynamic chart visualizations.",
      tags: ["Java", "Android Studio", "SQLite", "MySQL", "XML UI"],
      github: "https://github.com/venkateswara23",
      icon: "fa-solid fa-mobile-screen-button"
    },
    {
      id: "proj-2",
      title: "Student Academic Record & Grade System",
      category: "java",
      badge: "Database System",
      description: "Desktop Java application connecting to a MySQL relational database via JDBC for managing student profiles, course enrollments, and GPA analytics.",
      details: "Implements comprehensive CRUD operations, secure parameterized SQL queries, GPA/CGPA computational engine, and generates printable student performance transcripts.",
      tags: ["Java", "MySQL", "JDBC", "SQL", "Swing UI"],
      github: "https://github.com/venkateswara23",
      icon: "fa-solid fa-graduation-cap"
    },
    {
      id: "proj-3",
      title: "Algorithmic Task & Schedule Optimizer",
      category: "python",
      badge: "Algorithms & DSA",
      description: "Python-based task scheduling engine utilizing priority queues (Min-Heap) and graph dependency resolution for academic workload planning.",
      details: "Applies core Data Structures & Algorithms (Topological Sort, Dijkstra's algorithm, and Heap structures) to prevent assignment deadlocks and optimize daily study schedules.",
      tags: ["Python", "Algorithms", "Heap Queue", "Graph DSA", "Tkinter"],
      github: "https://github.com/venkateswara23",
      icon: "fa-solid fa-network-wired"
    },
    {
      id: "proj-4",
      title: "Campus Event & Club Registration Hub",
      category: "web",
      badge: "Full Stack Web",
      description: "Interactive full-stack web application for university student clubs, event discovery, real-time RSVP registrations, and admin broadcasts.",
      details: "Constructed with modern semantic HTML5, CSS3 glassmorphism, responsive JavaScript front-end, and a RESTful backend connected to MySQL database for participant management.",
      tags: ["JavaScript", "HTML5", "CSS3", "MySQL", "REST API"],
      github: "https://github.com/venkateswara23",
      icon: "fa-solid fa-globe"
    },
    {
      id: "proj-5",
      title: "Academic Research Scraper & Summarizer",
      category: "python",
      badge: "Automation & Data",
      description: "Automated Python utility to crawl, clean, and categorize academic research publications and tech announcements into structured MySQL tables.",
      details: "Built using BeautifulSoup and Python Requests to parse multi-page research feeds, filter by CS topic tags, and export datasets into JSON and CSV formats for coursework analysis.",
      tags: ["Python", "BeautifulSoup", "MySQL", "Data Scraping", "Automation"],
      github: "https://github.com/venkateswara23",
      icon: "fa-solid fa-robot"
    }
  ]
};
