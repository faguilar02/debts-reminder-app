import {
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Debt } from '../../interfaces/debt.interface';
import { DebtsService } from '../../services/debts.service';
import { CommonModule } from '@angular/common';
import { DebtCardComponent } from '../../components/debt-card/debt-card.component';
import { CalendarModule } from 'primeng/calendar';
import { FilterMonthYearComponent } from '../../components/filter-month-year/filter-month-year.component';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, DebtCardComponent, CalendarModule, FilterMonthYearComponent],
  templateUrl: './debts-list.component.html',
  styleUrl: './debts-list.component.css',
})
export default class DebtsListComponent {
  private debtsService = inject(DebtsService);
  private authService = inject(AuthService)
  public debts = computed<Debt[]>(() => this.debtsService.debts())
  public currentUser = computed( () => this.authService.currentUser())


  getFilteredDate(date: string): void {

    this.debtsService.filterDebts(date);
    console.log(this.debts())
  }

}
