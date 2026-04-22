package com.nutrix.auth;

import com.nutrix.auth.dto.LoginRequestDto;
import com.nutrix.auth.dto.LoginResponseDto;
import com.nutrix.config.JwtConfig;
import com.nutrix.user.User;
import com.nutrix.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JwtConfig jwtConfig;
    private final AuthFailureLogRepository authFailureLogRepository;
    private final HttpServletRequest request;

    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    logFailedAttempt(loginRequest.getUsername());
                    return new BadCredentialsException("Credenciais inválidas");
                });

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            logFailedAttempt(loginRequest.getUsername());
            throw new BadCredentialsException("Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        return new LoginResponseDto(
                token,
                jwtConfig.getExpirationMs(),
                user.getUsername(),
                user.getFullName()
        );
    }

    private void logFailedAttempt(String username) {
        AuthFailureLog log = new AuthFailureLog();
        log.setUsernameAttempted(username);
        log.setIpAddress(getClientIp());
        authFailureLogRepository.save(log);
    }

    private String getClientIp() {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
