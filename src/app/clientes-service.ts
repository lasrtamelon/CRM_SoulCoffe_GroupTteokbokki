// src/app/clientes.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, map } from 'rxjs/operators';

export interface Cliente {
  id?: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private baseUrl = 'http://localhost:8080/api/clientes';

  private _clientes = signal<Cliente[]>([]);
  clientes = computed(() => this._clientes());

  constructor(private http: HttpClient) {
    const inicial = toSignal(
      this.http.get<Cliente[]>(this.baseUrl).pipe(
        map(d => d ?? []),
        tap(d => this._clientes.set(d))
      ),
      { initialValue: [] as Cliente[] }
    );

    // aseguramos que la señal tenga algo desde el principio
    this._clientes.set(inicial());
  }

  recargar() {
    this.http.get<Cliente[]>(this.baseUrl)
      .subscribe(d => this._clientes.set(d ?? []));
  }

  crear(c: Cliente) {
    return this.http.post<Cliente>(this.baseUrl, c).pipe(
      tap(n => this._clientes.update(list => [...list, n]))
    );
  }

  actualizar(c: Cliente) {
    if (!c.id) return;

    return this.http.put<Cliente>(`${this.baseUrl}/${c.id}`, c).pipe(
      tap(upd =>
        this._clientes.update(list =>
          list.map(x => x.id === upd.id ? upd : x)
        )
      )
    );
  }

  eliminar(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() =>
        this._clientes.update(list => list.filter(x => x.id !== id))
      )
    );
  }
}
