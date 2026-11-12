package com.portfolio.models;

import java.io.Serializable;

/**
 * User model representing authenticated portfolio visitors and admin.
 * Timmareddy Venkateswara Reddy Portfolio System
 */
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String username;
    private String email;
    private String displayName;
    private String role; // "ADMIN" or "GOOGLE_USER"
    private String authProvider; // "CREDENTIALS" or "GOOGLE"
    private String avatarUrl;
    private long loginTimestamp;

    public User() {
    }

    public User(String id, String username, String email, String displayName, String role, String authProvider, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.authProvider = authProvider;
        this.avatarUrl = avatarUrl;
        this.loginTimestamp = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public long getLoginTimestamp() { return loginTimestamp; }
    public void setLoginTimestamp(long loginTimestamp) { this.loginTimestamp = loginTimestamp; }

    public String toJson() {
        return "{" +
                "\"id\":\"" + escape(id) + "\"," +
                "\"username\":\"" + escape(username) + "\"," +
                "\"email\":\"" + escape(email) + "\"," +
                "\"displayName\":\"" + escape(displayName) + "\"," +
                "\"role\":\"" + escape(role) + "\"," +
                "\"authProvider\":\"" + escape(authProvider) + "\"," +
                "\"avatarUrl\":\"" + escape(avatarUrl) + "\"," +
                "\"loginTimestamp\":" + loginTimestamp +
                "}";
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
