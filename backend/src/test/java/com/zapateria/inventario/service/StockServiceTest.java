package com.zapateria.inventario.service;

import com.zapateria.inventario.model.MovimientoStock;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.model.enums.TipoMovimiento;
import com.zapateria.inventario.repository.MovimientoStockRepository;
import com.zapateria.inventario.repository.VarianteProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class StockServiceTest {

    @Mock
    private MovimientoStockRepository movimientoRepository;

    @Mock
    private VarianteProductoRepository varianteRepository;

    @InjectMocks
    private StockService stockService;

    @Test
    public void registrarMovimiento_ShouldThrowException_WhenStockIsInsufficient() {
        VarianteProducto variante = new VarianteProducto();
        variante.setId(1L);
        variante.setStockActual(5);

        MovimientoStock movimiento = new MovimientoStock();
        movimiento.setVariante(variante);
        movimiento.setTipo(TipoMovimiento.SALIDA);
        movimiento.setCantidad(10);

        when(varianteRepository.findById(1L)).thenReturn(Optional.of(variante));

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.registrarMovimiento(movimiento);
        });
    }

    @Test
    public void registrarMovimiento_ShouldUpdateStock_WhenEntrada() {
        VarianteProducto variante = new VarianteProducto();
        variante.setId(1L);
        variante.setStockActual(10);

        MovimientoStock movimiento = new MovimientoStock();
        movimiento.setVariante(variante);
        movimiento.setTipo(TipoMovimiento.ENTRADA);
        movimiento.setCantidad(5);

        when(varianteRepository.findById(1L)).thenReturn(Optional.of(variante));
        when(movimientoRepository.save(any(MovimientoStock.class))).thenReturn(movimiento);

        stockService.registrarMovimiento(movimiento);

        assertEquals(15, variante.getStockActual());
    }
}
