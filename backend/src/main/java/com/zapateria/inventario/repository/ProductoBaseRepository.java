package com.zapateria.inventario.repository;

import com.zapateria.inventario.model.ProductoBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoBaseRepository extends JpaRepository<ProductoBase, Long> {
    List<ProductoBase> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);
}
