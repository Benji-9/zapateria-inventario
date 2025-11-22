package com.zapateria.inventario.controller;

import com.zapateria.inventario.model.MovimientoStock;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping("/movimientos")
    public ResponseEntity<?> registrarMovimiento(@RequestBody MovimientoStock movimiento) {
        try {
            MovimientoStock nuevoMovimiento = stockService.registrarMovimiento(movimiento);
            return ResponseEntity.ok(nuevoMovimiento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/alertas")
    public List<VarianteProducto> getAlertasStock() {
        return stockService.getAlertasStock();
    }

    @GetMapping("/historial/{varianteId}")
    public List<MovimientoStock> getHistorial(@PathVariable Long varianteId) {
        return stockService.getHistorial(varianteId);
    }
}
