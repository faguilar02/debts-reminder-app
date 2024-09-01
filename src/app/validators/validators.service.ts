import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {


  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';


  isValidField(form:FormGroup, field:string):boolean | null{
    return form.controls[field].errors && form.controls[field].touched
  }

  getFieldError(form:FormGroup, field:string):string | null{
    if(!form.controls[field]) return null

    const errors = form.controls[field].errors || {}

    for(const key of Object.keys(errors)){

      switch(key){
        case 'required':
          return 'Este campo es requerido';

        case 'emailTaken':
          return 'Este correo ya está registrado'

        case 'emailNotExists':
          return 'Este correo no está registrado'

        case 'usernameTaken':
          return 'Este nombre de usuario ya está registrado'

        case 'codeExists':
          return 'Este código de deuda ya está registrado'

        case 'pattern':
          return 'Formato de correo inválido'

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`

        case 'min':
          return `El valor mínimo es de S/.${errors['min'].min}`
      }
    }

    return null
  }



}
