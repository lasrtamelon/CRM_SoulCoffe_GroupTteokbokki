import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService, Cliente } from '../clientes-service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-component.html'
})
export class ClientesComponent {

  // El formulario es un Cliente, no un ClientesService
  form: Cliente = this.crearModeloVacio();

  constructor(public service: ClientesService) {}

  // Getter para plantilla
  get clientes() {
    return this.service.clientes();
  }

  private crearModeloVacio(): Cliente {
    return {
      nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      telefono: ''
    };
  }

  //CRUD
  nuevo() {
    this.form = this.crearModeloVacio();
  }

  editar(c: Cliente) {
    this.form = { ...c }; 
  }

  //detecta si el formulario tiene un id, si lo tiene lo actualiza, y si no lo crea.
  guardar() {
    if (this.form.id) {
      this.service.actualizar(this.form)?.subscribe(() => {
        this.nuevo();
      });
    } else {
      this.service.crear(this.form).subscribe(() => {
        this.nuevo();
      });
    }
  }

  borrar(id?: number) {
    if (!id) return;
    this.service.eliminar(id).subscribe();
  }
}
