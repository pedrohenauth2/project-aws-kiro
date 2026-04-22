package com.nutrix.tmb.dto;

import java.math.BigDecimal;

public record TmbResponseDto(
    BigDecimal tmbKcal,
    BigDecimal tdeeKcal
) {}
