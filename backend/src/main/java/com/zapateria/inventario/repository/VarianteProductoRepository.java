package com.zapateria.inventario.repository;

import com.zapateria.inventario.model.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Long> {
    Optional<VarianteProducto> findBySku(String sku);
    List<VarianteProducto> findByProductoBaseId(Long productoBaseId);
    
    // Find variants with low stock
    @org.springframework.data.jpa.repository.Query("SELECT v FROM VarianteProducto v WHERE v.stockActual <= v.stockMinimo")
    List<VarianteProducto> findConStockBajo();
}
