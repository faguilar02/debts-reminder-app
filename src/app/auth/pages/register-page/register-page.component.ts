import { Component, computed, inject, Injector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../auth.service';
import { ValidatorsService } from '../../../validators/validators.service';
import { EmailValidatorsService } from '../../../validators/email-validators.service';
import { UsernameValidatorsService } from '../../../validators/username-validators.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export default class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);
  private emailValidatorService = inject(EmailValidatorsService);
  private usernameValidatorService = inject(UsernameValidatorsService)
  private route = inject(Router);
  public users = computed(() => this.authService.users());


  public myForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)], [this.usernameValidatorService]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
      [this.emailValidatorService],
    ],

    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const user: User = this.myForm.value;

    const userExists = this.authService.verifyEmailExists(user);

    if (userExists) return;

    this.authService.register(user);

    this.myForm.reset();

    this.route.navigateByUrl('auth/login');
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }
}
