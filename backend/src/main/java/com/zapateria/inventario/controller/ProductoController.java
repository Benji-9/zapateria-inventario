package com.zapateria.inventario.controller;

import com.zapateria.inventario.model.ProductoBase;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.service.ExcelService;
import com.zapateria.inventario.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Allow all for MVP development
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ExcelService excelService;

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

    @PostMapping("/import")
    public ResponseEntity<String> importProductos(@RequestParam("file") MultipartFile file) {
        try {
            List<VarianteProducto> variantes = excelService.importarProductos(file.getInputStream());
            // Here we would need a service method to save these intelligently (check
            // duplicates, etc.)
            // For MVP, let's just save them.
            // validation.
            for (VarianteProducto v : variantes) {
                productoService.createProducto(v.getProductoBase());
            }
            return ResponseEntity.ok("Importación procesada (Simulada - " + variantes.size() + " items leídos)");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error al leer archivo: " + e.getMessage());
        }
    }
}
