import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { Debt } from '../interfaces/debt.interface';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class DebtsService {
  private userService = inject(AuthService);
  private _debts = signal<Debt[]>([]); // Señal que almacena todas las deudas
  private _filteredDebts = signal<Debt[] | null>(null); // Señal que almacena las deudas filtradas
  public user = computed(() => this.userService.currentUser());
  public debts = computed(
    () =>
      this._filteredDebts() ??
      this._debts().filter((d) => d.userId === this.user()?.id)
  );

  constructor() {
    this.loadLocalStorage();
  }

  addDebt(debt: Debt): void {
    const fechaFormateada = new Date(debt.dueDate).toISOString().split('T')[0];
    const color = this.setDebtColor(debt);
    const user = this.user();

    if (!user) {
      this._debts.update((debts) => [
        ...debts,
        {
          ...debt,
          id: uuid(),
          dueDate: fechaFormateada,
          color: color,
        },
      ]);

      this.saveLocalStorage();
      this.clearFilter();

      return;
    }

    this._debts.update((debts) => [
      ...debts,
      {
        ...debt,
        id: uuid(),
        dueDate: fechaFormateada,
        color: color,
        userId: user.id,
        username: user.username,
        userEmail: user.email,
      },
    ]);

    this.saveLocalStorage();
    this.clearFilter();
  }

  saveLocalStorage(): void {
    localStorage.setItem('debts', JSON.stringify(this._debts()));
  }

  loadLocalStorage(): void {
    if (!localStorage.getItem('debts')) return;

    this._debts.set(JSON.parse(localStorage.getItem('debts')!));
  }

  setDebtColor(debt: Debt): string {
    const diasRestantes = this.calcularDiferenciaEnDias(debt.dueDate);

    let color = '';

    if (diasRestantes < 0) {
      color = 'red';
    } else if (diasRestantes <= 7) {
      color = 'amber';
    } else {
      color = 'neutral';
    }

    this.updateDebtColor(debt, color);

    return color;
  }

  updateDebtColor(debt: Debt, color: string): void {
    this._debts.update((debts) =>
      debts.map((d) => (d.code === debt.code ? { ...d, color: color } : d))
    );
  }

  setDebtAsComplete(debt: Debt): void {
    if (debt.state === 'No Pagada') {
      return;
    }

    this.updateDebtColor(debt, 'green');

    this.saveLocalStorage();
    this.clearFilter();
  }

  calcularDiferenciaEnDias(fechaVencimiento: string): number {
    const fechaActual = new Date();
    const fechaVencimientoDate = new Date(fechaVencimiento);

    const diferenciaTiempo =
      fechaVencimientoDate.getTime() - fechaActual.getTime();

    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

    return diferenciaDias;
  }

  deleteDebt(debt: Debt) {
    this._debts.update((debts) => debts.filter((d) => d.id !== debt.id));
    this.saveLocalStorage();
    this.clearFilter();
  }

  getDebtById(id: string) {
    const debt = this.debts().find((debt) => debt.id === id);
    return debt;
  }

  uptadeDebt(debt: Debt) {
    this._debts.update((debts) =>
      debts.map((d) => (d.id === debt.id ? debt : d))
    );
    this.setDebtColor(debt);
    this.saveLocalStorage();
    this.clearFilter();
  }

  filterDebts(filterDate: string): void {
    const [filterYear, filterMonth] = filterDate.split('-');
    const filteredDebts = this._debts().filter((debt) => {
      const [year, month] = debt.dueDate.split('-');
      return (
        year === filterYear &&
        month === filterMonth &&
        debt.userId === this.user()!.id
      );
    });
    this._filteredDebts.set(filteredDebts);
  }

  clearFilter(): void {
    this._filteredDebts.set(null); // Limpiamos el filtro para mostrar todas las deudas
  }

  verificarUniqueCode(debt: Debt) {
    const result = this.debts().find((d) => d.code === debt.code);

    return result;
  }

}
