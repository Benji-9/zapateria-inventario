package com.zapateria.inventario.service;

import com.zapateria.inventario.model.VarianteProducto;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import com.zapateria.inventario.model.enums.Categoria;
import com.zapateria.inventario.model.enums.Genero;

@Service
public class ExcelService {

    public ByteArrayInputStream exportarInventario(List<VarianteProducto> variantes) throws IOException {
        String[] columns = { "ID", "Marca", "Modelo", "Color", "Talle", "SKU", "Stock", "Precio", "Costo" };

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventario");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Data
            int rowIdx = 1;
            for (VarianteProducto v : variantes) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(v.getId());
                row.createCell(1).setCellValue(v.getProductoBase().getMarca());
                row.createCell(2).setCellValue(v.getProductoBase().getModelo());
                row.createCell(3).setCellValue(v.getColor());
                row.createCell(4).setCellValue(v.getTalle());
                row.createCell(5).setCellValue(v.getSku());
                row.createCell(6).setCellValue(v.getStockActual());
                row.createCell(7).setCellValue(v.getPrecio().doubleValue());
                row.createCell(8).setCellValue(v.getCosto().doubleValue());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public List<VarianteProducto> importarProductos(java.io.InputStream is) throws IOException {
        List<VarianteProducto> variantes = new java.util.ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            java.util.Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                // Basic parsing (Assuming columns match export)
                // 0: ID (Ignored for new), 1: Marca, 2: Modelo, 3: Color, 4: Talle, 5: SKU, 6:
                // Stock, 7: Precio, 8: Costo
                try {
                    VarianteProducto v = new VarianteProducto();
                    com.zapateria.inventario.model.ProductoBase p = new com.zapateria.inventario.model.ProductoBase();

                    p.setMarca(getCellValue(currentRow.getCell(1)));
                    p.setModelo(getCellValue(currentRow.getCell(2)));
                    // Defaults
                    p.setCategoria(Categoria.OTRO);
                    p.setGenero(Genero.UNISEX);

                    v.setProductoBase(p);
                    v.setColor(getCellValue(currentRow.getCell(3)));
                    v.setTalle(getCellValue(currentRow.getCell(4)));
                    v.setSku(getCellValue(currentRow.getCell(5)));

                    Cell stockCell = currentRow.getCell(6);
                    v.setStockActual(stockCell != null ? (int) stockCell.getNumericCellValue() : 0);

                    Cell precioCell = currentRow.getCell(7);
                    v.setPrecio(precioCell != null ? java.math.BigDecimal.valueOf(precioCell.getNumericCellValue())
                            : java.math.BigDecimal.ZERO);

                    Cell costoCell = currentRow.getCell(8);
                    v.setCosto(costoCell != null ? java.math.BigDecimal.valueOf(costoCell.getNumericCellValue())
                            : java.math.BigDecimal.ZERO);

                    variantes.add(v);
                } catch (Exception e) {
                    System.err.println("Error parsing row " + rowNumber + ": " + e.getMessage());
                }
                rowNumber++;
            }
        }
        return variantes;
    }

    private String getCellValue(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue()); // Simple assumption for now
            default:
                return "";
        }
    }
}
