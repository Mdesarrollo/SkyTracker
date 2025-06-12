import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserLoginRecord } from '../services/user.service';
import { Timestamp } from 'firebase/firestore'; // Importar Timestamp
import { Subscription } from 'rxjs'; // Importar Subscription

@Component({
  selector: 'app-user-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.css',
})
export class UserHistoryComponent implements OnInit, OnDestroy {
  userLoginHistory: UserLoginRecord[] = [];
  filteredLoginHistory: UserLoginRecord[] = [];
  searchTerm: string = '';
  selectedDate: string = ''; // Usar string para input type="date"
  sortBy: string = 'timestamp';
  sortDirection: 'asc' | 'desc' = 'desc';

  private dataSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    // await this.loadAllUsers();
    console.log('UserHistoryComponent: ngOnInit se ha iniciado. Iniciando suscripción a datos en tiempo real.');
    this.subscribeToUserLogins(); // Inicia la suscripción al inicializar
  }

  ngOnDestroy() {
    // Es crucial desuscribirse cuando el componente se destruye para evitar fugas de memori
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      console.log('UserHistoryComponent: Suscripción a datos en tiempo real desuscrita.');
    }
  }

  subscribeToUserLogins() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    console.log(`UserHistoryComponent: Suscribiéndose con sortBy=${this.sortBy}, sortDirection=${this.sortDirection}`);
    this.dataSubscription = this.userService
      .getAllUsersRealtime(this.sortBy, this.sortDirection)
      .subscribe(
        (data) => {
          console.log('UserHistoryComponent: Datos recibidos en tiempo real:', data.length, 'registros.');
          this.userLoginHistory = data; // Actualiza los datos crudos con los nuevos datos de Firestore
          this.applyFilters(); // Vuelve a aplicar filtros y ordenamiento sobre los nuevos datos
        },
        (error) => {
          console.error('UserHistoryComponent: Error al obtener datos en tiempo real:', error);
          // Puedes mostrar un mensaje de error al usuario aquí
        }
      );
  }

  applyFilters() {
    console.log('UserHistoryComponent: Aplicando filtros. Datos brutos:', this.userLoginHistory.length);
    let tempHistory = [...this.userLoginHistory]; // Trabaja en una copia para no modificar el original

    // 1. Filtrar por término de búsqueda (nombre o correo electrónico)
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      tempHistory = tempHistory.filter(
        (entry) =>
          (entry.displayName && entry.displayName.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (entry.email && entry.email.toLowerCase().includes(lowerCaseSearchTerm))
      );
      console.log('Después de filtro por búsqueda:', tempHistory.length);
    }

    // 2. Filtrar por fecha específica
    if (this.selectedDate) {
      // Importante: Asegurarse de que la fecha seleccionada se interprete correctamente (sin problemas de zona horaria)
      // Agregamos 'T00:00:00' para asegurar que se parsea como la medianoche local
      const selectedDateTime = new Date(this.selectedDate + 'T00:00:00');

      tempHistory = tempHistory.filter((entry) => {
        if (entry.timestamp && typeof entry.timestamp.toDate === 'function') {
          const entryDate = entry.timestamp.toDate(); // Convierte el Timestamp de Firestore a un objeto Date de JS

          // Compara solo el día, mes y año de ambas fechas.
          // Esto maneja la comparación de fechas sin considerar la hora.
          return (
            entryDate.getFullYear() === selectedDateTime.getFullYear() &&
            entryDate.getMonth() === selectedDateTime.getMonth() &&
            entryDate.getDate() === selectedDateTime.getDate()
          );
        }
        return false;
      });
      console.log('Después de filtro por fecha:', tempHistory.length);
    }

    this.filteredLoginHistory = tempHistory; // Actualiza los datos que se mostrarán en la tabla
    this.sortData(); // Vuelve a ordenar los datos filtrados
    console.log('filteredLoginHistory final:', this.filteredLoginHistory.length);
  }

  sortData() {
    this.filteredLoginHistory.sort((a, b) => {
      let valueA;
      let valueB;

      if (this.sortBy === 'timestamp') {
        valueA = a.timestamp ? a.timestamp.toDate().getTime() : 0;
        valueB = b.timestamp ? b.timestamp.toDate().getTime() : 0;
      } else if (this.sortBy === 'displayName') {
        // Asegúrate de que los valores sean strings para toLowerCase
        valueA = (a.displayName || '').toLowerCase();
        valueB = (b.displayName || '').toLowerCase();
      } else if (this.sortBy === 'email') {
        valueA = (a.email || '').toLowerCase();
        valueB = (b.email || '').toLowerCase();
      } else {
        return 0; // No hay criterio de ordenamiento, mantener el orden actual
      }

      // Lógica de comparación para asc/desc
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    console.log('Datos ordenados.');
  }

  toggleSortDirection(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc'; // Por defecto, ascendente al cambiar de columna
    }
    console.log(`Ordenando por: ${this.sortBy}, dirección: ${this.sortDirection}`);
    this.applyFilters(); // Vuelve a aplicar filtros y ordenar con el nuevo criterio
  }

  // Utilidad para formatear la marca de tiempo de Firestore a una fecha legible
  formatTimestamp(timestamp: any): string {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    return 'N/A';
  }

  resetFiltersAndShowAll() {
    this.searchTerm = '';
    this.selectedDate = '';
    console.log('Filtros reiniciados. Mostrando todos los usuarios.');
    this.applyFilters(); // Aplica los filtros (ahora vacíos) a los datos ya cargados
  }

  forceReloadData() {
    this.searchTerm = '';
    this.selectedDate = '';
    console.log('Forzando recarga de datos desde Firestore.');
    this.subscribeToUserLogins(); // Desuscribe y vuelve a suscribirse
  }

}
