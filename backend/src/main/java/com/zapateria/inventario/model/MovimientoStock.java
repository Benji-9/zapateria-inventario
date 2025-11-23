package com.zapateria.inventario.model;

import com.zapateria.inventario.model.enums.MotivoMovimiento;
import com.zapateria.inventario.model.enums.TipoMovimiento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "movimientos_stock")
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "variante_id", nullable = false)
    private VarianteProducto variante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimiento tipo;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @NotBlank(message = "El usuario es obligatorio")
    @Column(nullable = false)
    private String usuario; // Storing username for simplicity in MVP

    @NotNull(message = "El motivo es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MotivoMovimiento motivo;

    private String observaciones;
}
