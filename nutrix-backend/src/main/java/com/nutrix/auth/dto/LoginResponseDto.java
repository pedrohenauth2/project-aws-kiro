package com.nutrix.auth.dto;

public record LoginResponseDto(
    String token,
    Long expiresIn,
    String username,
    String fullName
) {}
