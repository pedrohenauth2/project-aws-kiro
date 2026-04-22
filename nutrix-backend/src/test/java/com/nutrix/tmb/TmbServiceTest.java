package com.nutrix.tmb;

import com.nutrix.tmb.dto.TmbRequestDto;
import com.nutrix.tmb.dto.TmbResponseDto;
import com.nutrix.user.User;
import com.nutrix.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TmbService Unit Tests")
class TmbServiceTest {

    @Mock
    private TmbHistoryRepository tmbHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TmbService tmbService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo masculino - SEDENTARY")
    void shouldCalculateTmbCorrectlyForMaleSedentary() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(75));
        request.setHeightCm(BigDecimal.valueOf(175));
        request.setAgeYears(30);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.SEDENTARY);

        // Expected: (10 × 75) + (6.25 × 175) − (5 × 30) + 5 = 750 + 1093.75 - 150 + 5 = 1698.75
        BigDecimal expectedTmb = BigDecimal.valueOf(1698.75);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.2)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo masculino - LIGHTLY_ACTIVE")
    void shouldCalculateTmbCorrectlyForMaleLightlyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(80));
        request.setHeightCm(BigDecimal.valueOf(180));
        request.setAgeYears(25);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.LIGHTLY_ACTIVE);

        // Expected: (10 × 80) + (6.25 × 180) − (5 × 25) + 5 = 800 + 1125 - 125 + 5 = 1805
        BigDecimal expectedTmb = BigDecimal.valueOf(1805.00);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.375)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo masculino - MODERATELY_ACTIVE")
    void shouldCalculateTmbCorrectlyForMaleModeratelyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(85));
        request.setHeightCm(BigDecimal.valueOf(185));
        request.setAgeYears(35);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.MODERATELY_ACTIVE);

        // Expected: (10 × 85) + (6.25 × 185) − (5 × 35) + 5 = 850 + 1156.25 - 175 + 5 = 1836.25
        BigDecimal expectedTmb = BigDecimal.valueOf(1836.25);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.55)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo masculino - VERY_ACTIVE")
    void shouldCalculateTmbCorrectlyForMaleVeryActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(90));
        request.setHeightCm(BigDecimal.valueOf(190));
        request.setAgeYears(28);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.VERY_ACTIVE);

        // Expected: (10 × 90) + (6.25 × 190) − (5 × 28) + 5 = 900 + 1187.5 - 140 + 5 = 1952.5
        BigDecimal expectedTmb = BigDecimal.valueOf(1952.50);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.725)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo masculino - EXTREMELY_ACTIVE")
    void shouldCalculateTmbCorrectlyForMaleExtremelyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(95));
        request.setHeightCm(BigDecimal.valueOf(195));
        request.setAgeYears(22);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.EXTREMELY_ACTIVE);

        // Expected: (10 × 95) + (6.25 × 195) − (5 × 22) + 5 = 950 + 1218.75 - 110 + 5 = 2063.75
        BigDecimal expectedTmb = BigDecimal.valueOf(2063.75);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.9)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo feminino - SEDENTARY")
    void shouldCalculateTmbCorrectlyForFemaleSedentary() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(60));
        request.setHeightCm(BigDecimal.valueOf(165));
        request.setAgeYears(28);
        request.setBiologicalSex(BiologicalSex.FEMALE);
        request.setActivityLevel(ActivityLevel.SEDENTARY);

        // Expected: (10 × 60) + (6.25 × 165) − (5 × 28) − 161 = 600 + 1031.25 - 140 - 161 = 1330.25
        BigDecimal expectedTmb = BigDecimal.valueOf(1330.25);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.2)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo feminino - LIGHTLY_ACTIVE")
    void shouldCalculateTmbCorrectlyForFemaleLightlyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(55));
        request.setHeightCm(BigDecimal.valueOf(160));
        request.setAgeYears(25);
        request.setBiologicalSex(BiologicalSex.FEMALE);
        request.setActivityLevel(ActivityLevel.LIGHTLY_ACTIVE);

        // Expected: (10 × 55) + (6.25 × 160) − (5 × 25) − 161 = 550 + 1000 - 125 - 161 = 1264
        BigDecimal expectedTmb = BigDecimal.valueOf(1264.00);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.375)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo feminino - MODERATELY_ACTIVE")
    void shouldCalculateTmbCorrectlyForFemaleModeratelyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(65));
        request.setHeightCm(BigDecimal.valueOf(170));
        request.setAgeYears(32);
        request.setBiologicalSex(BiologicalSex.FEMALE);
        request.setActivityLevel(ActivityLevel.MODERATELY_ACTIVE);

        // Expected: (10 × 65) + (6.25 × 170) − (5 × 32) − 161 = 650 + 1062.5 - 160 - 161 = 1391.5
        BigDecimal expectedTmb = BigDecimal.valueOf(1391.50);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.55)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo feminino - VERY_ACTIVE")
    void shouldCalculateTmbCorrectlyForFemaleVeryActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(70));
        request.setHeightCm(BigDecimal.valueOf(175));
        request.setAgeYears(26);
        request.setBiologicalSex(BiologicalSex.FEMALE);
        request.setActivityLevel(ActivityLevel.VERY_ACTIVE);

        // Expected: (10 × 70) + (6.25 × 175) − (5 × 26) − 161 = 700 + 1093.75 - 130 - 161 = 1502.75
        BigDecimal expectedTmb = BigDecimal.valueOf(1502.75);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.725)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve calcular TMB corretamente para sexo feminino - EXTREMELY_ACTIVE")
    void shouldCalculateTmbCorrectlyForFemaleExtremelyActive() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(58));
        request.setHeightCm(BigDecimal.valueOf(168));
        request.setAgeYears(24);
        request.setBiologicalSex(BiologicalSex.FEMALE);
        request.setActivityLevel(ActivityLevel.EXTREMELY_ACTIVE);

        // Expected: (10 × 58) + (6.25 × 168) − (5 × 24) − 161 = 580 + 1050 - 120 - 161 = 1349
        BigDecimal expectedTmb = BigDecimal.valueOf(1349.00);
        BigDecimal expectedTdee = expectedTmb.multiply(BigDecimal.valueOf(1.9)).setScale(2, RoundingMode.HALF_UP);

        // When
        TmbResponseDto response = tmbService.calculateTmb(request);

        // Then
        assertThat(response.tmbKcal()).isEqualByComparingTo(expectedTmb);
        assertThat(response.tdeeKcal()).isEqualByComparingTo(expectedTdee);
    }

    @Test
    @DisplayName("Deve salvar histórico com valores corretos")
    void shouldSaveHistoryWithCorrectValues() {
        // Given
        TmbRequestDto request = new TmbRequestDto();
        request.setWeightKg(BigDecimal.valueOf(75));
        request.setHeightCm(BigDecimal.valueOf(175));
        request.setAgeYears(30);
        request.setBiologicalSex(BiologicalSex.MALE);
        request.setActivityLevel(ActivityLevel.SEDENTARY);

        TmbResponseDto response = new TmbResponseDto(
                BigDecimal.valueOf(1698.75),
                BigDecimal.valueOf(2038.50)
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tmbHistoryRepository.save(any(TmbHistory.class))).thenAnswer(invocation -> {
            TmbHistory history = invocation.getArgument(0);
            history.setId(1L);
            return history;
        });

        // When
        TmbHistory savedHistory = tmbService.saveHistory(request, response, 1L);

        // Then
        ArgumentCaptor<TmbHistory> historyCaptor = ArgumentCaptor.forClass(TmbHistory.class);
        verify(tmbHistoryRepository).save(historyCaptor.capture());

        TmbHistory capturedHistory = historyCaptor.getValue();
        assertThat(capturedHistory.getUser()).isEqualTo(testUser);
        assertThat(capturedHistory.getWeightKg()).isEqualByComparingTo(request.getWeightKg());
        assertThat(capturedHistory.getHeightCm()).isEqualByComparingTo(request.getHeightCm());
        assertThat(capturedHistory.getAgeYears()).isEqualTo(request.getAgeYears());
        assertThat(capturedHistory.getBiologicalSex()).isEqualTo(request.getBiologicalSex());
        assertThat(capturedHistory.getActivityLevel()).isEqualTo(request.getActivityLevel());
        assertThat(capturedHistory.getTmbKcal()).isEqualByComparingTo(response.tmbKcal());
        assertThat(capturedHistory.getTdeeKcal()).isEqualByComparingTo(response.tdeeKcal());
        assertThat(capturedHistory.getCalculatedAt()).isNotNull();
    }
}
