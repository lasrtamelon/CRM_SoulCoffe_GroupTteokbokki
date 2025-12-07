import { Component, computed } from '@angular/core';
import { Producto, ProductosService } from '../productos-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-component',
  imports: [CommonModule],
  templateUrl: './inicio-component.html',
  styleUrl: './inicio-component.css',
})
export class InicioComponent {

  // Productos top 3 ventas
  productosTop3 = computed(() => {
    const lista = this.productosService.productos();
    return [...lista].sort((a, b) => b.ventas - a.ventas).slice(0, 3);
  });

  constructor(private productosService: ProductosService) {}
}
