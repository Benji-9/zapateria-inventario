package com.zapateria.inventario.controller;

import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.repository.VarianteProductoRepository;
import com.zapateria.inventario.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ExcelService excelService;

    @Autowired
    private VarianteProductoRepository varianteRepository;

    @GetMapping("/inventario/excel")
    public ResponseEntity<InputStreamResource> exportarInventario() throws IOException {
        List<VarianteProducto> variantes = varianteRepository.findAll();
        ByteArrayInputStream in = excelService.exportarInventario(variantes);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=inventario.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
