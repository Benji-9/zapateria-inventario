package com.zapateria.inventario.model;

import com.zapateria.inventario.model.enums.Categoria;
import com.zapateria.inventario.model.enums.Genero;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos_base")
public class ProductoBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Genero genero;

    private String temporada;

    private String proveedor;
}
