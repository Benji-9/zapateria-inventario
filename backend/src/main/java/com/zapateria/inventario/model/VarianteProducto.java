package com.zapateria.inventario.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "variantes_producto")
public class VarianteProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_base_id", nullable = false)
    private ProductoBase productoBase;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String talle;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private BigDecimal costo;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stockActual;

    @Column(nullable = false)
    private Integer stockMinimo;

    private String ubicacion;
}
