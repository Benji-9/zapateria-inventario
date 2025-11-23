package com.zapateria.inventario.controller;

import com.zapateria.inventario.model.MovimientoStock;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping("/movimientos")
    public ResponseEntity<MovimientoStock> registrarMovimiento(@Valid @RequestBody MovimientoStock movimiento) {
        MovimientoStock nuevoMovimiento = stockService.registrarMovimiento(movimiento);
        return ResponseEntity.ok(nuevoMovimiento);
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
