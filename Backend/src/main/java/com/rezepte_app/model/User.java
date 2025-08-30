package com.rezepte_app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id", length = 255)
    private String id;

    @Column(name = "trial_start_date")
    private LocalDateTime trialStartDate;

    // Default constructor for JPA
    public User() {
    }

    // Constructor with required fields
    public User(String id) {
        this.id = id;
        this.trialStartDate = LocalDateTime.now();
    }

    // Constructor with all fields
    public User(String id, LocalDateTime trialStartDate) {
        this.id = id;
        this.trialStartDate = trialStartDate;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getTrialStartDate() {
        return trialStartDate;
    }

    public void setTrialStartDate(LocalDateTime trialStartDate) {
        this.trialStartDate = trialStartDate;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", trialStartDate=" + trialStartDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null ? id.equals(user.id) : user.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
