import {
  Component,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';

import { ProductosService, Producto } from '../productos-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard-admin.html',
})
export class DashboardComponent implements OnInit {

  // ---------------------------
  // FORMULARIO
  // ---------------------------
  form: FormGroup;

  // Producto seleccionado (para editar)
  selectedProducto = signal<Producto | null>(null);
  editando = computed(() => this.selectedProducto() !== null);

  // ---------------------------
  // PRODUCTOS
  // ---------------------------
  productos = computed(() => this.productosService.productos());

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService
  ) {
    this.form = this.fb.group({
      id_cafe: [null],
      nombre: ['', Validators.required],
      origen: ['', Validators.required],
      tipo: ['grano', Validators.required],
      grano: ['arabica', Validators.required],
      tueste: ['Suave', Validators.required],
      intensidad: [1, Validators.required],
      precio: [0, Validators.required],
      stock: [0, Validators.required],
      ventas: [0, Validators.required],
      imagen: ['']
    });
  }

  // ---------------------------
  // GRAFICAS
  // ---------------------------
  stockChart!: Chart;
  ventasChart!: Chart;

  ngOnInit(): void {

    // Crear gráficas tras render
    setTimeout(() => this.createCharts(), 50);

    // Actualizar gráficas cuando cambien los productos
    effect(() => {
      this.updateCharts();
    });
  }

  createCharts() {
    const lista = this.productos();

  // Crear degradado bonito
  const ctx1 = (document.getElementById('stockChart') as HTMLCanvasElement).getContext('2d')!;
  const gradient1 = ctx1.createLinearGradient(0, 0, 0, 400);
  gradient1.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
  gradient1.addColorStop(1, 'rgba(251, 191, 36, 0.1)');

  this.stockChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: lista.map(p => p.nombre),
      datasets: [{
        label: 'Stock',
        data: lista.map(p => p.stock),
        borderColor: '#fbbf24',
        borderWidth: 3,
        backgroundColor: gradient1,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: 'white',   
            font: { size: 12 }
          }
        },
        y: {
          ticks: {
            color: 'white',   
            font: { size: 12 }
          }
        }
      }
    }
  });

  this.ventasChart = new Chart('ventasChart', {
    type: 'line',
    data: {
      labels: lista.map(p => p.nombre),
      datasets: [{
        label: 'Ventas',
        data: lista.map(p => p.ventas),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.35)',
        fill: true,
        tension: 0.45,
        pointRadius: 3
      }]
    },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: 'white',  
              font: { size: 12 }
            }
          },
          y: {
            ticks: {
              color: 'white',   
              font: { size: 12 }
            }
          }
        }
      }
  });
  }

  updateCharts() {
    if (!this.stockChart || !this.ventasChart) return;

    const lista = this.productos();

    this.stockChart.data.labels = lista.map(p => p.nombre);
    this.stockChart.data.datasets[0].data = lista.map(p => p.stock);
    this.stockChart.update();

    this.ventasChart.data.labels = lista.map(p => p.nombre);
    this.ventasChart.data.datasets[0].data = lista.map(p => p.ventas);
    this.ventasChart.update();
  }

  // ---------------------------
  // CRUD
  // ---------------------------
  nuevoProducto() {
    this.selectedProducto.set(null);

    this.form.reset({
      id_cafe: null,
      nombre: '',
      origen: '',
      tipo: 'grano',
      grano: 'arabica',
      tueste: 'Suave',
      intensidad: 1,
      precio: 0,
      stock: 0,
      ventas: 0,
      imagen: ''
    });
  }

  editarProducto(p: Producto) {
    this.selectedProducto.set(p);
    this.form.patchValue(p);
  }

  guardarProducto() {
    const value = this.form.getRawValue() as Producto;

    // EDITAR
    if (value.id_cafe) {
      this.productosService.actualizar(value).subscribe(() => {
        this.nuevoProducto();
      });
      return;
    }

    // CREAR
    this.productosService.crear(value).subscribe(() => {
      this.nuevoProducto();
    });
  }

  borrarProducto(p: Producto) {
    if (!p.id_cafe) return;

    this.productosService.eliminar(p.id_cafe).subscribe(() => {
      // No hace falta nada: signals actualiza la UI automáticamente
    });
  }
}
