import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class UsernameValidatorsService implements AsyncValidator {
  constructor(private authService:AuthService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    const username = control.value
    const httpCallObservable = new Observable<ValidationErrors | null>( (subscriber) => {

      const usernameExists = this.authService.users().some( (u) => u.username === username)

      if(usernameExists){
        subscriber.next({usernameTaken:true})

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

