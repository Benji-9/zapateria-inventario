package com.zapateria.inventario.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String role;
    private String username;

    public LoginResponse(String accessToken, String role, String username) {
        this.accessToken = accessToken;
        this.role = role;
        this.username = username;
    }
}
