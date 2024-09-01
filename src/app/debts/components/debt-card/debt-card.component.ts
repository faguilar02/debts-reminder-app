import { Component, inject, input } from '@angular/core';
import { Debt } from '../../interfaces/debt.interface';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DebtsService } from '../../services/debts.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'debt-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  templateUrl: './debt-card.component.html',
  styles: ``,
})
export class DebtCardComponent {
  public debt = input.required<Debt>();

  private debtsService = inject(DebtsService);

  public getDebtColor(debt: Debt) {
    return `bg-${debt.color}-600`;
  }

  ngOnInit(): void {
    this.setDebtAsComplete(this.debt())
  }

  setDebtAsComplete(debt: Debt) {

    this.debtsService.setDebtAsComplete(debt);
  }

  deleteDebt(debt:Debt){
    this.debtsService.deleteDebt(debt)
  }
}
