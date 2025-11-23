package com.zapateria.inventario.service;

import com.zapateria.inventario.model.ProductoBase;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.repository.ProductoBaseRepository;
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
public class ProductoServiceTest {

    @Mock
    private ProductoBaseRepository productoRepository;

    @Mock
    private VarianteProductoRepository varianteRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    public void createVariante_ShouldThrowException_WhenSkuExists() {
        VarianteProducto variante = new VarianteProducto();
        variante.setSku("SKU-123");

        when(varianteRepository.findBySku("SKU-123")).thenReturn(Optional.of(new VarianteProducto()));

        assertThrows(IllegalArgumentException.class, () -> {
            productoService.createVariante(variante);
        });
    }

    @Test
    public void createVariante_ShouldSave_WhenSkuIsUnique() {
        VarianteProducto variante = new VarianteProducto();
        variante.setSku("SKU-NEW");

        when(varianteRepository.findBySku("SKU-NEW")).thenReturn(Optional.empty());
        when(varianteRepository.save(any(VarianteProducto.class))).thenReturn(variante);

        VarianteProducto saved = productoService.createVariante(variante);
        assertNotNull(saved);
        assertEquals("SKU-NEW", saved.getSku());
    }
}
