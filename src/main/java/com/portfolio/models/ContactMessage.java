package com.portfolio.models;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * Model for inquiries received through the portfolio contact form.
 */
public class ContactMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private long timestamp;
    private String formattedDate;

    public ContactMessage() {
        this.id = UUID.randomUUID().toString();
        this.timestamp = System.currentTimeMillis();
        this.formattedDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    public ContactMessage(String name, String email, String subject, String message) {
        this();
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public long getTimestamp() { return timestamp; }
    public String getFormattedDate() { return formattedDate; }

    public String toJson() {
        return "{" +
                "\"id\":\"" + escape(id) + "\"," +
                "\"name\":\"" + escape(name) + "\"," +
                "\"email\":\"" + escape(email) + "\"," +
                "\"subject\":\"" + escape(subject) + "\"," +
                "\"message\":\"" + escape(message) + "\"," +
                "\"timestamp\":" + timestamp + "," +
                "\"formattedDate\":\"" + escape(formattedDate) + "\"" +
                "}";
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
