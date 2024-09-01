import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DebtsService } from '../../services/debts.service';
import { Debt } from '../../interfaces/debt.interface';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { ValidatorsService } from '../../../validators/validators.service';
import { DebtCodeValidatorsService } from '../../../validators/debt-code-validators.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './new-debt.component.html',
  styleUrl: './new-debt.component.css',
})
export default class NewDebtComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private validatorsService = inject(ValidatorsService);
  private debtCodeValidatorsService = inject(DebtCodeValidatorsService);
  private debtsService = inject(DebtsService);
  private userService = inject(AuthService);
  public user = computed(() => this.userService.currentUser());



  public myForm: FormGroup = this.fb.group({
    id: [''],
    code: [
      '',
      [Validators.required, Validators.minLength(6)],
      [this.debtCodeValidatorsService],
    ],
    company: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    dueDate: ['', [Validators.required]],
    state: ['No Pagada', [Validators.required]],
  });

  get currentDebt(): Debt {
    const debt = this.myForm.value as Debt;
    return debt;
  }

  get currentUser(): User | undefined {
    const user = this.user();
    return user;
  }

  ngOnInit(): void {
    this.myForm.reset({
      code: '',
      company: '',
      amount: 0,
      dueDate: '',
      state: 'No Pagada',
    });

    if (!this.route.url.includes('edit')) return;

    this.activatedRoute.params.subscribe(({ id }) => {
      const debt = this.debtsService.getDebtById(id);

      return !debt
        ? this.route.navigateByUrl('/debts/debts-list')
        : this.myForm.reset(debt);
    });
  }

  onSubmit() {
    if (this.myForm.invalid) return;

    if (!this.currentUser) return;

    const user = {
      userId: this.currentUser.id,
      username: this.currentUser.username,
      userEmail: this.currentUser.email,
    };

    const debt: Debt = { ...this.myForm.value, ...user };

    if (
      !this.route.url.includes('edit') && // si no estamos en la ruta edit
      this.debtsService.verificarUniqueCode(debt) // y además mi metodo retorna algo o encuentra una debt con ese code, retorna
    )
      return;

    if (debt.id) {
      this.debtsService.uptadeDebt(debt);
      this.route.navigateByUrl('/debts');

      return;
    }

    this.debtsService.addDebt(debt);
    this.myForm.reset({ code: '', company: '', amount: 0, state: 'No Pagada' });
    this.route.navigateByUrl('/debts');
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.myForm, field);
  }
}
