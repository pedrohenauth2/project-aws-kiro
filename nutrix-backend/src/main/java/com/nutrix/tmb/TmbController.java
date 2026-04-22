package com.nutrix.tmb;

import com.nutrix.tmb.dto.TmbRequestDto;
import com.nutrix.tmb.dto.TmbResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tmb")
@RequiredArgsConstructor
public class TmbController {

    private final TmbService tmbService;

    @PostMapping("/calculate")
    public ResponseEntity<TmbResponseDto> calculate(@Valid @RequestBody TmbRequestDto request) {
        TmbResponseDto response = tmbService.calculateTmb(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/history")
    public ResponseEntity<TmbHistory> saveHistory(
            @Valid @RequestBody TmbRequestDto request,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        TmbResponseDto response = tmbService.calculateTmb(request);
        TmbHistory history = tmbService.saveHistory(request, response, userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history")
    public ResponseEntity<List<TmbHistory>> getHistory(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        List<TmbHistory> history = tmbService.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        tmbService.clearHistory(userId);
        return ResponseEntity.noContent().build();
    }
}
