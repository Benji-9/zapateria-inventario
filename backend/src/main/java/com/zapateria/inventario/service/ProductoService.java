package com.zapateria.inventario.service;

import com.zapateria.inventario.model.ProductoBase;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.repository.ProductoBaseRepository;
import com.zapateria.inventario.repository.VarianteProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoBaseRepository productoRepository;

    @Autowired
    private VarianteProductoRepository varianteRepository;

    public List<ProductoBase> getAllProductos() {
        return productoRepository.findAll();
    }

    public Optional<ProductoBase> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    @Transactional
    public ProductoBase createProducto(ProductoBase producto) {
        return productoRepository.save(producto);
    }

    public List<VarianteProducto> getVariantesByProducto(Long productoId) {
        return varianteRepository.findByProductoBaseId(productoId);
    }

    @Transactional
    public VarianteProducto createVariante(VarianteProducto variante) {
        if (varianteRepository.findBySku(variante.getSku()).isPresent()) {
            throw new IllegalArgumentException("El SKU ya existe: " + variante.getSku());
        }
        return varianteRepository.save(variante);
    }

    public Optional<VarianteProducto> getVarianteById(Long id) {
        return varianteRepository.findById(id);
    }

    public List<VarianteProducto> searchVariantes(String query) {
        if (query == null || query.trim().isEmpty()) {
            return varianteRepository.findAll();
        }
        return varianteRepository.search(query);
    }
}
