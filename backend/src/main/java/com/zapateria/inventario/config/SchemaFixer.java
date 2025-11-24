package com.zapateria.inventario.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Intentando eliminar restricción de categoría obsoleta...");
            jdbcTemplate.execute("ALTER TABLE productos_base DROP CONSTRAINT IF EXISTS productos_base_categoria_check");

            System.out.println("Intentando eliminar restricciones de movimientos...");
            jdbcTemplate
                    .execute("ALTER TABLE movimientos_stock DROP CONSTRAINT IF EXISTS movimientos_stock_tipo_check");
            jdbcTemplate
                    .execute("ALTER TABLE movimientos_stock DROP CONSTRAINT IF EXISTS movimientos_stock_motivo_check");

            System.out.println("Restricciones eliminadas con éxito (si existían).");
        } catch (Exception e) {
            System.err.println("Error al intentar eliminar la restricción: " + e.getMessage());
        }
    }
}
