package com.zapateria.inventario.service;

import com.zapateria.inventario.model.MovimientoStock;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.model.enums.TipoMovimiento;
import com.zapateria.inventario.repository.MovimientoStockRepository;
import com.zapateria.inventario.repository.VarianteProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private MovimientoStockRepository movimientoRepository;

    @Autowired
    private VarianteProductoRepository varianteRepository;

    @Transactional
    public MovimientoStock registrarMovimiento(MovimientoStock movimiento) {
        VarianteProducto variante = varianteRepository.findById(movimiento.getVariante().getId())
                .orElseThrow(() -> new IllegalArgumentException("Variante no encontrada"));

        int cantidad = movimiento.getCantidad();
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }

        // Update Stock based on Type
        if (movimiento.getTipo() == TipoMovimiento.ENTRADA) {
            variante.setStockActual(variante.getStockActual() + cantidad);
        } else if (movimiento.getTipo() == TipoMovimiento.SALIDA) {
            if (variante.getStockActual() < cantidad) {
                throw new IllegalArgumentException("Stock insuficiente para realizar la salida");
            }
            variante.setStockActual(variante.getStockActual() - cantidad);
        } else if (movimiento.getTipo() == TipoMovimiento.AJUSTE) {
            // Adjustment sets the stock to a specific value? Or adds/subtracts?
            // Usually adjustment is a correction. Let's assume "Adjustment" in this context 
            // means "Add/Subtract" correction, but the user prompt said "Registrar Movimiento (ajusta stock automáticamente)".
            // Let's assume AJUSTE acts like a signed change or we treat it as a direct set?
            // Re-reading: "MovimientoStock: ... cantidad ... motivo (compra, venta, merma...)".
            // If it's MERMA (Loss), it's a reduction. If it's INVENTARIO (Correction), it could be up or down.
            // For simplicity in this MVP, let's treat AJUSTE as a direct modification where 'cantidad' is the delta.
            // But wait, 'cantidad' is usually absolute.
            // Let's simplify: AJUSTE will be treated as a signed addition (can be negative if we allowed negative quantity, but we validate > 0).
            // Actually, let's stick to:
            // ENTRADA: +
            // SALIDA: -
            // AJUSTE: Let's treat it as an absolute set? No, that loses history of "how much changed".
            // Let's treat AJUSTE as a generic "Change" where we might need another field or just use ENTRADA/SALIDA for everything.
            // But the enum has AJUSTE.
            // Let's define AJUSTE as: "Add this amount" (if positive) or we need a sign.
            // Given the constraints, I will assume AJUSTE is handled like ENTRADA/SALIDA depending on context, 
            // OR we assume AJUSTE is a special type where we might need to handle it carefully.
            // Let's treat AJUSTE as a "Reset to this value" or "Delta".
            // Most standard inventory systems use "Adjustment" to mean "I counted X, system says Y, diff is Z".
            // Let's implement AJUSTE as "Add/Subtract" logic is complicated without sign.
            // I will treat AJUSTE as "Add" for now, but usually it implies a correction.
            // BETTER APPROACH: The user said "MovimientoStock: ... tipo (ENTRADA, SALIDA, AJUSTE)".
            // I will treat AJUSTE as a manual correction that behaves like ENTRADA (add) or SALIDA (subtract) is ambiguous.
            // Let's assume AJUSTE is for "Found extra stock" (Add) or "Lost stock" (Subtract).
            // I will assume for now AJUSTE adds, but I should probably clarify or just use ENTRADA/SALIDA for everything.
            // However, to support "Inventory Count" where you set the final value:
            // The movement should calculate the delta.
            // Let's stick to: ENTRADA adds, SALIDA subtracts. AJUSTE... let's make it add (if you found more) or use SALIDA (if you lost some).
            // Actually, let's just support ENTRADA and SALIDA for the MVP logic to be safe.
            // If the user selects AJUSTE, we need to know if it's positive or negative.
            // I will assume AJUSTE acts as an absolute update? No, that breaks the "Movement" log concept.
            // I will treat AJUSTE as "Add" (Positive adjustment). If they want to reduce, they use SALIDA with reason "Adjustment/Merma".
            // Wait, "Motivo" has "INVENTARIO".
            // OK, I will implement:
            // ENTRADA -> Stock += Cantidad
            // SALIDA -> Stock -= Cantidad
            // AJUSTE -> Stock += Cantidad (Assume positive adjustment). If negative needed, use SALIDA.
            // This is a simplification.
             variante.setStockActual(variante.getStockActual() + cantidad);
        }

        varianteRepository.save(variante);

        movimiento.setFechaHora(LocalDateTime.now());
        movimiento.setVariante(variante); // Ensure relation is set
        return movimientoRepository.save(movimiento);
    }

    public List<MovimientoStock> getHistorial(Long varianteId) {
        return movimientoRepository.findByVarianteIdOrderByFechaHoraDesc(varianteId);
    }
    
    public List<VarianteProducto> getAlertasStock() {
        return varianteRepository.findConStockBajo();
    }
}
