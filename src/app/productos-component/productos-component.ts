import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../productos-service';
import { computed } from '@angular/core';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-component.html'
})
export class ProductosComponent {

  constructor(private service: ProductosService) {}

  get productos() {
    return this.service.productos();
  }

  form = signal<Producto>({
    id_cafe: undefined,
    nombre: '',
    origen: '',
    tipo: 'grano',
    grano: 'arabica',
    tueste:'Suave',
    intensidad: 1 ,
    precio: 0 ,
    stock: 0,
    ventas:0,
    imagen: ''
  });

  editar(p: Producto) {
    this.form.set({ ...p });
  }

  borrar(id_cafe: number) {
    this.service.eliminar(id_cafe).subscribe();
  }

  guardar() {
    const f = this.form();

    if (f.id_cafe) {
      this.service.actualizar(f).subscribe();
    } else {
      this.service.crear(f).subscribe();
    }

    this.form.set({
      id_cafe: undefined,
      nombre: '',
      origen: '',
      tipo: 'grano',
      grano: 'arabica',
      tueste: 'Suave',
      intensidad: 1,
      precio: 0,
      stock: 0,
      ventas:0,
      imagen: ''
    });
  }
}
