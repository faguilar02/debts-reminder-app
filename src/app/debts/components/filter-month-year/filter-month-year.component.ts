import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'debt-filter-month-year',
  standalone: true,
  imports: [
    CalendarModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-month-year.component.html',
  styles: ``,
})
export class FilterMonthYearComponent {

  public onFilter = output<string>()
  private fb = inject(FormBuilder);
  public myForm: FormGroup = this.fb.group({
    date: [''],
  });


  onDateChange() {
    if(this.myForm.invalid) return
    const date:Date = this.myForm.controls['date'].value;
    const dateFilter = date.toISOString().split('T')[0]
    this.onFilter.emit(dateFilter)

}
}
