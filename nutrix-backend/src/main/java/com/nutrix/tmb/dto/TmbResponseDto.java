package com.nutrix.tmb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmbResponseDto {

    private BigDecimal tmbKcal;
    private BigDecimal tdeeKcal;
}
