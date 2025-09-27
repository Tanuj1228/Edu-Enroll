package com.college.project.student_service.payload;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}