import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Producto {
  id_cafe?: number;
  nombre: string;
  origen: string;
  tipo: 'grano' | 'molido' | '';
  grano: 'arabica' | 'robusta' | 'liberica' | 'excelsa';
  tueste: 'Suave' | 'Medio' | 'Fuerte';
  intensidad: number;
  precio: number;
  stock: number;
  ventas: number;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {

  private readonly baseUrl = 'http://localhost:8080/api/producto';

  private _productos = signal<Producto[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  readonly productosSignal = computed(() => this._productos());
  readonly cargando = computed(() => this._cargando());
  readonly error = computed(() => this._error());

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  productos(): Producto[] {
    return this._productos();
  }

  cargarProductos(): void {
    this._cargando.set(true);
    this.http.get<Producto[]>(this.baseUrl)
      .pipe(
        tap({
          next: (lista) => {
            this._productos.set(lista);
            this._cargando.set(false);
          },
          error: () => {
            this._error.set('No se pudieron cargar los productos');
            this._cargando.set(false);
          }
        })
      )
      .subscribe();
  }

  // =============================
  // CREAR — ahora funciona bien
  // =============================
  crear(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, p)
      .pipe(
        tap((creado) => {
          this._productos.update(lista => [...lista, creado]);
        })
      );
  }

  // =============================
  // EDITAR — sustituye al producto viejo
  // =============================
  actualizar(p: Producto): Observable<Producto> {
    if (!p.id_cafe) throw new Error('Falta id_cafe');

    return this.http.put<Producto>(`${this.baseUrl}/${p.id_cafe}`, p)
      .pipe(
        tap((actualizado) => {
          this._productos.update(lista =>
            lista.map(x => x.id_cafe === actualizado.id_cafe ? actualizado : x)
          );
        })
      );
  }

  // =============================
  // BORRAR — elimina de la vista
  // =============================
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          this._productos.update(lista =>
            lista.filter(x => x.id_cafe !== id)
          );
        })
      );
  }
}
