package com.zapateria.inventario.repository;

import com.zapateria.inventario.model.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {
    List<MovimientoStock> findByVarianteIdOrderByFechaHoraDesc(Long varianteId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(m.cantidad) FROM MovimientoStock m WHERE m.tipo = 'SALIDA' AND m.motivo = 'VENTA' AND m.fechaHora >= :fechaInicio")
    Long sumVentasDesde(
            @org.springframework.data.repository.query.Param("fechaInicio") java.time.LocalDateTime fechaInicio);

    @org.springframework.data.jpa.repository.Query("SELECT new com.zapateria.inventario.dto.ReporteVentasDTO(" +
            "CONCAT(v.productoBase.marca, ' ', v.productoBase.modelo), " +
            "SUM(m.cantidad), " +
            "SUM(m.cantidad * v.precio)) " +
            "FROM MovimientoStock m JOIN m.variante v " +
            "WHERE m.tipo = 'SALIDA' AND m.motivo = 'VENTA' " +
            "GROUP BY v.productoBase.marca, v.productoBase.modelo " +
            "ORDER BY SUM(m.cantidad) DESC")
    List<com.zapateria.inventario.dto.ReporteVentasDTO> findTopVentas(
            org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT v FROM VarianteProducto v WHERE v.id NOT IN " +
            "(SELECT DISTINCT m.variante.id FROM MovimientoStock m WHERE m.tipo = 'SALIDA' AND m.fechaHora >= :fechaInicio)")
    List<com.zapateria.inventario.model.VarianteProducto> findInmovilizados(
            @org.springframework.data.repository.query.Param("fechaInicio") java.time.LocalDateTime fechaInicio);
}
