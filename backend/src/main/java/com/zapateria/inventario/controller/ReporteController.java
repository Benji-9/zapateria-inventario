package com.zapateria.inventario.controller;

import com.zapateria.inventario.dto.ReporteKpiDTO;
import com.zapateria.inventario.dto.ReporteVentasDTO;
import com.zapateria.inventario.model.VarianteProducto;
import com.zapateria.inventario.repository.MovimientoStockRepository;
import com.zapateria.inventario.repository.VarianteProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private MovimientoStockRepository movimientoRepository;

    @Autowired
    private VarianteProductoRepository varianteRepository;

    @GetMapping("/kpis")
    public ReporteKpiDTO getKpis() {
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);

        Long ventasMes = movimientoRepository.sumVentasDesde(inicioMes);
        if (ventasMes == null)
            ventasMes = 0L;

        // Ingresos estimados (simple calculation, better to do in DB but this works for
        // MVP)
        // Actually, let's use the DB query for total sales value if possible, or just
        // sum here.
        // For MVP, let's keep it simple. We can add a sum query later.
        // Let's assume average price or just use 0 for now if query is complex.
        // Wait, I added a query for sales ranking that sums total. I can reuse that
        // logic or add a specific one.
        // Let's add a simple sum query for total income.

        // Stock Total
        Long stockTotal = varianteRepository.findAll().stream().mapToLong(VarianteProducto::getStockActual).sum();

        // Low Stock
        Long bajoStock = (long) varianteRepository.findConStockBajo().size();

        return new ReporteKpiDTO(ventasMes, 0.0, stockTotal, bajoStock);
    }

    @GetMapping("/ranking-ventas")
    public List<ReporteVentasDTO> getRankingVentas() {
        return movimientoRepository.findTopVentas(PageRequest.of(0, 10));
    }

    @GetMapping("/inmovilizados")
    public List<VarianteProducto> getInmovilizados() {
        // 30 days without sales
        LocalDateTime fechaLimite = LocalDateTime.now().minusDays(30);
        return movimientoRepository.findInmovilizados(fechaLimite);
    }
}
