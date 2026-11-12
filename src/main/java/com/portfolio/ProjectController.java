package com.portfolio;

import com.portfolio.models.Project;

import java.util.*;

/**
 * Controller serving Venkateswara's project portfolio data in Java.
 * Based on resume:
 * - Student Developer at Vellore Institute of Technology – Andhra Pradesh
 * - Tech: Java, Python, SQL, JavaScript, HTML, CSS, MySQL, Android Studio, VS Code, GitHub
 */
public class ProjectController {

    private static final List<Project> projects = new ArrayList<>();

    static {
        projects.add(new Project(
                "proj-grafana",
                "Grafana & Prometheus: Website Uptime & Downtime Monitoring System",
                "devops",
                "Configured Grafana and Prometheus with Blackbox Exporter to monitor website uptime, probe HTTP latency, and display availability on dashboards.",
                "Engineered a synthetic uptime and SLA monitoring pipeline using Grafana, Prometheus, and Blackbox Exporter. Configured automated HTTP probes every 15 seconds to monitor endpoint reachability, HTTP status codes, SSL expiry, and DNS resolution latency. Built comprehensive Grafana dashboards featuring a 30-day uptime SLA gauge, downtime incident timelines, latency heatmaps, and threshold alert rules.",
                Arrays.asList("Grafana", "Prometheus", "Blackbox Exporter", "Uptime Monitoring", "DevOps", "Docker", "SRE"),
                "https://github.com/venkateswara23/grafana-uptime-monitoring",
                "#demo",
                "Observability & SRE"
        ));

        projects.add(new Project(
                "proj-elk",
                "ELK Stack: Centralized Logging & Observability Pipeline",
                "devops",
                "Integrated Elasticsearch, Logstash, and Kibana (ELK Stack) to collect, process, search, and visualize application or server logs in real time.",
                "Architected a centralized log aggregation and monitoring solution using the ELK Stack (Elasticsearch, Logstash, Kibana). Implemented Logstash data pipelines with customized Grok patterns to parse raw server access and error logs into structured JSON documents. Ingested records into an Elasticsearch cluster with index lifecycle management (ILM). Built interactive Kibana dashboards displaying real-time traffic, HTTP 4xx/5xx error frequencies, and latency percentiles.",
                Arrays.asList("ELK Stack", "Elasticsearch", "Logstash", "Kibana", "Log Analysis", "Docker", "Java"),
                "https://github.com/venkateswara23/elk-stack-logging",
                "#demo",
                "DevOps & Observability"
        ));

        projects.add(new Project(
                "proj-1",
                "Android Smart Budget & Expense Tracker",
                "android",
                "Native Android application built with Java and SQLite/MySQL to monitor student daily expenditures and set monthly limits.",
                "Designed and developed a complete mobile expense tracker in Android Studio using Java. Features interactive category breakdowns, SQLite offline caching, synchronization with MySQL backend, budget threshold alerts, and graphical expense trends.",
                Arrays.asList("Java", "Android Studio", "SQLite", "MySQL", "XML UI"),
                "https://github.com/venkateswara23/android-expense-tracker",
                "#demo",
                "Featured Mobile App"
        ));

        projects.add(new Project(
                "proj-2",
                "Student Academic Record & Grade System",
                "java",
                "Robust desktop Java application connecting to MySQL via JDBC for managing student profiles, course enrollments, and GPA analytics.",
                "Engineered a full relational database management system using Java Swing and MySQL. Implements CRUD operations, normalized database schemas, parameterized SQL queries for security, and generates downloadable performance reports.",
                Arrays.asList("Java", "MySQL", "JDBC", "SQL", "Swing"),
                "https://github.com/venkateswara23/student-grade-management",
                "#demo",
                "Core Database Project"
        ));

        projects.add(new Project(
                "proj-3",
                "Algorithmic Task & Schedule Optimizer",
                "python",
                "Python-based scheduling utility using priority queues (Min-Heap) and graph dependency resolution for study workload planning.",
                "Applies core Data Structures & Algorithms (DSA) concepts learned at VIT-AP to optimize daily academic schedules. Solves prerequisite course/task chains using Topological Sort and Dijkstra-inspired time allocation.",
                Arrays.asList("Python", "DSA", "Heap Queue", "Graph Algorithms", "Tkinter"),
                "https://github.com/venkateswara23/algo-task-scheduler",
                "#demo",
                "Algorithms & DSA"
        ));

        projects.add(new Project(
                "proj-4",
                "Campus Event & Club Registration Hub",
                "fullstack",
                "Responsive full-stack web application for university student clubs, event discovery, and RSVP registrations.",
                "Constructed modern responsive front-end using HTML5, CSS3, and JavaScript, paired with MySQL relational backend and REST endpoints for event broadcasting, participant listings, and automated email notifications.",
                Arrays.asList("JavaScript", "HTML5", "CSS3", "MySQL", "REST API"),
                "https://github.com/venkateswara23/vitap-campus-event-hub",
                "#demo",
                "Full Stack Web"
        ));

        projects.add(new Project(
                "proj-5",
                "Academic Research Scraper & Summarizer",
                "python",
                "Automated Python tool to scrape, clean, and store tech news, research papers, and computer science publication metadata.",
                "Built with Python and BeautifulSoup to extract trending research papers and documentation. Stores clean structured records into MySQL tables and outputs summary reports in CSV and JSON formats.",
                Arrays.asList("Python", "BeautifulSoup", "MySQL", "Data Scraping", "Pandas"),
                "https://github.com/venkateswara23/python-paper-scraper",
                "#demo",
                "Data & Automation"
        ));
    }

    public static List<Project> getAllProjects() {
        return Collections.unmodifiableList(projects);
    }

    public static String getProjectsJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < projects.size(); i++) {
            sb.append(projects.get(i).toJson());
            if (i < projects.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
