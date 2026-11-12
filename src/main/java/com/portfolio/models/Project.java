package com.portfolio.models;

import java.io.Serializable;
import java.util.List;

/**
 * Model representing portfolio projects based on Timmareddy Venkateswara Reddy's skillset:
 * Java, Python, SQL, Android Studio, Web Development.
 */
public class Project implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String category; // "android", "java", "python", "fullstack"
    private String description;
    private String detailedDescription;
    private List<String> technologies;
    private String githubUrl;
    private String liveDemoUrl;
    private String badge;

    public Project(String id, String title, String category, String description, String detailedDescription,
                   List<String> technologies, String githubUrl, String liveDemoUrl, String badge) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.detailedDescription = detailedDescription;
        this.technologies = technologies;
        this.githubUrl = githubUrl;
        this.liveDemoUrl = liveDemoUrl;
        this.badge = badge;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getDetailedDescription() { return detailedDescription; }
    public List<String> getTechnologies() { return technologies; }
    public String getGithubUrl() { return githubUrl; }
    public String getLiveDemoUrl() { return liveDemoUrl; }
    public String getBadge() { return badge; }

    public String toJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":\"").append(escape(id)).append("\",");
        sb.append("\"title\":\"").append(escape(title)).append("\",");
        sb.append("\"category\":\"").append(escape(category)).append("\",");
        sb.append("\"description\":\"").append(escape(description)).append("\",");
        sb.append("\"detailedDescription\":\"").append(escape(detailedDescription)).append("\",");
        sb.append("\"badge\":\"").append(escape(badge)).append("\",");
        sb.append("\"githubUrl\":\"").append(escape(githubUrl)).append("\",");
        sb.append("\"liveDemoUrl\":\"").append(escape(liveDemoUrl)).append("\",");
        sb.append("\"technologies\":[");
        for (int i = 0; i < technologies.size(); i++) {
            sb.append("\"").append(escape(technologies.get(i))).append("\"");
            if (i < technologies.size() - 1) sb.append(",");
        }
        sb.append("]}");
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
