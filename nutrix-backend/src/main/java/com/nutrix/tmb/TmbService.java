package com.nutrix.tmb;

import com.nutrix.tmb.dto.TmbRequestDto;
import com.nutrix.tmb.dto.TmbResponseDto;
import com.nutrix.user.User;
import com.nutrix.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TmbService {

    private final TmbHistoryRepository tmbHistoryRepository;
    private final UserRepository userRepository;

    public TmbResponseDto calculateTmb(TmbRequestDto request) {
        BigDecimal tmb = calculateTmbValue(request);
        BigDecimal tdee = calculateTdee(tmb, request.getActivityLevel());

        return new TmbResponseDto(
                tmb.setScale(2, RoundingMode.HALF_UP),
                tdee.setScale(2, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal calculateTmbValue(TmbRequestDto request) {
        // Fórmula Mifflin-St Jeor
        // MALE:   TMB = (10 × weight) + (6.25 × height) − (5 × age) + 5
        // FEMALE: TMB = (10 × weight) + (6.25 × height) − (5 × age) − 161

        BigDecimal weightComponent = request.getWeightKg().multiply(BigDecimal.valueOf(10));
        BigDecimal heightComponent = request.getHeightCm().multiply(BigDecimal.valueOf(6.25));
        BigDecimal ageComponent = BigDecimal.valueOf(request.getAgeYears()).multiply(BigDecimal.valueOf(5));

        BigDecimal tmb = weightComponent
                .add(heightComponent)
                .subtract(ageComponent);

        if (request.getBiologicalSex() == BiologicalSex.MALE) {
            tmb = tmb.add(BigDecimal.valueOf(5));
        } else {
            tmb = tmb.subtract(BigDecimal.valueOf(161));
        }

        return tmb;
    }

    private BigDecimal calculateTdee(BigDecimal tmb, ActivityLevel activityLevel) {
        return tmb.multiply(BigDecimal.valueOf(activityLevel.getFactor()));
    }

    @Transactional
    public TmbHistory saveHistory(TmbRequestDto request, TmbResponseDto response, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        TmbHistory history = new TmbHistory();
        history.setUser(user);
        history.setWeightKg(request.getWeightKg());
        history.setHeightCm(request.getHeightCm());
        history.setAgeYears(request.getAgeYears());
        history.setBiologicalSex(request.getBiologicalSex());
        history.setActivityLevel(request.getActivityLevel());
        history.setTmbKcal(response.getTmbKcal());
        history.setTdeeKcal(response.getTdeeKcal());

        return tmbHistoryRepository.save(history);
    }

    public List<TmbHistory> getHistory(Long userId) {
        return tmbHistoryRepository.findByUserIdOrderByCalculatedAtDesc(userId);
    }

    @Transactional
    public void clearHistory(Long userId) {
        tmbHistoryRepository.deleteByUserId(userId);
    }
}
