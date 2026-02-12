package com.spartaApp.api.modules.auth.domain;

public enum UserRole {
    ADMIN("admin"),
    PERSONAL("personal"),
    STUDENT("student");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}