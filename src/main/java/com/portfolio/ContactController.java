package com.portfolio;

import com.portfolio.models.ContactMessage;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Controller managing contact form submissions and message inquiries in Java.
 */
public class ContactController {

    private static final List<ContactMessage> messages = new CopyOnWriteArrayList<>();

    static {
        // Pre-populate with initial inquiry for previewing admin features
        messages.add(new ContactMessage(
                "VIT-AP Tech Club Coordinator",
                "techclub@vitapstudent.ac.in",
                "Invitation to Speak on Android & Java Projects",
                "Hi Venkateswara, we saw your Java and Android projects and would love to feature your work at the upcoming campus developer showcase!"
        ));
    }

    public static synchronized ContactMessage addMessage(String name, String email, String subject, String message) {
        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty() || message == null || message.trim().isEmpty()) {
            return null;
        }
        ContactMessage msg = new ContactMessage(name.trim(), email.trim(), subject != null ? subject.trim() : "Portfolio Inquiry", message.trim());
        messages.add(0, msg); // latest first
        return msg;
    }

    public static List<ContactMessage> getMessages() {
        return Collections.unmodifiableList(messages);
    }

    public static synchronized boolean deleteMessage(String id) {
        if (id == null) return false;
        return messages.removeIf(m -> m.getId().equals(id));
    }

    public static String getMessagesJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < messages.size(); i++) {
            sb.append(messages.get(i).toJson());
            if (i < messages.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
