import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DebtsService } from '../debts/services/debts.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class DebtCodeValidatorsService implements AsyncValidator {
  constructor(private authService:AuthService, private debtsService:DebtsService, private router:Router) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const code = control.value
    const httpCallObservable = new Observable<ValidationErrors | null>( (subscriber) => {

      const codeExists = this.debtsService.debts().some( (d) => d.code === code)

      if(codeExists && !this.router.url.includes('edit')){
        subscriber.next({codeExists:true})
      }

      else{
        subscriber.next(null)
      }

      subscriber.complete()
    }).pipe(
      delay(2000)
    )

    return httpCallObservable
  }


}
