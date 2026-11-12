package com.portfolio;

import com.portfolio.models.User;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Controller handling authentication logic in Java:
 * 1. Fixed Credentials validation (for portfolio owner / admin)
 * 2. "Continue with Google" OAuth validation & mock verification
 * 3. Session tokens and user state management
 */
public class AuthController {

    // Configured Fixed Credentials
    public static final String FIXED_EMAIL_1 = "venkateswara.23MIC7132@vitapstudent.ac.in";
    public static final String FIXED_USER_1 = "venkateswara";
    public static final String FIXED_PASS_1 = "vitap2028";

    public static final String FIXED_EMAIL_2 = "admin@vitap.ac.in";
    public static final String FIXED_USER_2 = "admin";
    public static final String FIXED_PASS_2 = "admin123";

    // Active session store: sessionToken -> User
    private static final Map<String, User> sessions = new ConcurrentHashMap<>();

    /**
     * Authenticate via fixed credentials
     */
    public static AuthResponse authenticateWithCredentials(String usernameOrEmail, String password) {
        if (usernameOrEmail == null || password == null) {
            return new AuthResponse(false, "Username and password are required.", null, null);
        }

        String input = usernameOrEmail.trim().toLowerCase();
        String pass = password.trim();

        boolean matchOwner = (input.equals(FIXED_EMAIL_1.toLowerCase()) || input.equals(FIXED_USER_1)) && pass.equals(FIXED_PASS_1);
        boolean matchAdmin = (input.equals(FIXED_EMAIL_2.toLowerCase()) || input.equals(FIXED_USER_2)) && pass.equals(FIXED_PASS_2);

        if (matchOwner) {
            User user = new User(
                    "usr_venkateswara",
                    "venkateswara",
                    FIXED_EMAIL_1,
                    "Timmareddy Venkateswara Reddy",
                    "ADMIN",
                    "CREDENTIALS",
                    "assets/images/profile.png"
            );
            String token = "tok_" + UUID.randomUUID().toString().replace("-", "");
            sessions.put(token, user);
            return new AuthResponse(true, "Authentication successful! Welcome Venkateswara.", token, user);
        } else if (matchAdmin) {
            User user = new User(
                    "usr_admin",
                    "admin",
                    FIXED_EMAIL_2,
                    "Portfolio Administrator",
                    "ADMIN",
                    "CREDENTIALS",
                    "assets/images/profile.png"
            );
            String token = "tok_" + UUID.randomUUID().toString().replace("-", "");
            sessions.put(token, user);
            return new AuthResponse(true, "Authentication successful! Welcome Administrator.", token, user);
        }

        return new AuthResponse(false, "Invalid username or password. Check demo credentials on the login screen.", null, null);
    }

    /**
     * Authenticate via "Continue with Google"
     * Supports both real Google ID tokens and client-verified payloads.
     */
    public static AuthResponse authenticateWithGoogle(String email, String name, String picture, String googleSubId) {
        if (email == null || email.trim().isEmpty()) {
            return new AuthResponse(false, "Google account email is required.", null, null);
        }

        String cleanEmail = email.trim();
        String displayName = (name != null && !name.trim().isEmpty()) ? name.trim() : cleanEmail.split("@")[0];
        String avatar = (picture != null && !picture.trim().isEmpty()) ? picture.trim() : "assets/images/profile.png";

        // Assign ADMIN role if it matches Venkateswara's university email, otherwise GOOGLE_USER
        String role = cleanEmail.equalsIgnoreCase(FIXED_EMAIL_1) ? "ADMIN" : "GOOGLE_USER";

        User user = new User(
                "google_" + (googleSubId != null ? googleSubId : UUID.randomUUID().toString().substring(0, 8)),
                cleanEmail.split("@")[0],
                cleanEmail,
                displayName,
                role,
                "GOOGLE",
                avatar
        );

        String token = "tok_g_" + UUID.randomUUID().toString().replace("-", "");
        sessions.put(token, user);

        return new AuthResponse(true, "Google authentication successful! Signed in as " + displayName + ".", token, user);
    }

    /**
     * Get user by session token
     */
    public static User getUserFromSession(String token) {
        if (token == null) return null;
        return sessions.get(token);
    }

    /**
     * Terminate session
     */
    public static boolean logout(String token) {
        if (token == null) return false;
        return sessions.remove(token) != null;
    }

    public static class AuthResponse {
        private boolean success;
        private String message;
        private String token;
        private User user;

        public AuthResponse(boolean success, String message, String token, User user) {
            this.success = success;
            this.message = message;
            this.token = token;
            this.user = user;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
        public User getUser() { return user; }

        public String toJson() {
            return "{" +
                    "\"success\":" + success + "," +
                    "\"message\":\"" + escape(message) + "\"," +
                    "\"token\":" + (token != null ? "\"" + escape(token) + "\"" : "null") + "," +
                    "\"user\":" + (user != null ? user.toJson() : "null") +
                    "}";
        }

        private String escape(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
        }
    }
}
