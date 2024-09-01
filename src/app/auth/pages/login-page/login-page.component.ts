import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../interfaces/user.interface';
import { ValidatorsService } from '../../../validators/validators.service';
import { EmailLoginValidatorsService } from '../../../validators/email-login-validators.service';


@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export default class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private validatorService = inject(ValidatorsService)
  private emailLoginValidatorsService = inject(EmailLoginValidatorsService)

  private authService = inject(AuthService);

  public currentUser = computed(() => this.authService.currentUser());

  public myForm: FormGroup = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(this.validatorService.emailPattern)],
      [this.emailLoginValidatorsService]
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void { }

  login() {
    if (this.myForm.invalid) return;
    const user: User = this.myForm.value;
    const result = this.authService.login(user);
    if(!result) return
    this.route.navigateByUrl('/');
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field)
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.myForm, field)
  }

  isCorrectPassword(control: AbstractControl): ValidationErrors | null {
    const email = this.myForm.get('email')?.value;
    const password = control.value;
    const user = this.authService.users().find(u => u.email === email);

    if (!user) return null;

    if (user.password !== password) {
      return { incorrectPassword: true };
    }

    return null;
  }
}
