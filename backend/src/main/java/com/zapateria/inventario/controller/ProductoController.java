package com.zapateria.inventario.controller;

import com.zapateria.inventario.model.ProductoBase;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Allow all for MVP development
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<ProductoBase> getAllProductos() {
        return productoService.getAllProductos();
    }

    @PostMapping
    public ProductoBase createProducto(@Valid @RequestBody ProductoBase producto) {
        return productoService.createProducto(producto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoBase> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/variantes")
    public List<VarianteProducto> getVariantesByProducto(@PathVariable Long id) {
        return productoService.getVariantesByProducto(id);
    }

    @PostMapping("/variantes")
    public VarianteProducto createVariante(@Valid @RequestBody VarianteProducto variante) {
        return productoService.createVariante(variante);
    }

    @GetMapping("/variantes/search")
    public List<VarianteProducto> searchVariantes(@RequestParam String q) {
        return productoService.searchVariantes(q);
    }
}
