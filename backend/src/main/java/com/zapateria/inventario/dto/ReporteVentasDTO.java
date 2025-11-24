package com.zapateria.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteVentasDTO {
    private String producto; // Marca + Modelo
    private Long cantidad;
    private BigDecimal total;
}
