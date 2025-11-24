package com.zapateria.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteKpiDTO {
    private Long ventasMes;
    private Double ingresosMes;
    private Long stockTotal;
    private Long productosBajoStock;
}
